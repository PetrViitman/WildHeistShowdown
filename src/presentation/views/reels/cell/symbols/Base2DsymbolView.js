import { Container, Sprite } from "pixi.js";
import { brightnessToHexColor } from "../../../GraphicalPrimitives";

const SYMBOLS_ID_NAMES_MAP = {
    1: 'clubs',
    2: 'hearts',
    3: 'diamonds',
    4: 'spades',
    5: 'bottle',
    6: 'hat',
    7: 'pistol',
    8: 'watches',
    9: 'wild',
    10: 'scatter',
}

export class Base2DSymbolView extends Container {
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

	bodyView
	blurredBodyView

	constructor(id, assets) {
		super()
		this.initContainers()
        this.initBody(id, assets)
        this.initBlurredBody(id, assets)
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

	initBody(id, assets) {
        const sprite = new Sprite(assets['symbol_' + SYMBOLS_ID_NAMES_MAP[id]])
        sprite.anchor.set(0.5)

        this.bodyView = this.facesContainer.addChild(sprite)
	}

	initBlurredBody(id, assets) {
		const texture = assets['symbol_' + SYMBOLS_ID_NAMES_MAP[id] + '_motion_blur']
		if(!texture) return
        const sprite = new Sprite(assets['symbol_' + SYMBOLS_ID_NAMES_MAP[id] + '_motion_blur'])
        sprite.anchor.set(0.5)
		sprite.scale.set(2)

        this.blurredBodyView = this.addChild(sprite)
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


	adjustBrightness() {
		const tint = brightnessToHexColor(
			Math.max(0.25, this.brightness))
		this.bodyView.tint = tint
	}


	// API...
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

    presentTeasing(progress) {
        const subProgress =  Math.abs(Math.sin(Math.PI * 3 * progress))

		this.contentContainer.scale.set(1 + 0.5 * subProgress * (1 - progress))
	}

    randomizeIdleOffset() {
		this.idleProgressOffset = Math.random()
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

	update(progress = this.idleProgress) {
        this.idleProgress = progress

        if(!this.visible) return

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
		
		this.rotation = finalSpinProgress * Math.PI * 2
		this.bodyView.y = 25 * Math.sin(Math.PI * 4 * idleSpinProgress)
		// ...SPIN
    }

	isIdling(){
		return !!this.idleFactor
	}
	// ...API
}