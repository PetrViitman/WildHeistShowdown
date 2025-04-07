import { Container, Sprite } from "pixi.js";
import { Timeline } from "../../../../../timeline/Timeline";

export class HatView extends Container {
    baseView
    cylinderView
    lockView

    constructor(assets) {
        super()

        this.initBase(assets)
        this.initCylinder(assets)
        this.initElements(assets)
    }

    initBase(assets) {
        const sprite = new Sprite(assets.hat_base)
        sprite.anchor.set(0.5)
        this.baseView = this.addChild(sprite)
    }

    initCylinder(assets) {
        const sprite = new Sprite(assets.hat_cylinder)
        sprite.anchor.set(0.5, 1)
        sprite.y = 11
        this.cylinderView = this.addChild(sprite)
    }

    initElements(assets) {
        const sprite = new Sprite(assets.hat_lock)
        sprite.anchor.set(0.5)
        sprite.y = 4
        this.lockView = this.addChild(sprite)
    }

    setFlip(progress) {
        const angle = Math.PI * 2 * progress
        const sin = Math.sin(angle)
        const cos = Math.cos(angle)

        this.baseView.scale.x = 1 - 0.1 * Math.abs(cos)
        this.cylinderView.scale.x = 1 + 0.2 * Math.abs(cos)

        this.lockView.x =  100 * cos
        this.lockView.scale.x = sin
        this.lockView.visible = progress < 0.5

    }
}