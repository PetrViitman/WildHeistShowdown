import { Container, Sprite } from "pixi.js";

export class HairView extends Container {
    constructor(assets) {
        super()

        this.initFaces(assets)
    }

    initFaces(assets) {
        let sprite = new Sprite(assets.hair_front)
        sprite.anchor.set(0.5, 0)
        sprite.tint = 0xd89900
        this.frontView = this.addChild(sprite)

        sprite = new Sprite(assets.hair_side)
        sprite.anchor.set(0.5, 0)
        sprite.tint = 0xd89900
        this.sideView = this.addChild(sprite)

        sprite = new Sprite(assets.hair_back)
        sprite.anchor.set(0.5, 0)
        sprite.tint = 0xd89900
        this.backView = this.addChild(sprite)
    }

    setFlip(flipProgress) {
        const angle = Math.PI * 2 * flipProgress
        const sin = Math.sin(angle)
        const cos = Math.cos(angle)

        const {
            backView,
            sideView,
            frontView
        } = this
        
        frontView.x = 75 * cos
        frontView.scale.x = sin
        
        sideView.x = sin * (flipProgress > 0.25 && flipProgress < 0.75 ? 56: -56)
        sideView.scale.x = cos

        backView.x = -75 * cos
        backView.scale.x = sin

        frontView.visible = flipProgress < 0.5
        backView.visible = !frontView.visible

    }

    setColor(color = 0xFFFFFF) {
        this.frontView.tint = color
        this.sideView.tint = color
        this.backView.tint = color
    }
}