import { Container, Sprite } from "pixi.js";

export class SparkleView extends Container {
    glowView
    bodyView

    constructor(assets) {
        super()

        //this.glowView = this.addChild(new Sprite(assets.sparkle_glow))
        //this.glowView.anchor.set(0.5)

        this.bodyView = this.addChild(new Sprite(assets.sparkle_body))
        this.bodyView.tint = 0xfff000
        this.bodyView.anchor.set(0.5)
    }

    presentFallout(
        progress,
        offsetX = 300,
        liftHeight = 200,
        fallHeight = 800,
    ) {

        const liftProgress = Math.sin(Math.PI * Math.min(1, progress * 3) )

        const progressOffset = 0.25;
        const remainingProgress = progress - progressOffset
        const finalProgress = progressOffset + remainingProgress * progress
        const regress = 1 - (remainingProgress / 0.75)
        const subProgress = Math.abs(Math.sin(Math.PI * 3 * finalProgress)) * regress

        this.x = offsetX * Math.min(1, progress * 3) + (offsetX * 0.66) * Math.max(0, (progress - 0.5) / 0.5 )
        this.y = fallHeight * (1 - subProgress) - liftHeight * liftProgress

        // this.scale.set(Math.min(1, Math.sin(Math.PI * progress) * 5) + 0.2 * Math.sin(Math.PI * 20 * progress))
        this.scale.set(Math.min(1, Math.sin(Math.PI * progress) * 10))

        this.rotation = 20 * progress

        //this.bodyView.scale.x = 1 * Math.abs(Math.sin(Math.PI * 8 * progress))
        //this.glowView.alpha = 0.5 + 0.25 * Math.abs(Math.sin(Math.PI * 5 * progress))
    }

    setColor(color) {
        this.bodyView.tint = color
    }
}
