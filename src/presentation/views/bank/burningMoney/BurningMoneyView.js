import { Container, Sprite } from "pixi.js";
import { brightnessToHexColor, colorToColor } from "../../GraphicalPrimitives";

export class BurningMoneyView extends Container {
    lightView
    bodyView

    sin
    cos

    constructor(assets) {
        super()

        this.initLight(assets)
        this.initBody(assets)
    }

    initLight(assets) {
        const sprite = new Sprite(assets.sparkle_glow)
        sprite.anchor.set(0.5)
        sprite.tint = 0xFF2200
        this.lightView = this.addChild(sprite)
    }

    initBody(assets) {
        const sprite = new Sprite(assets.burning_money)
        sprite.anchor.set(0.5)
        this.bodyView = this.addChild(sprite)
    }

    setProgress(progress) {
        const subProgress = Math.sin(Math.PI * 2 * progress)
        this.bodyView.scale.y = subProgress

        this.bodyView.tint = brightnessToHexColor(Math.abs(subProgress))

        const scale = 3.5 + 1.5 * Math.abs(subProgress)

        this.lightView.scale.set(
            scale,
            Math.max(2, scale * Math.abs(subProgress))
        )

        this.lightView.tint = colorToColor(
            255,
            50,
            0,
            255,
            150,
            0,
            Math.abs(subProgress)
        )
    }
}