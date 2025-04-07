import { Container, Sprite } from "pixi.js";

export class HintView extends Container {
    constructor(assets) {
        super()
        this.init(assets)
    }

    init(assets) {
        let sprite = new Sprite(assets.mouse)
        sprite.anchor.set(0.5)
        sprite.y = -50
        this.bodyView = this.addChild(sprite)

        sprite = new Sprite(assets.mouse_button_glow)
        sprite.anchor.set(0.5)
        sprite.position.set(-45, -72)
        this.glowView = this.addChild(sprite)
    }

    present(progress) {
        const subProgress = Math.min(1, Math.sin(Math.PI * progress) * 2)
        this.glowView.alpha = subProgress
    }
}