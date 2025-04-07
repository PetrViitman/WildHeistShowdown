import { Sprite } from "pixi.js";
import { ButtonView } from "./ButtonView";

export class ButtonBetMoreView extends ButtonView {
    initIcon(assets) {
        const sprite = new Sprite(assets.iconBetMore)
        sprite.anchor.set(0.5)
        sprite.scale.set(0.75)
        this.iconView = sprite
        this.iconContainer.addChild(sprite)
    }
}