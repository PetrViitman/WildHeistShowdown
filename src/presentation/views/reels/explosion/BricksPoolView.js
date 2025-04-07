import { Container } from "pixi.js";
import { BrickView } from "./BrickView";
import { Timeline } from "../../../timeline/Timeline";

const BRICKS = [
    {
        x: 150,
        y: 100,
        scaleX: 0.35,
        scaleY: 0.35,
        rotation: Math.PI * 0.1,
        fallAngle: 1
    },

    {
        x: -150,
        y: 100,
        scaleX: 0.35,
        scaleY: 0.25,
        rotation: Math.PI * 0.9,
        fallAngle: -1
    },

    {
        x: 0,
        y: 75,
        scaleX: 1,
        scaleY: 0.75,
        rotation: Math.PI / 2
    },
    {
        x: 160,
        y: -45,
        scaleX: 0.8 * 0.75,
        scaleY: 0.8,
        rotation: Math.PI * 0.1,
        fallAngle: 0.75
    },

    {
        x: -160,
        y: -45,
        scaleX: 0.8 * 0.75,
        scaleY: 0.8,
        rotation: Math.PI * 0.9,
        fallAngle: -0.75
    },


    {
        x: 0,
        y: -60,
        scaleX: 0.65,
        scaleY: 0.5,
        rotation: Math.PI  * 0.8,
        fallAngle: -0.75
    },

    {
        x: -60,
        y: -150,
        scaleX: 0.6,
        scaleY: 0.45,
        rotation: Math.PI  * 0.65
    },

    {
        x: 70,
        y: -150,
        scaleX: 0.45,
        scaleY: 0.45,
        rotation: Math.PI  * 0.35
    },
]

export class BricksPoolView extends Container {
    constructor(assets) {
        super()

        this.initBricks(assets)

        /*
        new Timeline()
            .addAnimation({
                duration: 2000,
                onProgress: progress => this.presentDecomposition(progress)
            })
            .setLoopMode()
            .play()
        */
    }


    initBricks(assets) {
        this.bricksViews = BRICKS.map(({
            x = 0,
            y = 0,
            scaleX = 1,
            scaleY = scaleX,
            rotation = 0,
            fallAngle = 0
        }) => {
            const view = new BrickView(assets)

            view.position.set(x, y)

            view.scale.set(scaleX, scaleY)
            view.setSpin(rotation)
            view.offsetAngle = Math.atan2(y, x)
            view.offsetAngleCos = Math.cos(view.offsetAngle)

            return this.addChild(view)
        })
    }

    presentDecomposition(progress) {
        BRICKS.forEach(({
            x = 150,
            y = 100,
            scaleX = 0.35,
            scaleY = 0.35,
            rotation = Math.PI * 0.1,
            fallAngle = 0
        }, i) => {
            const view = this.bricksViews[i]

            view.setFlip((1 - progress) * 0.25)

            view.setSpin(rotation + fallAngle * progress)
            view.position.set(
                x + 200 * progress * view.offsetAngleCos,
                y + 300 * progress ** 2
            )
        })

        this.alpha = Math.min(1, (1 - progress) * 2)
    }

}