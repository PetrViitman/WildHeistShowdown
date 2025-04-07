import { Sprite } from "pixi.js";
import { ButtonView } from "./ButtonView";

export class ButtonInfoView extends ButtonView {
    initIcon(assets) {
        const sprite = new Sprite(assets.iconInfo)
        sprite.anchor.set(0.5)
        sprite.scale.set(1.25)
        this.iconView = sprite
        this.iconContainer.addChild(sprite)
    }
}