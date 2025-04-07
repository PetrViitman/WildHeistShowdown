import { Container, Graphics, Sprite } from 'pixi.js'
import { CELL_HEIGHT, CELL_WIDTH, POSSIBLE_REELS_SYMBOLS, REELS_LENGTHS, REELS_OFFSETS, SCATTER_SYMBOL_ID } from '../../../Constants'
import { Timeline } from '../../../timeline/Timeline'
import { SymbolClubsView } from './symbols/SymbolClubsView'
import { SymbolHeartsView } from './symbols/SymbolHeartsView'
import { SymbolDiamondsView } from './symbols/SymbolDiamondsView'
import { SymbolSpadesView } from './symbols/SymbolSpadesView'
import { SymbolBottleView } from './symbols/SymbolBottleView'
import { SymbolHatView } from './symbols/SymbolHatView'
import { SymbolPistolView } from './symbols/SymbolPistolView'
import { SymbolWatchesView } from './symbols/SymbolWatchesView'
import { SymbolWildView } from './symbols/SymbolWildView'
import { SymbolScatterView } from './symbols/SymbolScatterView'
import { SafeView } from './safe/SafeView'
import { SparklesPoolView } from '../../particles/collapseEffects/sparkles/SparklesPoolView'
import { colorToColor } from '../../GraphicalPrimitives'
import { Base2DSymbolView } from './symbols/Base2DsymbolView'

export class ReelCellView extends Container {
	contentContainer
	sparklesPoolView
	coinsBurstView
	symbolsViews = []
	safeView
	currentSymbolId
	blurStrength
	timeline = new Timeline
	corruptionTimeline = new Timeline
	cascadeTimeline = new Timeline
	featureTimeline = new Timeline
	isSecured = false
	reelIndex

	constructor({
		possibleSymbolsIds = POSSIBLE_REELS_SYMBOLS[1],
		assets,
		vfxLevel,
		isSecurable = false,
		reelIndex = 0,
		isPayable = true
	}) {
		super()
		this.reelIndex = reelIndex
		this.contentContainer = this.addChild(new Container)
		this.initSymbols({possibleSymbolsIds, assets, vfxLevel})
		isPayable && this.initWinBox(assets)
		isSecurable && this.initSafe(assets, vfxLevel)
		this.setSecured(false)
	}

	initSymbols({possibleSymbolsIds, assets, vfxLevel}) {
		if(vfxLevel < 0.15) {
			possibleSymbolsIds.forEach(id => {
				let symbolView
	
				switch (id) {
					case 0:
						symbolView = new Container()
						symbolView.setVisible = () => {}
						symbolView.setBlur = () => {}
						symbolView.reset = () => {}
						symbolView.setBrightness = () => {}
						symbolView.update = () => {}
					break
					case 1: symbolView = new Base2DSymbolView(id, assets); break
					case 2: symbolView = new Base2DSymbolView(id, assets); break
					case 3: symbolView = new Base2DSymbolView(id, assets); break
					case 4: symbolView = new Base2DSymbolView(id, assets); break
					case 5: symbolView = new Base2DSymbolView(id, assets); break
					case 6: symbolView = new Base2DSymbolView(id, assets); break
					case 7: symbolView = new Base2DSymbolView(id, assets); break
					case 8: symbolView = new Base2DSymbolView(id, assets); break
					case 9: symbolView = new Base2DSymbolView(id, assets); break
					case 10: symbolView = new Base2DSymbolView(id, assets); break
				}
	
				this.symbolsViews[id] = this.contentContainer.addChild(symbolView)
			})
		} else {
			possibleSymbolsIds.forEach(id => {
				let symbolView
	
				switch (id) {
					case 0:
						symbolView = new Container();
						symbolView.setVisible = () => {}
						symbolView.setBlur = () => {}
						symbolView.reset = () => {}
						symbolView.setBrightness = () => {}
						symbolView.update = () => {}
					break
					case 1: symbolView = new SymbolClubsView(assets, vfxLevel); break
					case 2: symbolView = new SymbolHeartsView(assets, vfxLevel); break
					case 3: symbolView = new SymbolDiamondsView(assets, vfxLevel); break
					case 4: symbolView = new SymbolSpadesView(assets, vfxLevel); break
					case 5: symbolView = new SymbolBottleView(assets, vfxLevel); break
					case 6: symbolView = new SymbolHatView(assets, vfxLevel); break
					case 7: symbolView = new SymbolPistolView(assets, vfxLevel); break
					case 8: symbolView = new SymbolWatchesView(assets, vfxLevel); break
					case 9: symbolView = new SymbolWildView(assets, vfxLevel); break
					case 10: symbolView = new SymbolScatterView(assets, vfxLevel); break
				}
				
				this.symbolsViews[id] = this.contentContainer.addChild(symbolView)
			})
		}
	}

	initWinBox(assets) {
		const view = new Sprite(assets.win_box)
		view.anchor.set(0.5)
		view.alpha = 0

		this.winBoxView = view

		this.contentContainer.addChild(view)
	}

	initSafe(assets, vfxLevel) {
		this.safeView = this.addChild(new SafeView(assets, vfxLevel))
		this.safeView.pivot.set(CELL_WIDTH / 2, CELL_HEIGHT / 2)
		this.safeView.attach(this)
	}

	getSymbolView(symbolId = this.currentSymbolId) {
		const { symbolsViews } = this

		return symbolsViews[Math.abs(symbolId)]
	}

	onPreRendered() {
		this.symbolsViews.forEach((view) => view.setVisible(false))
        this.presentSymbol(this.currentSymbolId)
	}

	// API...
	reset() {
		this.symbolsViews.forEach(view => view.reset())
	}


	adjustDistortion(offsetY = 0) {
		const {reelIndex} = this
		const distanceX = -((reelIndex + 0.5) - 3) / 3
		const view = this.safeView ?? this.getSymbolView()

		const rollProgress = (
			this.y
			+ view.y
			+ CELL_HEIGHT
			+ offsetY
		) / ((REELS_LENGTHS[reelIndex] + 1.5) * CELL_HEIGHT)

		const distortionFactor = Math.sin(Math.PI * rollProgress)
		this.x = distanceX * (1 - distortionFactor) * 40 + CELL_WIDTH / 2
		view.scale.set(0.85 + 0.15 * distortionFactor)
		view.rotation = 0.15 * distanceX * Math.sin(Math.PI * 2 * rollProgress)

		view.alpha = rollProgress > 0.125 ? 1 : 0.0001
	}

	adjustLowVFXDistortion(offsetY = 0) {
		const {reelIndex} = this
		const view = this.safeView ?? this.getSymbolView()

		const rollProgress = (
			this.y
			+ view.y
			+ CELL_HEIGHT
			+ offsetY
		) / ((REELS_LENGTHS[reelIndex] + 1.5) * CELL_HEIGHT)

		view.visible = rollProgress > 0.05 && rollProgress < 0.95
	}

	preRenderSymbols() {
        this.symbolsViews.forEach((view) => view.setVisible(true));
    }

	setTimeScale(scale) {
		const scaleDescriptor = {name: 'scale', value: scale}
		this.corruptionTimeline.setTimeScaleFactor(scaleDescriptor)
		this.cascadeTimeline.setTimeScaleFactor(scaleDescriptor)
		this.featureTimeline.setTimeScaleFactor(scaleDescriptor)

		for(const view of this.symbolsViews)
			view?.setTimeScale?.(scale)
	}

	setBlur(strength = 1) {
		this.blurStrength = strength
		
		this.getSymbolView().setBlur(strength)
	}

	randomizeIdleOffset() {
		this.getSymbolView().randomizeIdleOffset?.()
	}

	getBrightness() {
		return this.getSymbolView()?.brightness ?? 1
	}

	setBrightness(brightness = 1) {
		this.symbolsViews.forEach(view => view.setBrightness(brightness))
		
		// this.getSymbolView()?.setBrightness(brightness)
		this.safeView?.setBrightness(brightness)
	}

	setGlowIntensity(progress) {
		this.symbolsViews.forEach(view => view.flameIntensity = progress)
	}

	setIdleFactor(idleFactor = 1) {
		this.symbolsViews.forEach(view => view.idleFactor = idleFactor)
	}

	presentSymbol(symbolId) {
		const previousSymbolView = this.getSymbolView()
		previousSymbolView?.setVisible(false)

		const nextSymbolView = this.getSymbolView(symbolId)
		nextSymbolView.setVisible()
		nextSymbolView?.setBlur(this.blurStrength)
		this.currentSymbolId = symbolId
		this.alpha = 1
		nextSymbolView.scale.set(1)
		nextSymbolView.y = 0
		nextSymbolView.featureSpinProgress = 0
		if(this.winBoxView) {
			this.winBoxView.alpha = 0
		}

		this.setSecured(symbolId < 0)
	}

	presentScatterTeasing() {
		if (this.currentSymbolId !== SCATTER_SYMBOL_ID)
			return

		const symbolView = this.getSymbolView(SCATTER_SYMBOL_ID)
		
		return this
			.featureTimeline
			.deleteAllAnimations()
			.addAnimation({
				duration: 500,
				onProgress: (progress) => {
					symbolView.presentTeasing(progress)
				}
			})
			.play()
	}

	presentScatterWin() {
		const symbolView = this.getSymbolView(SCATTER_SYMBOL_ID)

		return this
			.featureTimeline
			.deleteAllAnimations()
			.addAnimation({
				duration: 500,
				onProgress: (progress) => {
					symbolView.presentSpecialWin(progress)
				}
			})
			.play()
	}

	presentWinBox(progress) {
		if(!this.winBoxView) return

		const scaleProgress = Math.sin(Math.PI * 6 * progress) * (1 - progress)
		this.winBoxView.position.set(
			this.x + this.reelIndex * CELL_WIDTH,
			this.y + REELS_OFFSETS[this.reelIndex] * CELL_HEIGHT + 25
		)
		this.winBoxView.alpha = Math.min(1, Math.sin(Math.PI * progress) * 2)
		this.winBoxView.scale.set(1.5 + scaleProgress * 0.5)

		this.winBoxView.tint = colorToColor(
			255,
			0,
			0,
			255,
			255,
			0,
			Math.sin(Math.PI * 6 * progress)
		)
	}

	presentCorruption({isSecured = this.isSecured, isPaying = true}) {
		this.reset()

		if(isSecured) {
			return this
				.corruptionTimeline
				.deleteAllAnimations()
				.addAnimation({
					duration: 1000,
					onProgress: progress => {
						this.safeView.presentSubstitution(progress)
					}
				})
				.play()
		}

		this.sparklesPoolView?.randomize()
		this.sparklesPoolView?.setSkin(this.currentSymbolId)

		this.coinsBurstView?.randomize()

		return new Promise(resolve => {
			this
				.corruptionTimeline
				.deleteAllAnimations()
				.addAnimation({
					duration: 1000,
					onProgress: (progress) => {
						const regress = 1 - progress
						const symbolView = this.getSymbolView()

						//const skewProgress = Math.sin(Math.PI * 2 * ((progress * 3) % 1)) * reversedProgress
						//const scaleProgress = Math.sin(Math.PI * 2 * ((progress * 2) % 1)) * reversedProgress
						//const pivotXProgress = Math.abs(Math.sin(Math.PI * 2 * ((progress * 2) % 1))) * reversedProgress
						//const pivotYProgress = Math.abs(Math.sin(Math.PI * 2 * progress)) * reversedProgress

						const scaleProgress = Math.sin(Math.PI * 6 * progress) * regress

						symbolView.scale.set(1 - 0.65 * scaleProgress)
						const spinProgress = (Math.max(0, (progress - 0.75)) / 0.25) ** 2

						symbolView.featureSpinProgress = 
						(
							this.reelIndex % 2
								? -spinProgress
								: spinProgress
						) * 0.5
						//symbolView.skew.x = skew * skewProgress
						//symbolView.scale.y = 1 + scaleOffset * scaleProgress
						//symbolView.pivot.x = pivotXOffset * pivotXProgress
						//symbolView.pivot.y = pivotYOffset * pivotYProgress

						if(isPaying) {
							this.presentWinBox(progress)
						}
					}
				})
				.addAnimation({
					delay: 700,
					duration: 300,
					onProgress: (progress) => {
						const regress = 1 - progress ** 3
						this.alpha = regress
						this.getSymbolView().y = 500 * progress ** 3// scale.set(regress)

					},
					onFinish: resolve
				})
				.addAnimation({
					delay: 350,
					duration: 1500,
					onProgress: (progress) => {
						this.sparklesPoolView?.presentFallout(progress)
					}
				})
				.addAnimation({
					delay: 250,
					duration: 1750,
					onProgress: (progress) => {
						if(!isPaying) return
						this.coinsBurstView?.presentFallout(progress)
					}
				})
				.play()
		})
	}

	update(progress) {
		this.symbolsViews.forEach(view => view.update?.(progress))
		this.getSymbolView()?.update(progress)
		this.safeView?.update(progress)
	}

	presentSubstitution({
		progress,
		symbolId,
		targetSymbolId
	}) {
		this.presentSymbol(symbolId)

		const symbolView = this.getSymbolView(symbolId)
		const targetSymbolView = this.getSymbolView(targetSymbolId)

		symbolView.setVisible(false)
		symbolView.setBlur(0)
		symbolView.alpha = 1
		symbolView.presentWin(progress)

		targetSymbolView.setVisible(true)
		targetSymbolView.setBlur(0)
		targetSymbolView.alpha = progress
		targetSymbolView.presentWin(progress)

		if (progress >= 1) {
			symbolView.setVisible(false)
			this.presentSymbol(targetSymbolId)
		}
	}

	presentFallIn({
		symbolId = 0,
		distance = 0,
		idleProgressOffset = 0,
		delay = 1,
	}) {

		if(!distance) return

		const symbolView =  this.getSymbolView(symbolId)
		const fallingView = this.safeView ?? symbolView
		const finalDistance = distance * CELL_HEIGHT
		const fallDuration = Math.min(350, distance * 100)
		symbolView.idleProgressOffset = idleProgressOffset


		this.presentSymbol(symbolId)
		fallingView.y = -finalDistance
		this.update()
		this.adjustDistortion()
		

		return this
			.cascadeTimeline
			.deleteAllAnimations()
			.addAnimation({
				delay,
				duration: fallDuration,
				onProgress: (progress) => {
					fallingView.y = -finalDistance * (1 - progress ** 2)
					this.update()
					this.adjustDistortion()
				}
			})
			.addAnimation({
				delay: fallDuration + delay,
				duration: 250,
				onDelayFinish: () => this.onFallIn?.(),
				onProgress: (progress) => {
					const subProgress = Math.sin(Math.PI * progress)

					fallingView.y = subProgress * -CELL_HEIGHT * 0.25
					symbolView.setBlur?.(1 - Math.min(1, progress * 2))	
					this.adjustDistortion()
				}
			})
			.play()
	}

	setSecured(isSecured = true) {
		this.isSecured = isSecured
		this.safeView?.setVisible(isSecured)
		this.safeView?.reset()
	}

	isIdling() {
		return this.getSymbolView().isIdling()
	}
	// ...API
}
