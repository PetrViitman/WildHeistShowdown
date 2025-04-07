export const REELS_COUNT = 6

export const REELS_LENGTHS = [3, 4, 5, 5, 4, 3]
export const LOW_VALUE_IDS = [
	1, // ♣️ CLUBS
	2, // ♥️ HEARTS
	3, // ♦️ DIAMONDS
	4, // ♠️ SPADES
]
export const HIGH_VALUE_IDS = [
	5, // RUM
	6, // HAT
	7, // PISTOL
	8, // WATCHES
]

export const WILD_SYMBOL_ID = 9
export const SCATTER_SYMBOL_ID = 10

export const REGULAR_SYMBOLS_IDS = [...LOW_VALUE_IDS, ...HIGH_VALUE_IDS]
export const SPECIAL_SYMBOLS_IDS = [SCATTER_SYMBOL_ID, WILD_SYMBOL_ID]

export const REGULAR_REELS_SYMBOLS_IDS = [
	REGULAR_SYMBOLS_IDS,
	REGULAR_SYMBOLS_IDS,
	REGULAR_SYMBOLS_IDS,
	REGULAR_SYMBOLS_IDS,
	REGULAR_SYMBOLS_IDS,
	REGULAR_SYMBOLS_IDS,
]

export const SYMBOLS_IDS = [
	...REGULAR_SYMBOLS_IDS,
	...SPECIAL_SYMBOLS_IDS
]

export const COEFFICIENTS = {
	1: {3: 0.05, 4: 0.1,  5: 0.15,  6: 0.25}, // ♣️ CLUBS
	2: {3: 0.05, 4: 0.1,  5: 0.15,  6: 0.25}, // ♥️ HEARTS
	3: {3: 0.1,  4: 0.2,  5: 0.3,   6: 0.5 }, // ♦️ DIAMONDS
	4: {3: 0.1,  4: 0.2,  5: 0.3,   6: 0.5 }, // ♠️ SPADES
	5: {3: 0.25, 4: 0.5,  5: 0.75,  6: 1.0 }, // RUM
	6: {3: 0.25, 4: 0.5,  5: 0.75,  6: 1.0 }, // HAT
	7: {3: 0.4,  4: 0.75, 5: 1.0,   6: 1.5 }, // PISTOL
	8: {3: 0.5,  4: 1.0,  5: 1.5,   6: 2.5 }, // COWBOY
}

export class SlotMachine {
	probability
	lowValueIds = LOW_VALUE_IDS
	highValueIds = HIGH_VALUE_IDS
	regularSymbolsIds = REGULAR_SYMBOLS_IDS
	specialSymbolsIds = SPECIAL_SYMBOLS_IDS

	statistics = {
		common: {
			bigWinsCount: 0,
			hugeWinsCount: 0,
			megaWinsCount: 0,
			spinsCount: 0,
			totalCoefficient: 0,
			maxCoefficient: 0,
			hitRate: 0,
			hitsCount: 0,
			rtp: 0
		},
		defaultGame: {
			spinsCount: 0,
			totalCoefficient: 0,
			maxCoefficient: 0,
			hitRate: 0,
			hitsCount: 0,
			rtp: 0
		},
		bonusGame: {
			spinsCount: 0,
			totalCoefficient: 0,
			maxCoefficient: 0,
			hitRate: 0,
			hitsCount: 0,
			rtp: 0
		},
	}

	constructor(probability) {
		this.probability = probability
	}

	roll({
		probabilities = this.probability.defaultSpins,
		desiredReels,
		isBonusPurchased
	}) {

		const {
			regularSymbolsProbability,
			specialSymbolsProbability,
		} = probabilities

		
		const reels = new Array(REELS_COUNT)
			.fill(0)
			.map((_, x) => new Array(REELS_LENGTHS[x])
			.fill(0)
			.map(_ => 0))

		if (desiredReels) {
			reels.forEach((reel, x) => reel.forEach((_, y) =>
				reel[y] = desiredReels[x][y] ?? 0))

			return reels
		}

		if (isBonusPurchased) {
			let availableSymbols = [...REGULAR_SYMBOLS_IDS]
			for (let x = 0; x < reels.length; x++) {
				for (let y = 0; y < REELS_LENGTHS[x]; y++) {
					if (!availableSymbols.length)
						availableSymbols = [...REGULAR_SYMBOLS_IDS]
					
					const randomNumber = Math.random()
					const randomSymbolIndex = Math.trunc(randomNumber * availableSymbols.length)
					reels[x][y] = availableSymbols[randomSymbolIndex]
					availableSymbols.splice(randomSymbolIndex, 1)
				}
			}

			let remainingScattersCount = 3
			while(remainingScattersCount) {
				let randomNumber = Math.random()
				const x = Math.trunc(randomNumber * REELS_COUNT)
				randomNumber = Math.random()
				const y = Math.trunc(randomNumber * REELS_LENGTHS[x])
				
				if(reels[x][y] !== SCATTER_SYMBOL_ID) {
					reels[x][y] = SCATTER_SYMBOL_ID
					remainingScattersCount--
				}
			}

			return reels
		}
		
		for (let x = 0; x < reels.length; x++) {
			const reel = reels[x]
			for (let y = 0; y < REELS_LENGTHS[x]; y++) {
				const symbolsIds = REGULAR_REELS_SYMBOLS_IDS[x]
				const randomNumber = Math.random()
				let probabilityOffset = 0

				// REGULAR SYMBOLS...
				for (let i = 0; i < symbolsIds.length; i++) {
					const id = symbolsIds[i]
					const symbolProbability = probabilityOffset + regularSymbolsProbability[id][x][y]	
					if (
						regularSymbolsProbability[id][x][y]
						&& randomNumber <= symbolProbability
					) {
						reel[y] = id
						break
					}
		
					probabilityOffset = symbolProbability
				}
				// ...REGULAR SYMBOLS
			}

			// GOLDEN FRAMES...
			if (x >= 2 && x <= 3) {
				const goldenFramesProbability = specialSymbolsProbability.goldenFrames

				const targetProbabilityArray = goldenFramesProbability[x - 2]
				for(let y = 0; y < targetProbabilityArray.length; y++) {
					const randomNumber = Math.random()
					if (randomNumber <= targetProbabilityArray[y])
						reels[x][y] *= -1

				}
			}
			// ...GOLDEN FRAMES

			// SPECIAL SYMBOLS SUBSTITUTION...
			// WILD...
			const wildProbability = specialSymbolsProbability.wild
			
			let randomNumber = Math.random()
			if (randomNumber < wildProbability[x]) {
				randomNumber = Math.random()
				reel[Math.trunc(randomNumber * REELS_LENGTHS[x])] = WILD_SYMBOL_ID
			}
			// ...WILD

			// SCATTER...
			const scatterProbability = specialSymbolsProbability.scatter
			randomNumber = Math.random()
			if (randomNumber < scatterProbability[x]) {
				randomNumber = Math.random()
				reel[Math.trunc(randomNumber * REELS_LENGTHS[x])] = SCATTER_SYMBOL_ID
			}
			// ...SCATTER
			// ...SPECIAL SYMBOLS SUBSTITUTION
		}


		// shuffling each individual reel, as symbols order makes no impact
		const shuffledReels = reels.map(reel => [])
		reels.forEach((reel, x) => {
			const symbolsIds = reel.map(symbolId => symbolId)

			for (let i = 0; i < REELS_LENGTHS[x]; i++) {
				// This pseudo random shuffling makes no effect on RTP, therefor it's just for esthetics
				const randomSymbolIndex = Math.trunc(Math.random() * symbolsIds.length)
				shuffledReels[x].push(symbolsIds[randomSymbolIndex])

				symbolsIds.splice(randomSymbolIndex, 1)
			}
		})

		return shuffledReels
	}


	getWinDescriptor(reels, multiplier = 1) {
		const winMap = reels.map(reel => reel.map(_ => 0))
		let coefficient = 0

		REGULAR_SYMBOLS_IDS.forEach(symbolId => {
			const map = reels.map(reel => reel.map(_ => 0))
			let winWidth = 0
			// let winLinesCount = 0

			for(let x = 0; x < reels.length; x++ ) {
				let isWinReel = false
				// let winSymbolsPerReelCount = 0
				reels[x].forEach((reelSymbolId, y) => {				
					if (
						reelSymbolId === WILD_SYMBOL_ID
						|| symbolId === Math.abs(reelSymbolId)
					) {
						map[x][y] = reelSymbolId
						isWinReel = true
						// winSymbolsPerReelCount++
					}
				})

				if(!isWinReel) break

				winWidth++

				//if(winSymbolsPerReelCount > winLinesCount)
				//	winLinesCount = winSymbolsPerReelCount
			}

			if(winWidth >= 3) {
				let winLinesMultiplier = 1
				for(let x = 0; x < winWidth; x++) {
					let winSymbolsPerReelCount = 0

					map[x].forEach(value => {
						if(value) {
							winSymbolsPerReelCount++
						}
					})

					winLinesMultiplier *= winSymbolsPerReelCount
				}

				coefficient += COEFFICIENTS[symbolId][winWidth] * winLinesMultiplier * multiplier
				for(let x = 0; x < REELS_COUNT; x++)
					for(let y = 0; y < reels[x].length; y++) {
						if(!map[x][y]) continue
						if(winMap[x][y]) continue

						winMap[x][y] = reels[x][y] > 0 ? 1 : -1
					}
			}
		})

		if(!coefficient) return

		coefficient = Number(coefficient.toFixed(2))

		return {
			winMap,
			coefficient,
			multiplier,
		}
	}

	getReelsPatch(cascadedReels, isFreeSpinsMode) {
		const {defaultCascades, bonusCascades} = this.probability
		const reels = this.roll({ probabilities: isFreeSpinsMode ? bonusCascades : defaultCascades })
		const reelsPatch = cascadedReels.map((reel, x) => {
			let cellsCount = 0
			for(let y = 0; y < reel.length; y++) {
				if(reel[y] !== 0) break
				cellsCount++
			}

			const singleReelPatch = []
			
			for(let y = 0; y < cellsCount; y++)
				singleReelPatch.push(reels[x][y])

			return singleReelPatch
		})

		return reelsPatch
	}

	cascadeReels(reels, corruptionMap, isFreeSpinsMode) {
		// MAPPING CASCADE...
		const cascadeMap = reels.map(reel => reel.map(_ => 0))
		for(let x = 0; x < REELS_COUNT; x++) {
			let distance = 0
			for(let y = reels[x].length - 1; y >= 0; y--) {    
				if(corruptionMap[x][y] > 0) {
					distance++
					cascadeMap[x][y] = 0
				} else {
					cascadeMap[x][y] = distance
				}
			}
		}
		// ...MAPPING CASCADE

		// CORRUPTION...
		for (let x = 0; x < REELS_COUNT; x++)
			for(let y = 0; y < reels[x].length; y++)
				if(corruptionMap[x][y] === 1)
					reels[x][y] = 0
				else if (corruptionMap[x][y] === -1)
					reels[x][y] = WILD_SYMBOL_ID
		// ...CORRUPTION

		// FALL...
		for (let x = 0; x < REELS_COUNT; x++)
			for(let y = reels[x].length - 1; y >= 0; y--)
				if(cascadeMap[x][y]) {
					reels[x][y + cascadeMap[x][y]] = reels[x][y]
					reels[x][y] = 0
				}
		// ...FALL

		// PATCH...
		const reelsPatch = this.getReelsPatch(reels, isFreeSpinsMode)
		for (let x = 0; x < REELS_COUNT; x++)
			for(let y = 0; y < reelsPatch[x].length; y++)
				reels[x][y] = reelsPatch[x][y]
		// ...PATCH

		return reelsPatch
	}

	getCascadeSteps({
		bet,
		reels,
		multiplier = 1,
		isFreeSpinsMode
	}) {
		const steps = []
		let winDescriptor

		do {

			const step = {multiplier}
			const isFirstStep = !steps.length

			winDescriptor = this.getWinDescriptor(reels, multiplier)

			if(isFirstStep)
				step.reels = reels.map(reel => reel.map(symbolId => symbolId))
	
			if(isFirstStep || winDescriptor)
				steps.push(step)

			if(!winDescriptor) { break }
			
			const {
				winMap,
				coefficient,
			} = winDescriptor

			if(winMap) {
				step.winMap = winMap
				step.coefficient = coefficient
				step.multiplier = multiplier
				step.payout = Number((coefficient * bet).toFixed(2))
			}

			step.reelsPatch = this.cascadeReels(reels, winMap, isFreeSpinsMode)

			multiplier = Math.min(1024, multiplier === 1 ? 2 : multiplier * 2)
		} while (winDescriptor)

		return steps
	}

	generateSingleGameDescriptor({
		bet = 1,
		desiredReels,
		isBonusPurchased,
	}) {
		const {defaultSpins, bonusSpins} = this.probability
		let roundSteps = []
		let isFreeSpinsMode
		let freeSpinsCount = 0

		do {
			freeSpinsCount = Math.max(0, freeSpinsCount - 1)
			let reels = desiredReels ?? this.roll({
				probabilities: isFreeSpinsMode ? bonusSpins : defaultSpins,
				desiredReels,
				isBonusPurchased: isBonusPurchased && !roundSteps.length
			})
			
			const subSteps = this.getCascadeSteps({
				multiplier: isFreeSpinsMode ? 8 : 1,
				reels,
				bet,
				isFreeSpinsMode
			})
			const lastSubStep = subSteps[subSteps.length - 1]
			

			// FREE SPINS DETECTION...
			let bonusIdsCount = 0
			for(const reel of reels)
				for(const symbolId of reel)
					if(symbolId === SCATTER_SYMBOL_ID)
						bonusIdsCount++

			if (freeSpinsCount)
				for(const step of subSteps)
					step.freeSpinsCount = freeSpinsCount


			const awardedFreeSpinsCount = bonusIdsCount >= 3
				? 10 + (bonusIdsCount - 3) * 2
				: 0

			if (isFreeSpinsMode)
				lastSubStep.freeSpinsCount = freeSpinsCount
			
			if(awardedFreeSpinsCount) {
				freeSpinsCount += awardedFreeSpinsCount
				lastSubStep.awardedFreeSpinsCount = awardedFreeSpinsCount
				isFreeSpinsMode = true
			}
			// ...FREE SPINS DETECTION

			roundSteps = [...roundSteps, ...subSteps]

			// cheat reels dropped after 1st spin
			desiredReels = undefined

			// just to make it easier to adjust reels values while developing
			if(roundSteps.length > 1000)
				throw 'infinite wins! 😱😱😱'

		} while (freeSpinsCount)

		// TOTAL COEFFICIENT...
		let totalCoefficient = 0
		roundSteps.forEach(({coefficient}) => {
			totalCoefficient += (coefficient || 0)
		})
		// ...TOTAL COEFFICIENT

		// STATISTICS UPDATE...
		const {statistics} = this
		if (statistics) {
			let isFreeSpinsMode
			let roundWinCoefficient = 0
			roundSteps.forEach(({coefficient, awardedFreeSpinsCount, reels}) => {
				const finalCoefficient = coefficient ?? 0
				const isSpinStep = !!reels

				// COMMON...
				statistics.common.totalCoefficient += finalCoefficient

				if (isSpinStep) {
					if (roundWinCoefficient >= 50) {
						statistics.common.megaWinsCount++
					} else if (roundWinCoefficient >= 35) {
						statistics.common.hugeWinsCount++
					} else if (roundWinCoefficient >= 20) {
						statistics.common.bigWinsCount++
					}

					roundWinCoefficient = finalCoefficient
				} else {
					roundWinCoefficient += finalCoefficient
				}

				if (statistics.common.maxCoefficient < coefficient)
					statistics.common.maxCoefficient = coefficient
				if (isSpinStep && !isFreeSpinsMode) {
					statistics.common.spinsCount++
					if(coefficient)
						statistics.common.hitsCount++
				}
				statistics.common.hitRate = statistics.common.hitsCount / statistics.common.spinsCount
				statistics.common.rtp = statistics.common.totalCoefficient / statistics.common.spinsCount
				// ...COMMON

				if (isFreeSpinsMode) {
					// BONUS GAME...
					statistics.bonusGame.totalCoefficient += finalCoefficient
					if (statistics.bonusGame.maxCoefficient < coefficient)
						statistics.bonusGame.maxCoefficient = coefficient
					if (isSpinStep) {
						statistics.bonusGame.spinsCount++
						if(coefficient)
							statistics.bonusGame.hitsCount++
					}
					statistics.bonusGame.hitRate = statistics.bonusGame.hitsCount / statistics.bonusGame.spinsCount
					statistics.bonusGame.rtp = statistics.bonusGame.totalCoefficient / statistics.bonusGame.spinsCount
					// ...BONUS GAME
				} else {
					// DEFAULT GAME...
					statistics.defaultGame.totalCoefficient += finalCoefficient
					if (statistics.defaultGame.maxCoefficient < coefficient)
						statistics.defaultGame.maxCoefficient = coefficient
					if (isSpinStep) {
						statistics.defaultGame.spinsCount++
						if(coefficient)
							statistics.defaultGame.hitsCount++
					}
					statistics.defaultGame.hitRate = statistics.defaultGame.hitsCount / statistics.defaultGame.spinsCount
					statistics.defaultGame.rtp = statistics.defaultGame.totalCoefficient / statistics.defaultGame.spinsCount
					// ...DEFAULT GAME
				}

				if(awardedFreeSpinsCount) isFreeSpinsMode = true
			})
		}
		// ...STATISTICS UPDATE


		return {
			steps: roundSteps,
			totalCoefficient
		}
	}


	dropStatistics() {
		if(!this.statistics) return


		this.statistics = {
			common: {
				bigWinsCount: 0,
				hugeWinsCount: 0,
				megaWinsCount: 0,
				spinsCount: 0,
				totalCoefficient: 0,
				maxCoefficient: 0,
				hitRate: 0,
				hitsCount: 0,
				rtp: 0
			},
			defaultGame: {
				spinsCount: 0,
				totalCoefficient: 0,
				maxCoefficient: 0,
				hitRate: 0,
				hitsCount: 0,
				rtp: 0
			},
			bonusGame: {
				spinsCount: 0,
				totalCoefficient: 0,
				maxCoefficient: 0,
				hitRate: 0,
				hitsCount: 0,
				rtp: 0
			},
		}
	}

	// DEBUG...
	print(reels, caption = '___') {
		let text = caption
		for(let y = 0; y < reels[1].length; y++) {
			text += '\n|'
			for(let x = 0; x < reels.length; x++) {
				const symbolId = (reels[x][y] ?? ' ') + ''

				text += ' ' + symbolId + (symbolId.length === 1 ? ' |' : '|')
			}
		}

		console.log(text)
	}
	// ...DEBUG
}