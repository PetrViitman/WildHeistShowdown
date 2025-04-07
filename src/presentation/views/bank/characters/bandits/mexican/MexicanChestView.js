import { Sprite } from "pixi.js";
import { BaseChestView } from "../../base/spine/BaseChestView";
import { brightnessToHexColor } from "../../../../GraphicalPrimitives";

export class MexicanChestView extends BaseChestView {
    constructor(assets) {
        super(assets)
    }

    initFront(assets) {
        this.gapsViews = [0, 0, 0, 0, 0].map(y => {
            const sprite = new Sprite(assets.sweater_gap)
            this.contentContainer.addChild(sprite)
            sprite.anchor.set(0.5, 0.9)
            sprite.scale.y = -1.25
            sprite.y = 50

            return sprite
        })
    }


    setFlip(flipProgress) {
        super.setFlip(flipProgress)

        const progress = (flipProgress * 2) % 1

        this.gapsViews.forEach((view, i) => {
            const shiftedProgress = (progress +  i * 0.2) % 1
            const angle = Math.PI * (shiftedProgress - 0.5 )
            const sin = Math.sin(angle)

            view.x =  -125 * sin
            view.y =  -70 + 13 * Math.abs(sin)
            view.scale.x = Math.sin(Math.PI * shiftedProgress)
            view.skew.x = sin * 0.2
            view.alpha = Math.min(1, (1 - Math.min(1, Math.abs(view.x) / 125)) * 3 )
        })
    }

    setColor(color) {
        super.setColor(color)

        this.gapsViews.forEach(view => view.tint = color)
    }
}