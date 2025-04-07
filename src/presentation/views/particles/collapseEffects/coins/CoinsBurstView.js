import { FalloutCoinView } from "./FalloutCoinView";
import { Container } from "pixi.js";
const OFFSET_X = 300
const LIFT_HEIGHT = 400
const FALL_HEIGHT = 800


export class CoinsBurstView extends Container {
    coinsViews
    descriptors = []
    fallHeight

    constructor({
        assets,
        fallHeight = FALL_HEIGHT
    }) {
        super()

        this.fallHeight = fallHeight
        this.randomize()
        this.initCoins(assets)
        this.presentFallout(0)
    }

    randomize() {
        for(let i = 0; i < 5; i++) {
            this.descriptors[i] = {
                offsetX: -OFFSET_X + Math.random() * OFFSET_X * 2,
                lightHeight: LIFT_HEIGHT * Math.random(),
                fallHeight: this.fallHeight,
            }
        }
    }

    initCoins(assets) {
        this.coinsViews = this.descriptors.map(_ => {
                const view = new FalloutCoinView(assets)

                return this.addChild(view)
            })
    }


    presentFallout(progress) {
        const { coinsViews } = this
        const shiftStep = 0.05

        this.descriptors.forEach(({
            offsetX,
            lightHeight,
            fallHeight,
        }, i) => {
            const progressOffset = i * shiftStep
            const progressOffset2 = (coinsViews.length - i) * shiftStep
            const remainingProgress = (1 - progressOffset2) - progressOffset

            const subProgress = Math.max(0, Math.min(1, (progress - progressOffset) / remainingProgress) )
            const view  = coinsViews[i]

            view.presentFallout(
                subProgress,
                offsetX,
                lightHeight,
                fallHeight,
            )
        })
    }
}