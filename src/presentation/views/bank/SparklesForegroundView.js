import { Container, Sprite } from "pixi.js";
import { AdaptiveContainer } from "../adaptiveDesign/AdaptiveContainer";
import { Timeline } from "../../timeline/Timeline";
import { SparkleView } from "./torch/SparkleView";

export class SparklesForegroundView extends AdaptiveContainer {
    starsViews = []

    constructor(assets) {
        super()

        this.initParticles(assets)

        this.setSourceArea({width: 1000,  height: 1000})
            .setTargetArea({x: 0, y: 0.5, width: 1, height: 0.5})
            .stretchHorizontally()
            .stretchVertically()


        new Timeline()
            .addAnimation({
                duration: 80000,
                onProgress: progress => {
                    // const angle = Math.PI +  Math.PI * 2 * progress

                    this.starsViews.forEach((view, i) => {
                        view.bodyView.rotation = Math.PI / 2
                        // const finalAngle = Math.PI + (view.angleToCenter + angle + view.offsetAngle) % (Math.PI)

                        const finalProgress = (progress * view.scaleFactor + i * 0.01) % 1

                        const angle = Math.abs( Math.sin(Math.PI * 1 * finalProgress))
                        view.x = 1000 * (1 - finalProgress) 
                        view.y = view.offsetY + 200 * angle
                       
                        view.setSpin(Math.sin(Math.PI * finalProgress * 10) * 2) 

                        view.alpha = Math.sin(Math.PI * finalProgress)
                        // view.bodyView.rotation = angle + Math.PI * 0.7

                        // view.bodyView.scale.set(0.5 + view.scaleFactor * 0.05)
                        /*
                        view.position.set(
                            view.distance * Math.cos(finalAngle) + 500,
                            view.distance * Math.sin(finalAngle) + 1000
                        )
                            */

                        // if (view.x < 0) view.x += 1000 
                        // if (view.y > 1000) view.y -= 1000 
                        //view.x = Math.abs(view.x % 1000)
                        //view.y = Math.abs(view.y % 1000)
                    })
                }
            })
                .setLoopMode()
                .play()
    }

    initParticles(assets) {


        for(let i = 0; i < 25; i++) {
            const view = new SparkleView(assets)
            view.scaleFactor = 1 + Math.trunc(Math.random() * 10)
            view.offsetY = Math.random() * 1000

            this.addChild(view)

            //const container = this.addChild(new Container)
            //const starView = new Sprite(assets.sparkle_body)
            //container.scaleFactor = 1 + Math.trunc(Math.random() * 10)
            //starView.anchor.set(0.5)
            //container.offsetY = Math.random() * 1000
            //container.alpha = 0.5

            //container.bodyView = starView
            //container.addChild(starView)
            this.starsViews.push(view)
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

    onAdjustedToTargetArea() {
        const scaleFactor = Math.min(this.scale.x, this.scale.y) * 2

        this.starsViews.forEach(view => {
            const starScale = scaleFactor *  (0.5 +  view.scaleFactor * 0.05)

            view.scale.set(
                1 / this.scale.x * starScale,
                1 / this.scale.y * starScale)
        })
    }
}