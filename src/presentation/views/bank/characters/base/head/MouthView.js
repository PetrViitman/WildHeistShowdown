import { Container, Sprite } from "pixi.js";
import { brightnessToHexColor } from "../../../../GraphicalPrimitives";

export class MouthView extends Container {
    constructor(assets) {
        super(assets)


        let sprite = new Sprite(assets.mouth)
        sprite.anchor.set(0.5, 0)
        sprite.y = 25
        this.addChild(sprite)
        this.teethView = sprite

        /*
        sprite = new Sprite(assets.head_mouth_teeth_bottom)
        sprite.y = 72
        sprite.anchor.set(0.5, 1)
        this.teethBottomView = sprite
        this.addChild(sprite)

        sprite = new Sprite(assets.head_mouth_teeth_top)
        sprite.y = 0
        sprite.anchor.set(0.5, 0)
        this.teethTopView = sprite
        this.addChild(sprite)


        sprite = new Sprite(assets.head_mouth_mask)
        sprite.anchor.set(0.5)
        sprite.scale.set(0.6, 1)
        sprite.y = 35
        // this.mask = this.addChild(sprite)
        */
    }


    setSkew(skew = 0) {
        this.skew.x = skew
        this.teethView.skew.x = -skew
    }

    setScaleX(scale) {
        this.scale.set(scale * 0.8, 0.8)
        this.teethView.scale.x = scale
        // this.backgroundView.tint = brightnessToHexColor(0.5 + scale * 0.5)
        this.teethView.tint = brightnessToHexColor(0.5 + scale * 0.5)
        // this.mask.scale.x = 0.75 * scale
    }

    setOpen(progress) {
        // this.mask.scale.y = (0.05 + 0.95 * progress)
        this.teethView.scale.y = 0.75 + 0.25 * progress
        // this.teethBottomView.y = 62 + 10 * progress
        // this.teethBottomView.alpha = 0.25 + progress * 0.75
    }
}