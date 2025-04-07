import { Sprite } from "pixi.js"
import { AdaptiveContainer } from "../adaptiveDesign/AdaptiveContainer"

export class BottomGradientView extends AdaptiveContainer {
    bodyView


    constructor(assets) {
        super()

        const sprite = new Sprite(assets.gradient)
        sprite.tint = 0x000000
        sprite.x = -2
        sprite.y = 2
        this.addChild(sprite)
        sprite.alpha = 0.8

        this.bodyView = sprite

        this.setSourceArea({width: 244, height: 400})
            .stretchHorizontally()
            .stretchVertically()
            .setTargetArea({
                x: 0,
                y: 0.65,
                width: 1, 
                height: 0.35
            })
    }
}