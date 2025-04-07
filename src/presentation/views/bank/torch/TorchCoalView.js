import {Sprite} from 'pixi.js'
import {SparkleView} from './SparkleView'

export class TorchCoalView extends SparkleView {

    initBody(assets) {
        const sprite = new Sprite(assets.coal)
        sprite.anchor.set(0.5)

        this.bodyView = this.addChild(sprite)
    }

    setProgress(progress) {
        this.lightView.scale.set(
            1.5 + 2 * Math.abs(Math.sin(Math.PI * 3 * progress)))

        this.bodyView.scale.set(
            0.7 + 0.05 * Math.abs(Math.sin(Math.PI * 6 * progress)))
    }
}
