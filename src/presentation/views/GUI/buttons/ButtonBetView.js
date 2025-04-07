import { Sprite } from "pixi.js";
import { ButtonView } from "./ButtonView";

export class ButtonBetView extends ButtonView {
    initIcon(assets) {
        const sprite = new Sprite(assets.iconBet)
        sprite.anchor.set(0.5)
        sprite.scale.set(0.5)
        this.iconView = sprite
        this.iconContainer.addChild(sprite)
    }
}