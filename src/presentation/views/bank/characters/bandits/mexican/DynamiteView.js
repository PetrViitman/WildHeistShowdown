import { Container, Sprite } from "pixi.js";
import { SubstitutionEffectView } from "../../../../reels/cell/safe/SubstitutionEffectView";
import { Timeline } from "../../../../../timeline/Timeline";

export class DynamiteView extends Container {
    flashView
    timeline

    constructor(assets) {
        super()

        this.contentContainer = this.addChild(new Container)
        this.contentContainer.pivot.set(-30, 25)
        this.initBody(assets)
        this.initFlash(assets)
    }

    initBody(assets) {
        const sprite = new Sprite(assets.dynamite)
        sprite.anchor.set(0.5)
        this.contentContainer.addChild(sprite)
    }

    initFlash(assets) {

        const container = this.contentContainer.addChild(new Container)
        container.position.set(58, -77)

        const flashesViews = [0xFF3300, 0xFFFF00].map(color => {
            const flashView = new SubstitutionEffectView(assets)
            flashView.scale.set(0.3)
            flashView.setSourceBlur(1)
            flashView.setColor(color)
            return container.addChild(flashView)
        })
        flashesViews[1].scale.set(0.15)

        this.timeline = new Timeline()
            .addAnimation({
                duration: 1000,
                onProgress: progress => {
                    container.scale.set(1 + 0.5 * Math.sin(Math.PI * progress))
                    flashesViews.forEach(view => {
                        view.setProgress((progress * 3) % 1)
                    })
                }
            })
            .setLoopMode()
            .play()
    }

    setFlip() {
    
    }
}