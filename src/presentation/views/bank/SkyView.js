import { Container, Sprite } from "pixi.js";
import { AdaptiveContainer } from "../adaptiveDesign/AdaptiveContainer";
import { Timeline } from "../../timeline/Timeline";

const COLORS = [
    0xFFFFFF,
    0xFF99FF,
    0xFFFF99,
]

export class SkyView extends AdaptiveContainer {
    starsViews = []
    flipProgress = 0

    constructor(assets, vfxLevel) {
        super()

        this.initParticles(assets, vfxLevel)

        this.setSourceArea({width: 1000,  height: 1000})
            .setTargetArea({x: 0, y: 0, width: 1, height: 0.6})
            .stretchHorizontally()
            .stretchVertically()


        new Timeline()
            .addAnimation({
                duration: 360000,
                onProgress: progress => {
                    const shiftStep = 1 / this.starsViews.length

                    this.starsViews.forEach((view, i) => {
                        const finalProgress = (progress + i * shiftStep + this.flipProgress) % 1

                        view.x = 1000 * finalProgress 
                        view.y = view.offsetY
                        if (view.y > 1000) view.y -= 1000

                        view.bodyView.rotation = Math.PI * finalProgress
                        view.bodyView.scale.set(
                            0.5 + view.scaleFactor * 0.05
                            + 0.1 * Math.sin(Math.PI * (500 * progress + view.bodyView.progressOffset))
                        )
                    })
                }
            })
                .setLoopMode()
                .play()
    }

    initParticles(assets, vfxLevel) {
        const starsCount = 25 + Math.trunc(50 * vfxLevel)

        for(let i = 0; i < starsCount; i++) {
            const container = this.addChild(new Container)
            const starView = new Sprite(assets.sky_star)
            container.scaleFactor = 0.5 + Math.trunc(Math.random() * 2)
            starView.tint = COLORS[i % COLORS.length]
            starView.anchor.set(0.5)
            container.offsetY = 1000 * Math.random()
            starView.progressOffset = Math.random()
            //container.alpha = 0.5

            container.bodyView = starView
            container.addChild(starView)
            this.starsViews.push(container)
        }

        /*
        for(let y = 0; y > -10; y--) {
            for(let x = -5; x < 10; x++) {
                const starView = new Sprite(assets.sparkle_body)
                starView.offsetAngle = Math.random() * Math.PI * 2
                starView.anchor.set(0.5)

                this.addChild(starView)
                this.starsViews.push(starView)
                starView.position.set(x * 100 + 50 + 500, y * 100 + 50 + 900)

                starView.distance = Math.hypot(starView.x - 500, starView.y)
                starView.angleToCenter = Math.atan2(starView.y, starView.x - 500)
            }
        }
            */
    }

    updateTargetArea(sidesRatio) {
        const {
            offsetTop = 0,
            offsetBottom = 0
        } = this

        if (sidesRatio > 0.6) {
            this.setTargetArea({x: 0, y: offsetTop, width: 1, height: 0.6 - offsetBottom})
        } else {
            this.setTargetArea({x: 0, y: offsetTop, width: 1, height: 0.35 - offsetBottom})
        }
    }

    setFlip(flipProgress) {
        this.flipProgress = flipProgress
    }

    onAdjustedToTargetArea() {
        const scaleFactor = Math.min(this.scale.x, this.scale.y) * 0.35

        this.starsViews.forEach(view => {
            const starScale = scaleFactor *  (0.25 +  view.scaleFactor * 0.15)

            view.scale.set(
                1 / this.scale.x * starScale,
                1 / this.scale.y * starScale)
        })
    }

    setAdaptiveDesignOffsets({offsetTop, offsetBottom}) {
        this.offsetTop = offsetTop
        this.offsetBottom = offsetBottom + offsetTop
        this.onResize()
    }
}