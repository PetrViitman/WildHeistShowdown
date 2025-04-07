import { Sprite } from "pixi.js"
import { IndicatorView } from "./IndicatorView"
import { Timeline } from "../../../timeline/Timeline"
import { colorToColor } from "../../GraphicalPrimitives"

export class IndicatorBetView extends IndicatorView {
    interactionTimeline = new Timeline
    activeBonusDescriptor

    initIcon(assets) {
        const sprite = new Sprite(assets.iconBet)
        sprite.anchor.set(0.5)
        sprite.scale.set(0.8)

        this.iconView = this.iconContainer.addChild(sprite)

        this.timeline.setTimeScaleFactor({value: 1000})
    }

    presentClick() {
        this.interactionTimeline
            .deleteAllAnimations()
            .addAnimation({
                duration: 150,
                onProgress: progress => {
                    const subProgress = Math.sin(Math.PI * progress)
                    this.contentContainer.scale.set(1 - 0.35 * subProgress)
                }
            })
            .play()
    }

    presentBonus(bonusDescriptor) {
        if(bonusDescriptor?.type === 3) {
            this.textField.setText('FREE')
            this.setInteractive(false)
        } else if (this.activeBonusDescriptor?.type === 3){
            const currentValue = this.currentValue
            this.setValue(0)
            this.setValue(currentValue)
        }

        this.activeBonusDescriptor = bonusDescriptor
    }

    presentInvalidBetSettings(progress) {
        const subProgress = Math.sin(Math.PI * 4 * progress)
        this.textField.setFontColor(
            colorToColor(
                248,
                238,
                137,
                255,
                0,
                0,
                subProgress
            )
        )
    }
}