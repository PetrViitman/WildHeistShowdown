import { AdaptiveContainer } from "../adaptiveDesign/AdaptiveContainer";
import { ProgressBarView } from "./ProgressBarView";
import { Timeline } from "../../timeline/Timeline";

export class LoadingScreen extends AdaptiveContainer {
	backgroundView
	progressBarView
	overlayView
	isMobileDevice

	constructor({
		assets,
		dictionary,
		isMobileDevice
	}) {
		super()

		this.isMobileDevice = isMobileDevice
		this.initBackground()
		this.initProgressBar({assets, dictionary, isMobileDevice})

		AdaptiveContainer.onResize()
	}

	initBackground() {
		const container = this
			.addChild(new AdaptiveContainer)
			.setTargetArea({x: 0, y: 0, width: 1, height: 1})
			.setSourceArea({width: 100, height: 100})
			.highlight(0x000000, 1)
			.stretchHorizontally()
			.stretchVertically()

		this.backgroundView = container
	}


	initProgressBar({assets, dictionary, isMobileDevice}) {
		this.progressBarView = new ProgressBarView({assets, dictionary, isMobileDevice})
		this.addChild(this.progressBarView)
	}

	setProgress(progress) {
	}

	async hide(progressCallback) {
		const timeline = new Timeline()
			.addAnimation({
				duration: 1000,
				onProgress: (progress) => {
					this.progressBarView.alpha = 1 - Math.min(progress * 5, 1)
					this.alpha = 1 - progress
					progressCallback?.(progress)
				}
			})

		await timeline.play()
		this.progressBarView.destroy()
		timeline.destroy()
	}

	async presentInteractionRequest(assets) {
		await this.progressBarView.presentInteractionRequest(assets)

		return new Promise(resolve => {
			this.eventMode = 'static'
			this.addEventListener('pointerdown', resolve)
		})
	}
}