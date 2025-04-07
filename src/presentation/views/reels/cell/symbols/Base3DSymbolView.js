import { BLEND_MODES, Container, Graphics, Sprite } from "pixi.js";
import { brightnessToHexColor } from "../../../GraphicalPrimitives";

export class Base3DSymbolView extends Container {
	commonFlipProgress = 0.0001
	commonSpinProgress = 0

	featureFlipProgress = 0
	featureSpinProgress = 0

	// idleFlipProgress
	// idleSpinProgress

	idleProgress = 0
	idleProgressOffset = 0
	idleFactor = 1
	flameIntensity = 1
	
	distances = []
	angles = []
	brightness = 1
	flameProgress = 0
	assets

	contentContainer
	facesContainer
	facesViews = []
	flamesContainer
	flamesViews = []

	blurredBodyView

	constructor(assets, vfxLevel) {
		super()
		this.assets = assets
		this.init(vfxLevel)

		/*
		if(this.blurredBodyView) {
			this.blurredBodyView.visible = false
		}
		this.blurredBodyView = this.addChild(new Container)

		const colorMap = [
			0xFF0000,
			0x00FF00,
			0x0000FF,
			0xFFFF00,
			0x00FFFF,
			0xFF00FF,
			0xFFFFFF,
		]

		const color = colorMap[Math.trunc(colorMap.length * Math.random())]

		for(let i = 0; i < 100; i++ ) {
			const container = new Container()

			container.rotation = 0.1 * i

			this.blurredBodyView.addChild(container)

			container.addChild(new Graphics().beginFill(color, 0.1).drawRect(-100, -100, 200, 200).endFill())
			container.mask = container.addChild(new Graphics().beginFill(0xFF0000, 0.5).drawRect(-200, -200, 400, 400).endFill())
		}

		this.setBlur(0)
		*/

		/*
		const colorMap = [
			0xFF0000,
			0x00FF00,
			0x0000FF,
			0xFFFF00,
			0x00FFFF,
			0xFF00FF,
			0xFFFFFF,
		]

		const color = colorMap[Math.trunc(colorMap.length * Math.random())]

		for(let i = 0; i < 100; i++ ) {
			const container = new Container()

			container.rotation = 0.1 * i

			this.addChild(container)

			container.addChild(new Graphics().beginFill(color, 0.1).drawRect(-100, -100, 200, 200).endFill())
			container.mask = container.addChild(new Graphics().beginFill(0xFF0000, 0.5).drawRect(-200, -200, 400, 400).endFill())
		}
			*/
	}


	init(vfxLevel) {
		this.initContainers()

		vfxLevel >= 0.2 && this.initFlames(vfxLevel)
		this.initFaces()

		
		// this.mask = this.addChild(new Graphics().beginFill(0xFF0000, 0.5).drawRect(-200, -200, 400, 400).endFill())
		
		this.initBlurredBody()
		this.setFlip()
		this.randomizeIdleOffset()
	}

	initContainers() {
		this.contentContainer = this.addChild(new Container)
		this.flamesContainer = this
			.contentContainer
			.addChild(new Container)
		this.facesContainer = this
			.contentContainer
			.addChild(new Container)
	}

	initFlames(texture) {
		for(let i = 0; i < 4; i++) {
			const sprite = new Sprite(texture)
			sprite.anchor.set(0.5)
			sprite.scale.set(1.9)
			this.flamesViews.push(
				this.flamesContainer.addChild(sprite))
		}
	}

	initBlurredBody() {
		// this.blurredBodyView = this.addChild(new Container)
	}

	initFaces(assets) {
		const {
			facesContainer,
			facesViews,
			distances,
			angles,
		} = this
	}

	setVisible(isVisible = true) {
		this.visible = isVisible
	}

	setBlur(progress = 0) {
		if(!this.blurredBodyView) return
		this.blurredBodyView.alpha = progress
		this.facesContainer.alpha = 1 - progress

		this.blurredBodyView.scale.y = 2 + progress * 0.7
	}

	setBrightness(brightness = 1) {
		const finalBrightness = Math.min(1, Math.max(0.05, brightness))

		if (this.brightness === finalBrightness) return
		this.brightness = finalBrightness

		this.adjustBrightness()
	}

	onFlipped(progress, offsetProgress) {

	}

	adjustBrightness() {
		const tint = brightnessToHexColor(
			Math.max(0.25, this.brightness))

		this.facesContainer.children.forEach(view => {
			view.tint = tint
		})

		this.flamesContainer.alpha = this.brightness * this.flameIntensity
		if(this.blurredBodyView)
		this.blurredBodyView.tint = tint

		this.onBrightnessUpdated(tint)
	}

	onBrightnessUpdated(tint) {

	}

	/*
	adjustBrightness() {
		this.facesViews.forEach(view => {
			view.tint = brightnessToHexColor(
				Math.max(0.25, Math.abs(view.flipProgress ?? 0)) * this.brightness)
		})

		this.flamesContainer.alpha = this.brightness
	}
	*/

	adjustFlame() {
		// this.flamesContainer.rotation = this.facesContainer.rotation
		this.flamesContainer.alpha = this.brightness * this.flameIntensity
		const progressShiftStep = 1 / (this.flamesViews.length - 1)

		const scaleFactor = (0.6 + (1 - Math.abs(Math.sin(Math.PI * 2 * this.flipProgress))) * 0.4) * 1.9

		this.flamesViews.forEach((view, i) => {
			//view.rotation = this.rotation
			const shiftedProgress = (this.flameProgress + this.idleProgressOffset + progressShiftStep * i) % 1

			const subProgress = Math.sin(Math.PI * shiftedProgress)

			view.y = -60 * shiftedProgress + 10//  ** 2
			view.x = 10 * Math.sin(Math.PI * 3 * shiftedProgress) * (1 - shiftedProgress)
			view.alpha = subProgress  * (1 - shiftedProgress)
			view.rotation = this.facesContainer.rotation
			view.scale.x = scaleFactor
		})
	}

	// API...
	setFlip(flipProgress = 0) {
		
		if (this.flipProgress === flipProgress) return

		const finalFlipProgress = flipProgress
		this.flipProgress = finalFlipProgress

		if(this.flipProgress > 1) {
			this.flipProgress %= 1
		} else if (this.flipProgress < 0) {
			this.flipProgress += 1
		}

		const {
			facesContainer,
			facesViews,
			distances,
			angles,
		} = this

		const progress = Math.cos(Math.PI * 2 * finalFlipProgress)
		const offsetProgress = Math.sin(Math.PI * 2 * finalFlipProgress)


		for(let i = 0; i < facesViews.length; i++) {
			const angle = (angles[i] ?? 0) + Math.PI * 2 * finalFlipProgress
			const progress = Math.cos(angle)


			const faceView = facesViews[i]
			const distance = distances[i] ?? 100
			const offsetProgress = Math.sin(angle)

			faceView.visible = (progress >= 0 && progress <= 1)

			if(faceView.visible) {
				faceView.scale.x = progress
				faceView.x = offsetProgress * distance
				faceView.finalFlipProgress = progress
			}
		}

		this.adjustBrightness()

		const distortionProgress = Math.sin(Math.PI * 4 * finalFlipProgress)
		facesContainer.x = 15 * distortionProgress
		facesContainer.skew.x = -0.05 * distortionProgress
		facesContainer.scale.set(0.95 + 0.05  * distortionProgress)

		this.onFlipped(progress, offsetProgress)
	}

	setSpin(spinProgress) {
		if (this.spinProgress === spinProgress) return
		this.spinProgress = spinProgress
		const angle = Math.PI * 2 * spinProgress
		this.facesContainer.rotation = angle
	}

	copyMetrics(symbolView) {
		this.setFlip(symbolView.finalProgress)
		this.setSpin(symbolView.spinProgress)
		this.setBrightness(symbolView.brightness)
	}

	presentWin(progress) {
		const subProgress = Math.sin(Math.PI * progress)

		this.scale.set(1 + 0.15 * subProgress)
		this.idleFactor = 1 - subProgress
		this.featureFlipProgress = subProgress * 0.5
		this.facesContainer.y = -25 * subProgress
	}

	presentCoefficients(progress) {
		this.contentContainer.scale.set(1 + 0.35 * Math.abs(Math.sin(Math.PI * progress)))
	}

	reset() {
		this.featureFlipProgress = 0
		this.featureSpinProgress = 0
		this.brightness = 1
		this.idleFactor = 1
	}

	presentCorruption() {
        // this.setVisible(false)
    }

	randomizeIdleOffset() {
		this.idleProgressOffset = Math.random()
	}

	setFlameColor(color) {
        this.flamesViews?.forEach(view => {
            view.tint = color
        })
    }

	update(progress = this.idleProgress) {
		this.idleProgress = progress
		
		if(!this.visible) return

		// FLIP...
		const idleFlipProgress =
			0.065
			* this.idleFactor
			* Math.cos(
				Math.PI * 2 * (
					progress
					+ this.idleProgressOffset
				)
			)

		const finalFlipProgress = (
				idleFlipProgress
				+ this.featureFlipProgress
			) % 1
		
		this.setFlip(finalFlipProgress)
		// ...FLIP

		// SPIN...
		const idleSpinProgress =
			0.015
			* this.idleFactor
			* Math.cos(
				Math.PI * 2 * (
					progress
					+ this.idleProgressOffset
				)
			)

		const finalSpinProgress = (
				idleSpinProgress
				+ this.featureSpinProgress
			) % 1
		
		this.setSpin(finalSpinProgress)
		// ...SPIN
		
		// FLAME...
		this.flameProgress = (progress * 5) % 1
		this.adjustFlame()
		// ...FLAME
	}

	isIdling(){
		return !!this.idleFactor
	}
	// ...API
}