import { Sprite } from "pixi.js";
import { ButtonView } from "./ButtonView";

export class ButtonTurboView extends ButtonView {
    initIcon(assets) {
        const sprite = new Sprite(assets.iconTurbo)
        sprite.anchor.set(0.5)
        sprite.scale.set(0.65)
        this.iconView = sprite
        this.iconContainer.addChild(sprite)
    }

    setActive(isActive) {
        this.iconView.tint = isActive ? 0x99FF00 : 0xFFFFFF
    }
}