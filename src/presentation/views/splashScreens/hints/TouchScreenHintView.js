import { Sprite } from "pixi.js";
import { HintView } from "./HintView";

export class TouchScreenHintView extends HintView {
    init(assets) {
        let sprite = new Sprite(assets.pointer_trace)
        sprite.anchor.set(0.5)
        sprite.position.set(-40, -130)
        sprite.tint = 0xFF0000
        this.glowView = this.addChild(sprite)

        sprite = new Sprite(assets.pointer)
        sprite.anchor.set(0.5)
        this.baseView = this.addChild(sprite)
    }

    present(progress) {
        const subProgress = Math.sin(Math.PI * progress)
        this.glowView.scale.set(subProgress)

        this.baseView.scale.set(0.9 + 0.125 * (1 - subProgress))

    }
}