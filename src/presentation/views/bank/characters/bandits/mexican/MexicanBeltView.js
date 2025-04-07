import { Sprite } from "pixi.js";
import { BaseBeltView } from "../../base/spine/BaseBeltView";

export class MexicanBeltView extends BaseBeltView {
    constructor(assets) {
        super(assets)
        this.baseView.tint = 0x55FFFF
    }

    initLock(assets) {
        const sprite = this.addChild(new Sprite(assets.mexican_belt_lock))
        sprite.anchor.set(0.5)
        sprite.scale.y = 0.75
        this.lockView = sprite
    }
}