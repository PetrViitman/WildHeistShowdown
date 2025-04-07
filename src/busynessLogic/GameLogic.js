const ERROR_CODES = { OUT_OF_BALANCE: 200 }


export class GameLogic {
	payout
	winMap
	coefficients
	betsOptions = []
	balance = 0
	currencyCode = ''
	winCurrencyCode = ''
	bet
	minimalBet
	maximalBet
	multiplier = 1
	accounts
	accountId
	activeBonusDescriptor
	buyFeatureBetMultiplier = 1
	webAPI
	accounts = []
	activeAccount

	constructor({webAPI, presentation}) {
		this.webAPI = webAPI
		this.presentation = presentation
	}

	updateBetsOptions(recommendedBet) {
		const {
			minimalBet,
			maximalBet,
		} = this

		const betsOptions = [minimalBet]
		const maximalBetString = Math.trunc(maximalBet) + ''
		const maximalBetLength = maximalBetString.length
		const prettierMaximalBet =
		  Math.round(maximalBet / 10 ** (maximalBetLength - 1)) * 10 ** (maximalBetLength - 1)
		
		const betStep = Math.max(10, prettierMaximalBet / 50)

		let bet = Math.max(betStep, minimalBet)
		if (bet === minimalBet) {
			bet += betStep
		}
		while (bet < maximalBet) {
			betsOptions.push(bet)
			bet += betStep
		}

		betsOptions.push(maximalBet)
		
		
		this.betsOptions = betsOptions
		this.bet = recommendedBet ?? this.betsOptions[1]
	}

	async init() {
		const {
			coefficients,
			accounts,
			buyFeatureBetMultiplier,
			minimalBet,
			maximalBet,
			balance,
			currencyCode
		} = await this.webAPI.gameDescription()

		// DEBUG...
		console.log({
			coefficients,
			accounts,
			buyFeatureBetMultiplier,
			minimalBet,
			maximalBet,
			balance,
			currencyCode
		})

		accounts.forEach((account, i) => account.id = i)
		accounts[0].isActive = true
		this.activeAccount = accounts[0]
		// ...DEBUG

		this.coefficients = coefficients
		this.balance = balance
		this.currencyCode = currencyCode
		this.accounts = accounts
		this.minimalBet = minimalBet
		this.maximalBet = maximalBet
		this.buyFeatureBetMultiplier = buyFeatureBetMultiplier
		this.updateBetsOptions(this.recommendedBetSum)

		await this.presentation?.init?.({
			currencyCode,
			betsOptions: this.betsOptions,
			bet: this.bet,
			minimalBet,
			maximalBet,
			balance,
			coefficients,
			accounts,
			buyFeatureBetMultiplier
		})

		this.idle()
	}

	async error({errorCode, isFatal = false}) {
		this.payout = 0
		this.winMap = []
		this.presentation?.presentError?.(errorCode)
		await this.presentation?.presentSpinStop?.({})
		isFatal || this.idle()
	}

	changeBet(bet) {
		this.bet = bet
		this.idle()
	}

	async changeAccount(account) {
		this.accounts.forEach(account => account.isActive = false)
		this.presentation?.presentNetworkStatus?.(false)
		this.activeBonusDescriptor = undefined
		const accountId = account.id

		const {
			accounts,
			minimalBet,
			maximalBet,
			currencyCode,
			balance,
		} = await this.webAPI.gameDescription({accountId: account.id})

		this.presentation?.presentNetworkStatus?.()

		this.accounts = accounts
		account.isActive = true
		this.activeAccount = this.accounts.find(({id}) => id === accountId)

		this.activeAccount.isActive = true

		this.minimalBet = minimalBet
		this.maximalBet = maximalBet
		this.currencyCode = this.activeAccount.currency.code

		this.balance = balance
		this.updateBetsOptions()

		this.idle()
	}


	async requestBonuses() {
		this.presentation?.presentNetworkStatus?.(false)
		const {
			bonuses,
		} = await this.webAPI.getGameBonuses()

		this.presentation?.presentNetworkStatus?.()

		await this.presentation?.presentBonuses?.(bonuses)

		this.idle()
	}

	triggerBonus(bonusDescriptor) {
		//{name: 'game', params: {id: number, bonus?: {type: 1 | 2 | 3, id: number}, demo?: 0 | 1 | 2}}

		this.activeBonusDescriptor = bonusDescriptor
		this.idle()
	}

	async makeBet({
		bet = this.bet,
		desiredReels,
		isBuyFeatureRequest
	}) {
		const { presentation, buyFeatureBetMultiplier } = this
		const multipliedBet = isBuyFeatureRequest ? (bet * buyFeatureBetMultiplier) : bet
		const balanceBeforePayouts = Math.max(0, this.balance - multipliedBet)

		// preventing invalid bet request on client side if possible
		if(this.balance < multipliedBet)
			return this.error({errorCode: ERROR_CODES.OUT_OF_BALANCE})

		const request = this.webAPI.makeBet({
			accountId: this.activeAccount.id,
			desiredReels,
			bet,
			isBuyFeatureRequest,
		})

		await presentation?.presentSpinStart?.({ // let it spin while fetching
			balance: balanceBeforePayouts,
			multiplier: this.multiplier,
			currencyCode: this.currencyCode,
		})

		this.presentation?.presentNetworkStatus?.(false)

		const {
			errorCode,
			balance,
			currencyCode,
			steps,
			totalCoefficient,
        	totalPayout,
		} = await request

		this.presentation?.presentNetworkStatus?.()

		this.winCurrencyCode = currencyCode
		// retrieving final balance anyways 
		this.balance = balance ?? this.balance

		if (errorCode) return this.error({errorCode})

		let isFreeSpinsMode
		let commonPayout = 0
		this.multiplier = 1

		for (let i = 0; i < steps.length; i++) {
			const step = steps[i]
			const {
				reels,
				winMap,
				reelsPatch,
				freeSpinsCount,
				awardedFreeSpinsCount = 0,
			} = step

			const stepPayout = step.payout ?? 0
			const stepCoefficient = step.coefficient ?? 1
			// бекендер не захотел помечать минусом такие вины,
			// т.к. у меня помечаются, здесь откатываю, как у него чтоб было
			winMap?.forEach(reel => reel.forEach((value, y) => reel[y] = Math.abs(value)))

			this.winMap = winMap

			if(reels) {
				// 1st step spin is already started 
				i && await presentation?.presentSpinStart?.({
					balance: balanceBeforePayouts,
					commonPayout,
					freeSpinsCount,
					currencyCode,
					multiplier: this.multiplier
				})

				this.multiplier = isFreeSpinsMode ? 8 : 1

				await presentation?.presentSpinStop?.({
					targetSymbols: reels,
					payout: stepPayout || awardedFreeSpinsCount,
					isBonusPurchased: !i && isBuyFeatureRequest
				})
			}

			commonPayout += stepPayout

			if (stepPayout) {
				await presentation?.presentWin?.({
					coefficient: stepCoefficient,
					payout: stepPayout,
					commonPayout: (i < steps.length - 1)
						? commonPayout
						: totalPayout,
					currencyCode,
				})
			} else if (
				!isFreeSpinsMode
				&& !awardedFreeSpinsCount
			) {
				await presentation?.presentLose?.()
			}

			if(reelsPatch) {
				await Promise.all([
					presentation?.presentCascade?.({
						payout: stepPayout,
						currencyCode,
						corruptionMap: winMap,
						patchMap: reelsPatch,
						multiplier: this.multiplier
					})
				])
			}

			if (stepPayout) {
				this.multiplier *= 2
			}

			if (awardedFreeSpinsCount) {
				if(isFreeSpinsMode) {
					await presentation?.presentFreeSpinsAward?.({
						freeSpinsCount: freeSpinsCount + awardedFreeSpinsCount,
						awardedFreeSpinsCount,
					})
				} else {
					isFreeSpinsMode = true
					await presentation?.presentTransitionToBonusGame?.({
						awardedFreeSpinsCount,
						multiplier: this.multiplier
					})

					this.multiplier = 8
				}
			}
		}

		if (isFreeSpinsMode) {
			this.winMap = undefined
			await presentation?.presentTransitionToDefaultGame?.({
				payout: totalPayout,
				currencyCode,
				balance,
				multiplier: this.multiplier
			})
			this.multiplier = 1
		} else if (totalPayout) {
			await presentation?.presentTotalWin?.({
				totalCoefficient,
				totalPayout,
				currencyCode,
				balance
			})
		}

		this.payout = totalPayout
		this.activeBonusDescriptor = undefined

		this.idle()
	}

	makeCheatBet({
		reels,
		riskOption,
		specialSymbolId
	}) {
		return this.makeBet({
			desiredReels: reels,
			riskOption,
			specialSymbolId
		})
	}

	async idle() {
		const {
			bet,
			balance,
			currencyCode,
			winCurrencyCode,
			presentation,
			betsOptions,
			winMap,
			payout,
			minimalBet,
			maximalBet,
			activeBonusDescriptor,
			accounts
		} = this
		
		const {
			key,
			value
		} = await presentation?.getUserInput?.({
			betsOptions,
			bet,
			balance,
			winMap,
			payout,
			currencyCode,
			winCurrencyCode,
			minimalBet,
			maximalBet,
			activeBonusDescriptor,
			accounts
		}) ?? {}

		const actionsMap = {
			'change_bet': (bet) => { this.changeBet(bet) },
			'change_account': (account) => { this.changeAccount(account) },
			'trigger_bonus': (bonusDescriptor) => { this.triggerBonus(bonusDescriptor) },
			'make_bet': () => { this.makeBet({}) },
			'buy_feature': () => { this.makeBet({isBuyFeatureRequest: true}) },
			'make_cheat_bet': ({
				reels,
				riskOption,
				specialSymbolId
			}) => {
				this.makeCheatBet({
					reels,
					riskOption,
					specialSymbolId
				})
			},
			'request_bonuses': () => { this.requestBonuses() },
			'idle': () => { this.idle() },
			'home': () => { this.idle() },
			'request_sign_in': () => { this.idle() }
		}

		if(!actionsMap[key])
			return this.error({
				errorCode: 'Fatal Error, unknown user input',
				isFatal: true
			})

		actionsMap[key](value)
	}
}
