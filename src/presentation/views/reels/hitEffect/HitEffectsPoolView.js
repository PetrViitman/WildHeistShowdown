import { Container } from "pixi.js"
import { CELL_HEIGHT, CELL_WIDTH, REELS_COUNT, REELS_LENGTHS, REELS_OFFSETS } from "../../../Constants"
import { HitEffectView } from "./HitEffectView"
import { Timeline } from "../../../timeline/Timeline"

export class HitEffectsPoolView extends Container {
    hitEffectsViews
    timelines
    audio

    constructor(assets, audio) {
        super()
        this.initHitEffects(assets)
        this.initTimelines()
        this.audio = audio
    }

    initHitEffects(assets) {
        this.hitEffectsViews = REELS_OFFSETS.map((offsetY, i) => {
            const view  = new HitEffectView(assets)
            const offsetX = (i - 2.5)
            const offsetProgress = 0.95 + 0.05 * (1 - Math.abs(offsetX) / 2.5)

            view.x = offsetX * offsetProgress * CELL_WIDTH
            view.y = CELL_HEIGHT * (offsetY + REELS_LENGTHS[i]) - CELL_HEIGHT
            view.scale.set(1.5)

            return this.addChild(view)
        })
    }

    initTimelines() {
        this.timelines = REELS_LENGTHS.map((_, x) => {
            return new Timeline()
                .addAnimation({
                    duration: 300,
                    onProgress: progress => this.hitEffectsViews[x].present(progress)
                })
            }
        )
    }

    presentHit({x, y, symbolId}) {
        const hitEffectView = this.hitEffectsViews[x]
		const distanceX = x - 3
		const rollProgress = y / REELS_LENGTHS[x]

		hitEffectView.x = distanceX * CELL_WIDTH + CELL_WIDTH / 2
		hitEffectView.y = (REELS_LENGTHS[x] * rollProgress + REELS_OFFSETS[x] + 0.15) * CELL_HEIGHT

        this.audio.presentReelHit()
        hitEffectView.setSkin(symbolId)
		this.timelines[x]
			.wind(0)
			.play()
    }

    setTimeScale(scale) {
		const scaleDescriptor = {name: 'scale', value: scale}

		this.timelines.forEach(timeline => {
            timeline.setTimeScaleFactor(scaleDescriptor)
        });
	}
}