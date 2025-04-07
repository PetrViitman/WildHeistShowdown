import { Container, Sprite } from "pixi.js";

export class BarrelView extends Container {

    constructor(assets) {
        super()

        this.initBase(assets)
        this.initGaps(assets)
    }

    initBase(assets) {
        const sprite = new Sprite(assets.barrel_base)
        sprite.anchor.set(0.5)

        this.baseView = this.addChild(sprite)
    }

    initGaps(assets) {
        this.gapsViews = new Array(5).fill(0).map(_ => {
            const sprite = new Sprite(assets.barrel_gap)
            sprite.anchor.set(0.5)


            return this.addChild(sprite)
        })
    }

    setFlip(flipProgress) {
        const progress = (flipProgress * 2) % 1

        this.gapsViews.forEach((view, i) => {
            const shiftedProgress = (progress +  i * 0.2) % 1

            view.x =  -110 * Math.sin(Math.PI * (shiftedProgress - 0.5 ))
            view.scale.x = Math.sin(Math.PI * shiftedProgress)
            view.alpha = Math.min(1, (1 - Math.min(1, Math.abs(view.x) / 100)) * 2 )
        })
    }
}