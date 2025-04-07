import { Container } from "pixi.js";
import { CELL_HEIGHT, CELL_WIDTH, REELS_COUNT, REELS_HEIGHT, REELS_OFFSETS } from "../../../Constants";
import { TensionView } from "./TensionView";
import { getRandomLoseReels } from "../../../Utils";
import { Timeline } from "../../../timeline/Timeline";

export class TensionPoolView extends Container {
    tensionsViews
	timeline = new Timeline

    constructor(assets) {
        super()
        this.initTensions(assets)

    }

    initTensions(assets) {
        this.tensionsViews = REELS_OFFSETS.map((offsetY, i) => {
            const view  = new TensionView(assets, i)
            const offsetX = (i - 2.5)
            const offsetProgress = 0.75 + 0.25 * (1 - Math.abs(offsetX) / 2.5)

            view.x = offsetX * offsetProgress * CELL_WIDTH
            view.y = CELL_HEIGHT * offsetY

            return this.addChild(view)
        })
    }

	presentFreeSpinsAward(isFreeSpinsMode) {
		const multiplier = isFreeSpinsMode ? 1 : 10
		this.timeline
			.deleteAllAnimations()
			.addAnimation({
				duration: 2000 * multiplier,
				onProgress: progress => {
					const subProgress = (progress * multiplier) % 1
					const alpha = Math.min(1, Math.sin(Math.PI * progress) * 2 * multiplier)

					this.tensionsViews.forEach(view => {
						view.setProgress(subProgress)
						view.alpha = alpha
					})
				}
			})
			.play()
	}

	drop() {
		this.timeline.wind(1)
	}
}