import { AdaptiveContainer } from "../adaptiveDesign/AdaptiveContainer";
import { Timeline } from "../../timeline/Timeline";
import { HintView } from "./hints/HintView";
import { TouchScreenHintView } from "./hints/TouchScreenHintView";

export class BaseSplashScreen extends AdaptiveContainer {
	overlayView
	dictionary
	assets
	isMobileDevice
	camera
	timeline = new Timeline
	isVisible = false
	audio
	
	constructor({
		assets,
		dictionary,
		isMobileDevice,
		camera,
		awardView,
		audio
	}) {
		super()

		this.audio = audio
		this.awardView = awardView
		this.assets = assets
		this.dictionary = dictionary
		this.isMobileDevice = isMobileDevice
		this.camera = camera

		this.initOverlay()
		this.initBody({})

		this.initHint(assets)
		this.visible = false
	}

	initOverlay() {
		const view = new AdaptiveContainer()
			.setSourceArea({
				width: 100,
				height: 100 
			})
			.setTargetArea({
				x: 0,
				y: 0,
				width: 1,
				height: 1,
			})
			.stretchHorizontally()
			.stretchVertically()
			.highlight(0x000000, 0.9)

		this.overlayView = this.addChild(view)
	}

	initBody({
		width = 1000,
		height = 1700
	}) {
		const view = new AdaptiveContainer()
			.setSourceArea({
				width,
				height 
			})

		this.bodyView = this.addChild(view)
	}

	updateTargetArea(sidesRatio) {
		const {
			bodyView,
			isMobileDevice,
			offsetTop = 0,
			offsetBottom = 0
		} = this

		if(sidesRatio > 1.25) {
			 // WIDE LANDSCAPE...
			bodyView.setTargetArea({
				x: 0,
				y: offsetTop,
				width: 1,
				height: (isMobileDevice ? 0.8 : 0.9) - offsetBottom
			})
			.stickMiddle()
			// ...WIDE LANSCAPE
		} else if (sidesRatio >= 1) {
			// NARROW LANDSCAPE...
			bodyView.setTargetArea({
				x: 0.25,
				y: offsetTop + 0.1,
				width: 0.5,
				height: 0.7 - offsetBottom,
			})
			.stickMiddle()
			// ...NARROW LANDSCAPE
		} else  if (sidesRatio >= 0.35) {
			// PORTRAIT...
			bodyView.setTargetArea({
				x: 0,
				y: offsetTop + 0.1,
				width: 1,
				height: 0.675 - offsetBottom,
			})
			.stickBottom()
			// ...PORTRAIT
		} else {
			// NARROW PORTRAIT...
			bodyView.setTargetArea({
				x: 0,
				y: offsetTop,
				width: 1,
				height: 1 - offsetBottom,
			})
			.stickMiddle()
			// ...NARROW PORTRAIT
		}
	}

	setVisible(isVisible = true) {
		if(this.isVisible === isVisible) return

		return this
			.timeline
			.deleteAllAnimations()
			.addAnimation({
				duration: 300,
				target: this,
				key: 'alpha',
				initialValue: isVisible ? 0 : 1,
				finalValue: isVisible ? 1 : 0,
				onStart: () => {
					this.visible = true
				},
				onFinish: () => {
					this.isVisible = isVisible
					this.visible = isVisible
				}
			})
			.play()
	}

	initHint(assets) {
		const {isMobileDevice} = this
		const hintView = isMobileDevice
			? new TouchScreenHintView(assets)
			: new HintView(assets)

		hintView.position.set(500, 1450)
		hintView.scale.set(0.65)
		this.hintView = this.bodyView.addChild(hintView)
	}

	setAdaptiveDesignOffsets({offsetTop, offsetBottom}) {
        this.offsetTop = offsetTop
        this.offsetBottom = offsetBottom + offsetTop
        this.onResize()
    }
}