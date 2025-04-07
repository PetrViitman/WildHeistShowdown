import { Sprite } from "pixi.js";
import { ButtonView } from "../../buttons/ButtonView";

export class ButtonEraseView extends ButtonView {
    initIcon(assets) {
        const sprite = new Sprite(assets.iconErase)
        sprite.anchor.set(0.6, 0.5)
        sprite.scale.set(0.65)
        this.iconView = sprite
        this.iconContainer.addChild(sprite)
    }
}