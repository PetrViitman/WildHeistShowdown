import { Sprite } from "pixi.js";
import { IndicatorView } from "./IndicatorView";

export class IndicatorWinView extends IndicatorView {
    initIcon(assets) {
        const sprite = new Sprite(assets.iconWin)
        sprite.anchor.set(0.5)
        sprite.scale.set(0.8, -0.8)

        this.iconView = this.iconContainer.addChild(sprite)
    }
}