import { REELS_HEIGHT, REELS_WIDTH } from "../Constants"
import { Timeline } from "../timeline/Timeline"
import { AdaptiveContainer } from "./adaptiveDesign/AdaptiveContainer"

export class TransitionView extends AdaptiveContainer {
	timeline = new Timeline()
	reelsView
	camera

	constructor({reelsView, camera}) {
		super()

		this.reelsView = reelsView
		this.camera = camera

		this.setSourceArea({
				width: 1000,
				height: 1000,
			})
			.setTargetArea({
				x: 0,
				y: 0,
				width: 1,
				height: 1,
			})
			.stretchHorizontally()
			.stretchVertically()
			.highlight(0xFFFFFF, 1)

		this.visible = false
	}

	presentTransition() {
		return new Promise(resolve => {
			this.timeline
				.wind(1)
				.deleteAllAnimations()
				.addAnimation({
					duration: 500,
					onStart: () => {
						this.visible = true
						this.camera
							.focus({
								view: this.reelsView,
								offsetX: 737,
								offsetY: 500,
							})
					},
					onProgress: (progress) => {
						this.alpha = progress
						this.camera
							.setZoom(1 + progress * 2)
					},
					onFinish: resolve
				})
				.addAnimation({
					delay: 500,
					duration: 500,
					onDelayFinish: () => {
						this.camera
							.setZoom(1)
					},
					onProgress: (progress) => {
						this.alpha = 1 - progress
					},
					onFinish: () => {
						this.visible = false
					}
				})
				.windToTime(1)
				.play()
		})
	}
}