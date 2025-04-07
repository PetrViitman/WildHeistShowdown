import { Container, Sprite } from "pixi.js";

export class CapView extends Container {
    constructor(assets) {
        super()
        this.initBase(assets)
        this.initButtons(assets)
        this.initLock(assets)
    }

    initBase(assets) {
        const sprite = new Sprite(assets.cap_base)
        sprite.anchor.set(0.5)
        sprite.scale.x = 2.3
        sprite.scale.y = 2
        this.baseView = this.addChild(sprite)
    }

    initButtons(assets) {
        this.buttonsViews = [0, 0].map(_ => {
            const sprite = new Sprite(assets.cap_button)
            sprite.anchor.set(0.5)
            sprite.y = 42
            return this.addChild(sprite)
        })
    }

    initLock(assets) {
        const sprite = new Sprite(assets.cap_lock)
        sprite.anchor.set(0.5)
        sprite.y = 42
        this.lockView = this.addChild(sprite)
    }

    setFlip(flipProgress) {
        const angle = Math.PI * 2 * flipProgress
        const cos = Math.cos(angle)
        const sin = Math.sin(angle)

        this.lockView.x = 120 * cos
        this.lockView.scale.x = sin
        this.lockView.visible = flipProgress < 0.5


        let buttonProgress = (flipProgress + 0.725 + 0.15) % 1
        let buttonAngle = buttonProgress * Math.PI * 2
        let buttonCos = Math.cos(buttonAngle)
        let buttonSin = Math.sin(buttonAngle)

        this.buttonsViews[0].x = 120 * buttonCos
        this.buttonsViews[0].visible = buttonProgress < 0.5
        this.buttonsViews[0].scale.x = buttonSin

        buttonProgress = (flipProgress + 0.15) % 1
        buttonAngle = buttonProgress * Math.PI * 2
        buttonCos = Math.cos(buttonAngle)
        buttonSin = Math.sin(buttonAngle)

        this.buttonsViews[1].x = 120 * buttonCos
        this.buttonsViews[1].visible = buttonProgress < 0.5
        this.buttonsViews[1].scale.x = buttonSin

        this.scale.x = 1 + 0.25 * Math.abs(Math.cos(Math.PI * 2 * flipProgress))
    }
}