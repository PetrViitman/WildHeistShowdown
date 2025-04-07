import { Container, Sprite } from "pixi.js"
import { Timeline } from "../../timeline/Timeline"

export class UpSparklesPoolView extends Container {
    constructor(assets) {
        super()

        this.initSparkles(assets)
    }

    initSparkles(assets) {
        this.sparklesViews = [
            0.1,
            0.15,
            0.3,
            0.5,
            0.6,
            0.7,
            0.8,
            0.9
        ].map(progressOffset => {
            const sprite = new Sprite(assets.up_sparkle)
            sprite.anchor.set(0.5, 0.35)
            sprite.progressOffset = progressOffset

            return this.addChild(sprite)
        })


        new Timeline()
            .addAnimation({
                duration: 8000,
                onProgress: progress => {
                    const loopProgress = ((progress ** 1.1) * 5) % 1

                    this.sparklesViews.forEach((view, x) => {
                        const shiftedProgress = ((loopProgress + view.progressOffset) % 1)
                        const floatingProgress = Math.sin(Math.PI * shiftedProgress)


                        view.x = -500 + 1000 * ((x * 0.375) % 1) + 50 * Math.cos(Math.PI * 8 * shiftedProgress) * (1 - floatingProgress)
                        view.y = 700 - 1400 * shiftedProgress ** 2

                        view.skew.x = 0.5 * Math.sin(Math.PI * 8 * shiftedProgress) * (1 - floatingProgress)
                        view.scale.y = 0.5 + 1 * shiftedProgress ** 2
                        view.alpha = Math.min(1, floatingProgress * 3)
                    })
                }
            })
            .setLoopMode()
            .play()
    }
}