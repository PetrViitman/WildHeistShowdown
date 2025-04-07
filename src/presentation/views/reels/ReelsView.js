import { Container, Graphics, Sprite } from "pixi.js"
import { BaseReelsView } from "./BaseReelsView"
import { PayoutsInfoPanelView } from "./PayoutsInfoPanelView"
import { Timeline } from "../../timeline/Timeline"
import {
	CELL_HEIGHT,
	CELL_WIDTH,
	REELS_COUNT,
	REELS_HEIGHT,
	REELS_LENGTHS,
	REELS_OFFSETS,
	REELS_WIDTH,
	SCATTER_SYMBOL_ID,
	SYMBOLS_IDS,
	WILD_SYMBOL_ID,
} from "../../Constants"
import { FreeSpinsIndicatorView } from "./FreeSpinsIndicatorView"
import { getRandomLoseReels } from "../../Utils"
import { SparklesPoolView } from "../particles/collapseEffects/sparkles/SparklesPoolView"
import { CoinsBurstView } from "../particles/collapseEffects/coins/CoinsBurstView"
import { MultiplierView } from "./MultiplierView"
import { UpSparklesPoolView } from "./UpSparklesPoolView"
import { PayoutView } from "./payout/PayoutView"
import { TensionPoolView } from "./tension/TensionPoolView"
import { HitEffectsPoolView } from "./hitEffect/HitEffectsPoolView"

export class ReelsView extends BaseReelsView {
	interactiveView
	payoutsInfoPanelView
	commonFreeSpinsPayoutIndicatorView
	blackoutView
	isMobileDevice
	idleTimeline = new Timeline
	cameraTimeline = new Timeline
	camera
	delayTimeline = new Timeline
	featureTimeline = new Timeline
	freeSpinsModeViews = []
	defaultGameModeViews = []
	isFreeSpinsMode
	gameLogoView
	freeSpinsIndicatorView

	constructor({
		initialSymbolsIds,
		assets,
		dictionary,
		coefficients,
		vfxLevel,
		isMobileDevice,
		camera,
		audio
	}) {
		super({
			initialSymbolsIds,
			assets,
			vfxLevel,
			audio
		})

		this.camera = camera

		this.isMobileDevice = isMobileDevice
		this.initBackgrounds(assets)
		this.initFrame(assets, vfxLevel)
		this.initTension(assets, vfxLevel)
		this.initHitEffects(assets)
		this.initFreeSpinsIndicator(assets, dictionary)
		this.initGameLogo(assets)
		this.initPayout(assets)
		this.initMultiplier(assets)
		this.initPayoutsInfoPanel(assets, coefficients)
		this.setFreeSpinsMode(false)
		this.setupInteractivity()
		this.initIdleTimeline()
		this.initSparkles(assets, vfxLevel)
		this.initCoins(assets, vfxLevel)
		this.bringForegroundElementsToFront()

		this.contentContainer.pivot.set(REELS_WIDTH / 2, REELS_HEIGHT / 2)

		this.reelsContainer.y = 25

		this.setMasked()
	}


	initBackgrounds(assets) {
		return
		const scaleFactor = 1.8

		// BACKGROUND...
		const backgroundView = this.contentContainer.addChildAt(new Sprite(assets.reels), 0)
		backgroundView.scale.set(1.8)
		backgroundView.position.set(-480, -177)
		// ...BACKGROUND

		// FREE SPINS MODE PATCHES...
		const offsets =[-45, 1280].forEach((x, i) => {
			const patchView = this.contentContainer.addChildAt(new Sprite(assets['reels_patch_' + i]), 0)
			patchView.scale.set(scaleFactor)
			patchView.position.set(x, -1)
			this.contentContainer.addChildAt(patchView, 2)
			this.freeSpinsModeViews.push(patchView)
		})

		// ...FREE SPINS MODE PATCHES
	}

	initTension(assets, vfxLevel) {
		if (vfxLevel < 0.15) return

		const tensionPoolView = new TensionPoolView(assets)
		tensionPoolView.position.set(REELS_WIDTH / 2, 150)
		this.tensionPoolView = this.maskedContainer.addChild(tensionPoolView)
		this.reelsViews.forEach((view, i) => {
			view.tensionView = tensionPoolView.tensionsViews[i]
		})
	}

	initHitEffects(assets) {
		const hitEffectsPoolView = new HitEffectsPoolView(assets, this.audio)
		hitEffectsPoolView.position.set(REELS_WIDTH / 2, 150)
		this.hitEffectsPoolView = this.contentContainer.addChild(hitEffectsPoolView)
	}

	initMultiplier(assets) {
		const view = new MultiplierView(assets)
		view.position.set(775, -810)
		view.scale.set(0.9)
	
		this.multiplierView = this.contentContainer.addChild(view)
	}

	initIdleTimeline() {
		this.idleTimeline
			.addAnimation({
				duration: 5000,
				onProgress: progress => {
					this.reelsViews.forEach(reelView => {
						reelView.cellsViews.forEach(view => {
							view.update(progress)
						})
					})
				}
			})
			.setLoopMode()
			.play()
	}


	initPayout(assets) {
		const payoutView = this.contentContainer.addChild(new PayoutView(assets))
		payoutView.position.set(REELS_WIDTH / 2, REELS_HEIGHT)
		this.payoutView = payoutView
	}

	initFrame(assets, vfxLevel) {
		let sprite = new Sprite(assets.inside_wall)
		this.maskedContainer.addChildAt(sprite, 0)
		sprite.anchor.set(0.5)
		sprite.position.set(REELS_WIDTH / 2, REELS_HEIGHT / 2 - 25)
		sprite.scale.set(4.7)
		this.insideFaceView = sprite

		sprite = new Sprite(assets.inside_glow)
		this.maskedContainer.addChildAt(sprite, 1)
		sprite.anchor.set(0.5, 0.75)
		sprite.position.set(REELS_WIDTH / 2, REELS_HEIGHT / 2 + 600)
		sprite.scale.set(10)
		this.insideGlowView = sprite

		new Timeline()
			.addAnimation({
				duration: 5000,
				onProgress: progress => {
					this.insideGlowView.alpha = 0.35 + 0.25 * Math.abs(Math.sin(Math.PI * 4 * progress)) * (1 - progress)
					this.insideGlowView.scale.y = 12 + 4 * Math.sin(Math.PI * 2 * progress)
				}
			})
			.setLoopMode()
			.play()


		const container = this.contentContainer.addChild(new Container)
		container.position.set(-166, -272)
		container.scale.set(2.3525)
		this.frameView = container

		
		sprite = container.addChild(new Sprite(assets.frame_top))
		sprite.position.set(29, 0)
		sprite = container.addChild(new Sprite(assets.frame_middle))
		sprite.position.set(0, 240)
		sprite = container.addChild(new Sprite(assets.frame_bottom))
		sprite.position.set(32, 514)

		sprite = container.addChild(new Sprite(assets.frame_top))
		sprite.position.set(388, 0)
		sprite.scale.x = -1
		sprite.anchor.x = 1
		sprite = container.addChild(new Sprite(assets.frame_middle))
		sprite.position.set(696, 240)
		sprite.scale.x = -1
		sprite.anchor.x = 1
		sprite = container.addChild(new Sprite(assets.frame_bottom))
		sprite.position.set(388, 514)
		sprite.scale.x = -1
		sprite.anchor.x = 1

		// sprite.scale.set(2.6 / 1.5)



		// let sprite = new Sprite(assets.reels_frame)
		//this.addChild(sprite)
		//sprite.anchor.set(0.5)
		//sprite.position.set(REELS_WIDTH / 2, REELS_HEIGHT / 2)
		//sprite.scale.set(2.1)

		/*
		const backgroundWidth = CELL_WIDTH * 3
		const backgroundHeight = REELS_HEIGHT - 2 + 2
		const container = this.addChildAt(new Container, 0)
	

		// BLACKOUT...
		this.blackoutView = this
			.addChildAt(new Graphics, 1)
			.beginFill(0x000000, 0.6)
			.drawRect(
				-backgroundWidth / 2,
				-backgroundHeight / 2 - 2,
				backgroundWidth,
				backgroundHeight)
			.endFill()

		this.blackoutView.position.set(REELS_WIDTH / 2, REELS_HEIGHT / 2)
		this.blackoutView.alpha = 0
		// ...BLACKOUT


		container.cacheAsBitmap = true
		*/
	}

	initPayoutsInfoPanel(assets, coefficients) {
		this.payoutsInfoPanelView = this.contentContainer.addChild(
			new PayoutsInfoPanelView({
				assets,
				reelsView: this,
				coefficients,
				camera: this.camera
			}))

		this.payoutsInfoPanelView.x = this.reelsContainer.x
		this.payoutsInfoPanelView.y = 0
	}

	initFreeSpinsIndicator(
		assets,
		dictionary
	) {
		const indicatorView = new FreeSpinsIndicatorView(assets, dictionary)
		indicatorView.position.set(REELS_WIDTH / 2, -155)
		indicatorView.scale.set(1.25)
		this.freeSpinsIndicatorView = this.contentContainer.addChild(indicatorView)
		this.freeSpinsModeViews.push(indicatorView)
	}

	initGameLogo(assets) {
		const gameLogoView = new Sprite(assets.game_logo)
		gameLogoView.position.set(REELS_WIDTH / 2, -170)
		gameLogoView.anchor.set(0.5)
		gameLogoView.scale.set(0.9, 0.8)
		this.gameLogoView = this.contentContainer.addChild(gameLogoView)
		this.defaultGameModeViews.push(gameLogoView)
	}

	setupInteractivity() {
		const { payoutsInfoPanelView } = this
		const interactiveView = this
			.reelsContainer
			.addChild(new Graphics)
			.beginFill(0xFFFFFF, 0.0001)
			.drawRect(0, 0, REELS_WIDTH, REELS_HEIGHT)
			.endFill()

		interactiveView.cursor = 'pointer'
		interactiveView.eventMode = 'static'
		interactiveView.addEventListener('pointerdown', ({global}) => {
			if (payoutsInfoPanelView.capturedSymbolView)
				return payoutsInfoPanelView.hide()

			const {x, y} = interactiveView.toLocal(global)
			const reelIndex = Math.trunc(x / CELL_WIDTH)
			const offsetY = REELS_OFFSETS[reelIndex]
			const cellX = Math.trunc(x / CELL_WIDTH)
			const cellY = Math.trunc(y / CELL_HEIGHT + 1 - offsetY)

			if (cellY <= 0 || cellY > REELS_LENGTHS[reelIndex]) return

			const cellView = this.reelsViews[cellX].cellsViews[cellY]

			payoutsInfoPanelView.presentPayouts({
				capturedSymbolView: cellView.getSymbolView(),
				x: cellX,
				y: cellY + offsetY - 1,
				symbolId: Math.abs(cellView.currentSymbolId)
			})

		})
		this.interactiveView = interactiveView
		this.setInteractive(false)
	}

	updateTargetArea(sidesRatio) {
		const {
			isFreeSpinsMode,
			isMobileDevice,
		} = this

		this.payoutsInfoPanelView.hide()

		if(sidesRatio > 1.25 && !isMobileDevice) {
			// DESKTOP LANDSCAPE...
			this.setTargetArea({x: 0, y: 0.15, width: 1, height: 0.6})
			// ...DESKTOP LANDSCAPE
		} else if (sidesRatio > 1.25 && isMobileDevice) {
			// MOBILE LANDSCAPE...
			const panelWidth = isMobileDevice ? 0.2 : 0.125
			this.setTargetArea({x: 0, y: 0.075, width: 1 - panelWidth, height: 0.9})
			// ...MOBILE LANDSCAPE
		} else if (sidesRatio > 0.8) {
			// WIDE PORTRAIT...
			this.setTargetArea({x:  0.05, y: 0.2, width: 0.9, height:  0.5})
			// ...WIDE PORTRAIT
		} else {
			// NARROW PORTRAIT...
			this.setTargetArea({x: 0.05, y: 0.2, width: 0.9, height: 0.5})
			// ...NARROW PORTRAIT
		}

		// this.highlight()
	}

	initSparkles(assets, vfxLevel) {
		const sparklesPoolsViews = []

		for (let x = 0; x < REELS_COUNT; x++) {
			sparklesPoolsViews[x] = []
			for (let y = 0; y < REELS_LENGTHS[x]; y++) {
				const view = this.contentContainer.addChild(
					new SparklesPoolView({
						assets,
						fallHeight: (5 - y - REELS_OFFSETS[x]) * CELL_HEIGHT + 110,
						vfxLevel
					}))
				view.position.set(
					(x + 0.5) * CELL_WIDTH,
					(y + REELS_OFFSETS[x] + 0.5) * CELL_HEIGHT,
				)

				sparklesPoolsViews[x][y] = view
				this.cellsViews[x][y + 1].sparklesPoolView = view
			}
		}

		const poolView = new UpSparklesPoolView(assets)
		poolView.position.set(REELS_WIDTH / 2, REELS_HEIGHT / 2)
		this.maskedContainer.addChildAt(poolView, 1)
	}

	initCoins(assets, vfxLevel) {
		if (vfxLevel < 0.3) return

		const coinsBurstsViews = []

		for (let x = 0; x < REELS_COUNT; x++) {
			coinsBurstsViews[x] = []
			for (let y = 0; y < REELS_LENGTHS[x]; y++) {
				const view = this.contentContainer.addChild(
					new CoinsBurstView({
						assets,
						fallHeight: (5 - y - REELS_OFFSETS[x]) * CELL_HEIGHT + 110
					}))
				view.position.set(
					(x + 0.5) * CELL_WIDTH,
					(y + REELS_OFFSETS[x] + 0.5) * CELL_HEIGHT,
				)

				coinsBurstsViews[x][y] = view
				this.cellsViews[x][y + 1].coinsBurstView = view
			}
		}
	}

	bringForegroundElementsToFront() {
		this.cellsViews.forEach((reel, x) => reel.forEach((cellView, y) => {
			const {winBoxView} = cellView
			if(!winBoxView) return

			this.contentContainer.addChild(winBoxView)
		}))
		
		/*
		this.cellsViews.forEach((reel, x) => reel.forEach((cellView, y) => {
			const {sparklesPoolView} = cellView
			if(!sparklesPoolView) return

			this.addChild(sparklesPoolView)

			sparklesPoolView.x = x * CELL_WIDTH + CELL_WIDTH / 2
			sparklesPoolView.y = REELS_OFFSETS[x] * CELL_HEIGHT + CELL_HEIGHT * y - CELL_HEIGHT / 2
		}))
			*/
	}


	// API...
	setBrightness({ key, map, brightness }) {
		super.setBrightness({ key, map, brightness })
	}

	presentCellsWin({ key, map, progress }) {
		for(let x = 0; x < map.length; x++)
			for(let y = 0; y < map[0].length; y++)
				if(map[x][y] === key)
					this.cellsViews[x][y + 1]
						.getSymbolView()
						.presentWin(progress)
	}


	setMasked(isMasked = true) {
		super.setMasked(isMasked)
	}

	setInteractive(isInteractive = true) {
		this.interactiveView.visible = isInteractive
	}

	presentRandomSymbols() {
		getRandomLoseReels().forEach((reel, x) =>
			reel.forEach((symbolId, y) => {
				this.cellsViews[x][y + 1].presentSymbol(symbolId)
				this.cellsViews[x][y + 1].adjustDistortion()
			}))
	}

	reset() {
		super.reset()
		this.setInteractive(false)
	}

	presentIntro() {
		return this.cameraTimeline
			.deleteAllAnimations()
			.addAnimation({
				duration: 400,
				onProgress: (progress) => {
					const subProgress = progress ** 2

					let i = 0
					this.cellsViews.forEach(reel => {
						reel.forEach(cellView => {
							const shiftedProgress = Math.min(1, subProgress * (1 + 1 * i))

							cellView.getSymbolView()
							.presentationFlipProgress = 0.75 + 0.25 * shiftedProgress
						})
					})


					this.camera
						.focus({
							view: this,
							offsetX: 0,
							offsetY: 0,
						})
						.setZoom(1 + 0.1 * Math.abs(Math.sin(Math.PI * 1 * progress)) )
				}
			})
			.play()



		// const initialReels = this.getCurrentSymbolsIds()
		// this.placeholdersTableView.setVisible([1, 1, 1, 1, 1, 1, 1]) 
		/*
		this.presentExpansion({
			length: 7,
			forcePresent: true
		})

		this.timeline.deleteAllAnimations()

		let cellIndex = 0
		for (let x = 0; x < initialReels.length; x++) {
			for (let y = 0; y < initialReels[x].length; y++) {
				const view = this.cellsViews[x][y + 1]
				cellIndex++

				const isEmptyCell = y < 2 || y > 4

				this.timeline.addAnimation({
					delay: cellIndex * 10,
					duration: 500,
					onStart: _ => {
						view.setFlip(0.5)
						view.setBrightness(1)
						view.presentSymbol(isEmptyCell ? 0 : initialReels[x][y])
					},
					onProgress: progress => {
						view.setFlip(0.5 + progress * 0.5)
					}
				})
			}
		}

		this.presentExpansion({
			length: 3,
			forcePresent: true
		})
		*/
	}

	refreshPayoutsInfo(bet) {
		this.payoutsInfoPanelView.setBet(bet)
	}

	setTimeScale(scale) {
		super.setTimeScale(scale)
		this.cameraTimeline.setTimeScaleFactor({name: 'scale', value: scale})
		this.delayTimeline.setTimeScaleFactor({name: 'scale', value: scale})
		this.featureTimeline.setTimeScaleFactor({name: 'scale', value: scale})
		this.freeSpinsIndicatorView.setTimeScale(scale)
		this.hitEffectsPoolView?.setTimeScale(scale)
	}

	async presentCascade({
		payout,
		currencyCode = 'FUN',
		corruptionMap = [
			[0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0],
		],
		patchMap,
		/*
		= [
			[1],
			[1],
			[1, 1],
			[],
			[1],
			[],
		],*/
		multiplier = 1,
	}) {
		// CAMERA...
		this.cameraTimeline
			.deleteAllAnimations()
			.addAnimation({
				duration: 1500,
				onProgress: (progress) => {
					this.camera
						.focus({
							view: this,
							offsetX: 0,
							offsetY: 400 * Math.sin(Math.PI * progress),
						})
						.setZoom(1 + 0.01 * Math.sin(Math.PI * 2 * ((progress * 2) % 1) * (1 - progress)))
				}
			})
			.play()
		// ...CAMERA

		
		// INFO BAR MESSAGE...
		const currentSymbolsIds = this.getCurrentSymbolsIds()
		const collapses = []
		SYMBOLS_IDS.forEach(symbolId => {
			/*
			for(let x = 0; x < winWidth; x++) {
				let winSymbolsPerReelCount = 0

				map[x].forEach(value => {
					if(value) {
						winSymbolsPerReelCount++
					}
				})

				winLinesMultiplier *= winSymbolsPerReelCount
			}*/



			for(let x = 0; x < corruptionMap.length; x++) {
				let winSymbolsPerReelCount = 0
				for(let y = 0; y < corruptionMap[x].length; y++) {
					const isWin = corruptionMap[x][y]
					const targetSymbolId = Math.abs(currentSymbolsIds[x][y])
					if(isWin && (targetSymbolId === symbolId || targetSymbolId === WILD_SYMBOL_ID)) {
						winSymbolsPerReelCount++
					}
				}

				if(winSymbolsPerReelCount) {
					collapses.push({
						symbolId,
						symbolsCount: winSymbolsPerReelCount
					})
				} else {
					break
				}
			}
		})

		this.infoBarView?.presentPayout({
			collapses,
			payout,
			multiplier,
			currencyCode
		})
		// ...INFO BAR MESSAGE



		const {featureTimeline} = this
		featureTimeline
			.deleteAllAnimations()
			.addAnimation({
				duration: 500,
				onProgress: progress => {
					if (!multiplier) return
					this.payoutView.presentIntro({
						payout: payout / multiplier,
						progress
					})
				}
			})
			.addAnimation({
				delay: 400,
				duration: 750,
				onProgress: progress => {
					multiplier > 1 &&
					this.multiplierView.presentMultiplier({
						multiplier,
						progress
					})
				}
			})
			.addAnimation({
				delay: 500,
				duration: 750,
				onProgress: progress => {
					if (!payout) return
					this.payoutView.presentMultiplier({
						payout: payout / multiplier,
						multipliedPayout: payout,
						progress
					})
				}
			})
			.addAnimation({
				delay: featureTimeline.duration,
				duration: 1000,
				onProgress: progress => {
					if (!multiplier) return
					this.payoutView.presentOutro({
						multipliedPayout: payout,
						progress
					})

					this.multiplierView
						.presentShift({
							multiplier: multiplier * 2,
							progress: Math.min(1, progress * 3),
							isIncrementing: multiplier > 1
						})
				}
			})

		return Promise.all([
			super.presentCascade({corruptionMap, patchMap, multiplier}),
			featureTimeline.play()
			/*
			...corruptionMap.map((reel, x) => reel.map((value, y) => {
				const isWildCorruption = value > 0
				const cellView = this.reelsViews[x].cellsViews[y + 1]
				if(isWildCorruption && WILD_POWER_MAP[cellView.currentSymbolId])
					return this.multiplierView.presentMultiplierIntro({
						sourceView: cellView,
						capacity: value
					})
			}))
			*/
		])
	}

	onReelPatched(reelIndex, cellIndex) {
		const {patchMap, audio, reelsViews} = this
		if(!patchMap) return
		
		if (patchMap[reelIndex][cellIndex] === SCATTER_SYMBOL_ID) {
			audio.presentScatter()
			this.cellsViews[reelIndex][cellIndex + 1].presentScatterTeasing()
		}

		if(cellIndex === patchMap[reelIndex].length - 1) {
			
			this.hitEffectsPoolView?.presentHit({
				x: reelIndex,
				y: cellIndex,
				symbolId: patchMap[reelIndex][cellIndex]
			})

			// reelsViews[reelIndex].presentHit(cellIndex)
		}
	}

	onReelStopHit(reelIndex) {
		const {reelsViews} = this

		for (let y = 0; y < REELS_LENGTHS[reelIndex]; y++) {
			const cellIndex = y + 1
			const cellView = reelsViews[reelIndex].cellsViews[cellIndex]
			if(cellView.currentSymbolId === SCATTER_SYMBOL_ID) {
				reelsViews[reelIndex].bringCellToFront(cellIndex)
			}
		}


		if (this.reelsViews[reelIndex].isTensionReel) return
		
		const y = REELS_LENGTHS[reelIndex] - 1
		this.hitEffectsPoolView?.presentHit({
			x: reelIndex,
			y,
			symbolId: this.cellsViews[reelIndex][y + 1].currentSymbolId
		})
	}

	presentWin() {
		this.reset()
		this.setMasked(false)
	}

	setFreeSpinsMode(isFreeSpinsMode = true) {
		this.reset()
		this.isFreeSpinsMode = isFreeSpinsMode
		this.freeSpinsModeViews.forEach(view => {
			view.visible = isFreeSpinsMode
		})

		this.defaultGameModeViews.forEach(view => {
			view.visible = !isFreeSpinsMode
		})
	}

	getScattersCount() {
		let scattersCount = 0

		this.cellsViews.forEach(reel => reel.forEach(view => {
			if (view.currentSymbolId === SCATTER_SYMBOL_ID) {
				scattersCount++
			}
		}))

		return scattersCount
	}

	async presentFreeSpinsAward(freeSpinsCount) {
		this.reset()
	 	this.setMasked(false)
		this.tensionPoolView?.presentFreeSpinsAward(this.isFreeSpinsMode)

		return this
			.cameraTimeline
			.deleteAllAnimations()
			.addAnimation({
				delay: 500,
				onFinish: () => this.presentFreeSpinsCount(freeSpinsCount)
			})
			.addAnimation({
				duration: 1250,
				onProgress: (progress) => {
					this.camera
						.focus({
							view: this,
							offsetX: 0,
							offsetY: 0,
						})
						.setZoom(1 + 0.15 * Math.sin(Math.PI * 4 * progress) * (1 - progress))


					const scatterProgress = (progress * 2) % 1

					this.cellsViews.forEach(reel => reel.forEach(view => {
						if(view.currentSymbolId === SCATTER_SYMBOL_ID) {
							view.getSymbolView().presentTeasing(scatterProgress)
							view.presentWinBox(scatterProgress)
						}
					}))
				}
			})
			.play()
	}

	async presentBonusGameFinish() {
		this.reset()
	 	this.setMasked(false)


		this.tensionPoolView?.presentFreeSpinsAward()

		return this.cameraTimeline
			.deleteAllAnimations()
			.addAnimation({
				duration: 1250,
				onProgress: (progress) => {
					this.camera
						.focus({
							view: this,
							offsetX: 0,
							offsetY: 0,
						})
						.setZoom(1 + 0.25 * Math.sin(Math.PI * 4 * progress) * (1 - progress))

					this.cellsViews.forEach(reel => reel.forEach(view => {
						if(view.currentSymbolId === SCATTER_SYMBOL_ID) {
							view.getSymbolView().presentTeasing(progress)
							view.presentWinBox(progress)
						}
					}))
				}
			})
			.play()
		// ...CAMERA
	}

	presentFreeSpinsCount(freeSpinsCount = 0) {
		return this.freeSpinsIndicatorView.presentRemainingSpinsCount(freeSpinsCount)
	}

	async presentSpinStart({
		lockedReelsIndexes = [],
		lockedSymbolId,
		freeSpinsCount = 0,
		multiplier = 1,
	}) {
		if(this.timeline.isPlaying)
			this.reset()
		

		this.featureTimeline.wind(1)

		// CAMERA...
		this.cameraTimeline
			.deleteAllAnimations()
			.addAnimation({
				duration: 10000,
				onProgress: (progress) => {
					this.camera
						.focus({
							view: this,
							offsetX: 0,
							offsetY: 0,
						})
						.setZoom(1 + 0.2 * progress)
				}
			})
			.play()
		// ...CAMERA

		await this.payoutsInfoPanelView.hide()

		return Promise.all([
			super.presentSpinStart({lockedReelsIndexes, lockedSymbolId}),
			this.presentFreeSpinsCount(freeSpinsCount),
			this.featureTimeline
				.deleteAllAnimations()
				.addAnimation({
					duration: 500,
					onProgress: progress => {
						this.multiplierView.presentOutro({
							minimalMultiplier: this.isFreeSpinsMode ? 8 : 1,
							multiplier,
							progress
						})
					}
				})
				.play()
		])
	}

	async presentSpinStop({
		targetSymbols,
		isBonusPurchased
	}) {
		if(!this.isSpinning()) return

		const targetSymbolsIds = targetSymbols.map(reel => reel.map(symbol => symbol))
		let scattersCount = 0
		let delay = 0
		let totalStopDuration = 0
		
		const promises = this.reelsViews.map((reelView, i) => {
			let isTensionReel = false
		
			if(i) {
				if (
					!this.isFreeSpinsMode
					&& scattersCount >= 2
				) {
					isTensionReel = true
					delay += 750
				} else {
					delay += 200
				}
			}

			reelView.isTensionReel = isTensionReel


			for(let y = 0; y < targetSymbolsIds[i].length; y++)
				if(targetSymbolsIds[i][y] === SCATTER_SYMBOL_ID)
					scattersCount++

			totalStopDuration += delay

			if(isTensionReel && !isBonusPurchased) this.infoBarView.presentTension()

			return reelView.presentSpinStop({
				cellsViews: this.cellsViews,
				symbolsIds: targetSymbolsIds[i],
				delay,
				tensionDuration: isTensionReel ? 1500 : 0,
				isBonusPurchased
			})
		})

		totalStopDuration *= 0.5

		// CAMERA...
		const { camera } = this
		const initialZoom = this.camera.zoom
		const zoomDelta = initialZoom - 1

		this.cameraTimeline
			.deleteAllAnimations()
			.addAnimation({
				duration: totalStopDuration,
				onProgress: (progress) => {
					camera
						.focus({
							view: this,
							offsetX: 0,
							offsetY: 0,
						})
						.setZoom(initialZoom - zoomDelta * progress)
						.setAngle(0.025 * (1 - progress) * Math.sin(Math.PI * (totalStopDuration / 200) * progress))	
				}
			})
			.play()
		// ...CAMERA

		await Promise.all(promises)

		this.setMasked(false)
	}

	presentSymbolsSubstitution(symbolId) {
		const currentSymbolsIds = this.getCurrentSymbolsIds()

		const substitutionMap = {
			5: 11,
			6: 12,
			7: 13,
			8: 14,
		}

		const targetSymbolId = substitutionMap[symbolId]

		return this
			.featureTimeline
			.deleteAllAnimations()
			.addAnimation({
				duration: 300,
				onProgress: progress => {
					for (let x = 0; x < currentSymbolsIds.length; x++) {
						for (let y = 0; y < currentSymbolsIds[x].length; y++) {
							if (currentSymbolsIds[x][y] === symbolId) {
								this.cellsViews[x][y + 1]
									.presentSubstitution({
										symbolId,
										targetSymbolId,
										progress
									})
							}
						}
					}
				}
			})
			.play()
	}

	hidePayoutsInfo() {
		return this.payoutsInfoPanelView.hide()
	}

	reset() {
		this.timeline.wind(1).deleteAllAnimations()
		this.cellsViews.forEach(reel => reel.forEach(view => view.reset()))
		this.setBrightness({brightness: 1})
	}

	setFlip(flipProgress) {
		const angle = Math.PI * 2 * flipProgress
		const sin = Math.sin(angle)

		this.contentContainer.scale.x = sin
		this.reelsViews.forEach(view => view.scale.x = 1 / sin)
	}

	setMasked(isMasked = true) {
		const { cellsViews } = this

		for(let x = 0; x < REELS_COUNT; x++) {
			cellsViews[x][0].visible = isMasked
			cellsViews[x][cellsViews[x].length - 1].visible = isMasked
		}

		if (isMasked) {
			this.maskedContainer.addChild(this.reelsContainer)
		} else {
			this.contentContainer.addChildAt(this.frameView, 1)
			this.contentContainer.addChildAt(this.reelsContainer, 2)
		}
		// this.reelsContainer.mask = isMasked ? this.maskView : undefined
	}

	setWrapped(isWrapped = true) {
		const { reelsContainer } = this

		if(isWrapped) {
			const offset = 35
			const graphics = new Graphics()
				.beginFill(0xFF0000)
				.drawRect(-offset, -offset, REELS_WIDTH + offset *2, REELS_HEIGHT + offset *2)
				.endFill()

			reelsContainer.mask = 
			this.reelsContainer.addChild(graphics)
		} else if (reelsContainer.mask) {
			reelsContainer.mask.destroy()
			reelsContainer.mask = null
		}
	}
	// ...API
}