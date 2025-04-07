import {Container, Sprite} from 'pixi.js'

export class SparkleView extends Container {
    lightView

    bodyView

    constructor(assets) {
        super()
        this.initLight(assets)
        this.initBody(assets)
    }

    initLight(assets) {
        const sprite = new Sprite(assets.sparkle_light)
        sprite.anchor.set(0.5)

        this.lightView = this.addChild(sprite)
    }

    initBody(assets) {
        const sprite = new Sprite(assets.sparkle)
        sprite.anchor.set(0.5)

        this.bodyView = this.addChild(sprite)
    }

    setSpin(progress) {
        this.bodyView.scale.x = progress * 1.5
    }
}
