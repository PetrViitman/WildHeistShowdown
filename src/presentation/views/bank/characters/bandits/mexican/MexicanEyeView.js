import { Container, Sprite } from "pixi.js";
import { EyeView } from "../../base/head/EyeView";

export class MexicanEyeView extends EyeView {


    initBase(assets) {
        let sprite = new Sprite(assets.head_eye_bg)
        sprite.anchor.set(0.5)
        sprite.y = -8
        this.addChild(sprite)


        this.ballContainer = this.addChild(new Container)
        sprite = new Sprite(assets.mexican_eye_cover)
        sprite.scale.set(-1, 1)
        sprite.y = 0
        sprite.anchor.set(0.5)
        this.ballContainer.addChild(sprite)


        sprite = new Sprite(assets.eyebrow)
        sprite.anchor.set(0.5)
        sprite.y = -40
        sprite.tint = 0xFFFF00
        this.eyebrowView = this.addChild(sprite)
    }

    initPupil(assets) {
    }

    setOpen(progress) {
    }

    setColor(color) {
    }
}