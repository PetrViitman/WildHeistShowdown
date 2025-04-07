import { Container, Sprite } from "pixi.js";

export class EyeView extends Container {
    
    ballContainer
    baseView
    pupilView
    eyebrowView

    constructor(assets) {
        super()

        this.initBase(assets)
        this.initPupil(assets)
    }

    initBase(assets) {
        let sprite = new Sprite(assets.head_eye_bg)
        sprite.anchor.set(0.5)
        sprite.y = -8
        this.addChild(sprite)


        this.ballContainer = this.addChild(new Container)
        sprite = new Sprite(assets.head_eye)
        sprite.anchor.set(0.5)
        this.ballContainer.addChild(sprite)


        sprite = new Sprite(assets.eyebrow)
        sprite.anchor.set(0.5)
        sprite.y = -40
        sprite.tint = 0xFFFF00
        this.eyebrowView = this.addChild(sprite)
    }

    initPupil(assets) {
        const container = new Container
        let sprite = new Sprite(assets.head_eye)
        sprite.anchor.set(0.5)
        sprite.scale.set(0.45)
        sprite.tint = 0x0088FF
        this.colorableView = sprite
        container.addChild(sprite)

        sprite = new Sprite(assets.head_eye)
        sprite.anchor.set(0.5)
        sprite.scale.set(0.25)
        sprite.tint = 0x000000
        container.addChild(sprite)

        this.pupilView = this.ballContainer.addChild(container)
    }

    setOpen(progress) {

        const finalProgress = 0.35 + progress * 0.5
        this.ballContainer.scale.y = finalProgress
        this.pupilView.scale.y = 1 / finalProgress
        this.pupilView.x = 10 * Math.sin(Math.PI * 2 * progress)

        //this.eyebrowView.pivot.y = 10 * progress
        // this.eyebrowView.rotation = 0.1 * progress
    }

    setColor(color) {
        this.colorableView.tint = color
    }

    setBrowColor(color) {
        this.eyebrowView.tint = color
    }

    setBrowTension(tension = 1) {
        this.eyebrowView.pivot.y = -20 * tension
        this.eyebrowView.rotation = 0.1 * tension
    }
}