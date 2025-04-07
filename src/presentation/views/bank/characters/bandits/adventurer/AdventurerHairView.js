import { Sprite } from "pixi.js";
import { HairView } from "../../base/head/HairView";

export class AdventurerHairView extends HairView {
    initFaces(assets) {
        const color = 0x550000
        let sprite = new Sprite(assets.adventurer_hair_front)
        sprite.anchor.set(0.5, 0)
        sprite.tint = color
        this.frontView = this.addChild(sprite)

        sprite = new Sprite(assets.adventurer_hair_side)
        sprite.anchor.set(0.5, 0)
        sprite.tint = color
        this.sideView = this.addChild(sprite)

        sprite = new Sprite(assets.hair_back)
        sprite.anchor.set(0.5, 0)
        sprite.tint = color
        this.backView = this.addChild(sprite)
    }
}