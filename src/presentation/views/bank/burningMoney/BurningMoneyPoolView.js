import { Container } from "pixi.js";
import { BurningMoneyView } from "./BurningMoneyView";
import { Timeline } from "../../../timeline/Timeline";

export class BurningMoneyPoolView extends Container {
    moneyViews
    timeline = new Timeline
    
    constructor(assets) {
        super()

        this.initMoney(assets)
        this.setProgress(0)
    }


    initMoney(assets) {
        this.moneyViews = new Array(15).fill(0).map(_ => {
            const view = new BurningMoneyView(assets)
            return this.addChild(view)
        })
    }



    setProgress(progress) {
        this.visible = progress > 0 && progress < 1
        this.alpha = Math.min(1, Math.sin(Math.PI * progress) * 3)

        this.moneyViews.forEach((view, i) => {
            const shift = 0.065 * i

            view.setProgress((progress * 2 + shift * 2) % 1)

            const angle = shift * Math.PI * 2 + Math.PI
            const sin = Math.sin(angle)
            const cos = Math.cos(angle)
            const distance = 450 * progress

            view.scale.set(0.3 + 0.1 * progress)

            view.rotation = shift * Math.PI * 12 * progress

            view.position.set(
                distance * cos,
                distance * 0.5 * sin + 75 * Math.sin(Math.PI * 2 * (progress + (0.2 * i)) ) 
            )

        })
    }

    present() {
        this.timeline
            .deleteAllAnimations()
            .addAnimation({
                duration: 2000,
                onProgress: progress => this.setProgress(progress)
            })
            .play()
    }

    setTimeScale(scale) {
        this.timeline.setTimeScaleFactor({name: 'scale', value: scale})
	}
}