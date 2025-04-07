import { Sprite } from "pixi.js"
import { ButtonView } from "./ButtonView"

export class ButtonHomeView extends ButtonView {
    initIcon(assets) {
        const sprite = new Sprite(assets.iconHome)
        sprite.anchor.set(0, 0.5)
        sprite.scale.set(0.8)
        this.iconView = sprite
        this.iconContainer.addChild(sprite)
    }

    initBody(assets) {
        const sprite = new Sprite(assets.iconHomeBackground)
        sprite.anchor.set(0.2, 0.5)
        sprite.tint = 0x132b45
        this.bodyContainer.addChild(sprite)
        this.bodyView = sprite
    }

}