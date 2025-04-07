import { Sprite } from "pixi.js";
import { BaseBeltView } from "../../base/spine/BaseBeltView";

export class AdventurerBeltView extends BaseBeltView {
    constructor(assets) {
        super(assets)
        this.baseView.tint = 0xAAFFFF
    }

    initLock(assets) {
        const sprite = this.addChild(new Sprite(assets.adventurer_belt_lock))
        sprite.anchor.set(0.5)
        sprite.scale.y = 0.75
        this.lockView = sprite
    }
}