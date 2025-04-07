import { Sprite } from "pixi.js";
import { ButtonView } from "./ButtonView";
import { TextField } from "../../text/TextField";
import { Timeline } from "../../../timeline/Timeline";


export class ButtonAutoplayView extends ButtonView {
    featureTimeline = new Timeline
    spinsCount

    constructor(assets, audio) {
        super(assets, audio)

        this.presentSpinsCount(0)
    }

    initIcon(assets) {
        let sprite = new Sprite(assets.iconAutoplay)
        sprite.anchor.set(0.5)
        sprite.scale.set(0.85)
        this.iconView = sprite
        this.iconView.visible = false
        this.iconContainer.addChild(sprite)

        sprite = new Sprite(assets.iconAutoplayActive)
        sprite.anchor.set(0.5)
        sprite.scale.set(0.85)
        sprite.tint = 0x99FF00
        this.activeIconView = sprite
        this.iconContainer.addChild(sprite)

        const maximalWidth = 75
        const maximalHeight = 75

        const textField = new TextField({maximalWidth, maximalHeight})
            .setFontName('default')
            .setFontSize(maximalHeight)
            .setFontColor(0x99FF00)
            .setAlignCenter()
            .setAlignMiddle()

        textField.pivot.set(maximalWidth / 2, maximalHeight / 2)
        textField.x = 5
        this.textField = this.iconContainer.addChild(textField)
    }


    presentSpinsCount(spinsCount = 0) {
        if (this.spinsCount === spinsCount) {
            return
        }

        const finalSpinsCount = Math.max(0, spinsCount - 1)

        this.spinsCount = spinsCount
        this.textField.visible = finalSpinsCount
        this.activeIconView.visible = finalSpinsCount
        this.iconView.visible = !finalSpinsCount

        this.featureTimeline
            .deleteAllAnimations()
            .addAnimation({
                duration: 200,
                onProgress: progress => {
                    this.activeIconView.rotation = Math.PI * 2 * progress
                    this.textField.alpha = 1 - Math.sin(Math.PI * progress)
                }
            })
            .addAnimation({
                duration: 100,
                onFinish: () => {
                    if(spinsCount === Infinity) {
                        this.textField.setText('∞')
                    } else {
                        this.textField.setText(finalSpinsCount + '')
                    }
                }
            })
            .play()
    }

}