import { Sprite } from "pixi.js";
import { ButtonView } from "../buttons/ButtonView";

export class ButtonCloseView extends ButtonView {
    initIcon(assets) {
        const sprite = new Sprite(assets.iconClose)
        sprite.anchor.set(0.5)
        sprite.scale.set(1.5)
        this.iconView = sprite
        this.iconContainer.addChild(sprite)
    }
}