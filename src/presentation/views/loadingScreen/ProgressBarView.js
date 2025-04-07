import { Container, Graphics, Sprite } from "pixi.js";
import { AdaptiveContainer } from "../adaptiveDesign/AdaptiveContainer";
import { TextField } from "../text/TextField";
import { Timeline } from "../../timeline/Timeline";
import { colorToColor, getRectangleSpot } from "../GraphicalPrimitives";
import { SymbolWatchesView } from "../reels/cell/symbols/SymbolWatchesView";
import { TouchScreenHintView } from "../splashScreens/hints/TouchScreenHintView";
import { HintView } from "../splashScreens/hints/HintView";

export class ProgressBarView extends AdaptiveContainer {
	idleTimeline = new Timeline
	timeline = new Timeline
	textField
	isMobileDevice

	constructor({assets, dictionary, isMobileDevice}) {
		super()

		this.setSourceArea({width: 1000, height: 1000})
		this.initWatches(assets)
		this.initText(dictionary)

		this.dictionary = dictionary
		this.isMobileDevice = isMobileDevice
	}

	initWatches(assets) {
		const view = new SymbolWatchesView(assets, 1)
		view.position.set(500)
		view.scale.set(1)
		this.watchesView = this.addChild(view)

		this.idleTimeline
			.addAnimation({
				duration: 8000,
				onProgress: progress => {

					const watchesDistortionProgress = (progress * 2) % 1
					view.featureFlipProgress = watchesDistortionProgress
					view.featureSpinProgress = watchesDistortionProgress
					
					view.update(progress)

					this.textField.scale.set(0.85 + 0.15 * Math.abs(Math.sin(Math.abs(Math.PI * 12 * progress))))
					this.textField.setFontColor(
						colorToColor(
							255,
							255,
							0,
							255,
							255,
							255,
							Math.sin(Math.abs(Math.PI * 6 * progress))
						)
					)

					this.hintView?.present((progress * 12) % 1)
					
				}
			})
			.setLoopMode()
			.play()
	}

	updateTargetArea(sidesRatio) {
		if(sidesRatio > 1)
			this.setTargetArea({x: 0.25, y: 0.25, width: 0.5, height: 0.5})
		else
			this.setTargetArea({x: 0.05, y: 0.25, width: 0.9, height: 0.5})
	}


	destroy() {
		super.destroy()
		this.hintView.destroy()
		this.timeline.destroy()
		this.idleTimeline.destroy()
	}

	initText(dictionary) {
		const maximalWidth = 500
        const maximalHeight = 50

        const textField = new TextField({maximalWidth, maximalHeight})
            .setFontName('default')
            .setFontSize(maximalHeight)
            .setFontColor(0xFFFF00)
            .setAlignCenter()
            .setAlignMiddle()
            .setText(dictionary.loading)

        textField.pivot.set(maximalWidth / 2, maximalHeight / 2)
		textField.position.set(500, 1100)
        this.textField = this.addChild(textField)
	}

	presentInteractionRequest(assets) {
		const {isMobileDevice, dictionary} = this

		const hintView = isMobileDevice
			? new TouchScreenHintView(assets)
			: new HintView(assets)

		hintView.position.set(500, 1250)
		hintView.scale.set(0.45)
		this.hintView = this.addChild(hintView)


		return this
			.timeline
			.addAnimation({
				duration: 200,
				onProgress: (progress) => {
					this.textField.alpha = 1 - Math.sin(Math.PI * progress)
				},
			})
			.addAnimation({
				duration: 100,
				onFinish: () => {
					this.textField.setText(
						isMobileDevice
							? dictionary.tap_to_continue
							: dictionary.click_to_continue
					)
				},
			})
			.play()
	}
}