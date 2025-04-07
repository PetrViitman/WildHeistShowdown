import { Sprite } from "pixi.js";
import { ButtonView } from "./ButtonView";

export class ButtonSkipView extends ButtonView {
    initIcon(assets) {
        const sprite = new Sprite(assets.iconSkip)
        sprite.anchor.set(0.5)
        sprite.scale.set(0.6)
        this.iconView = sprite
        this.iconContainer.addChild(sprite)
    }
}