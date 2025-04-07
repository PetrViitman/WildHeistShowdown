import { Container, Sprite } from "pixi.js";
import { HostlerView } from "../../HostlerView";

export class BaseBeltView extends Container {
    constructor(assets) {
        super()

        this.initBase(assets)
        this.initLock(assets)
    }

    initBase(assets) {
        const sprite = this.addChild(new Sprite(assets.belt))
        sprite.anchor.set(0.5, 0.35)

        this.baseView = sprite
    }

    initLock(assets) {
        const sprite = this.addChild(new Sprite(assets.belt_lock))
        sprite.anchor.set(0.5)
        this.lockView = sprite
    }
    
    setFlip(flipProgress) {
        const angle = Math.PI * 2 * flipProgress
        const sin = Math.sin(angle)
        const cos = Math.cos(angle)

        this.lockView.x = 128 * cos
        this.lockView.y = 20 * Math.abs(sin) - 5
        this.lockView.scale.x = sin

        this.lockView.visible = flipProgress < 0.5
    }
}