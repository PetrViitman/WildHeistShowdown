import { Sprite } from "pixi.js";
import { ButtonView } from "./ButtonView";
import { colorToColor } from "../../GraphicalPrimitives";

export class ButtonSpinView extends ButtonView {
    initIcon(assets) {
        const sprite = new Sprite(assets.iconSpin)
        sprite.anchor.set(0.5)
        sprite.scale.set(0.75)
        this.iconView = sprite
        this.iconContainer.addChild(sprite)
    }

    presentClick() {
        let isPressed = false
        this.timeline
        .wind(1)
            .deleteAllAnimations()
            .addAnimation({
                duration: 150,
                onProgress: progress => {
                    if (isPressed) return
                    super.presentPress(progress)
                },
                onFinish: () => {
                    isPressed = true
                }
            })
            .addAnimation({
                duration: 500,
                onProgress: progress => {
                    const subProgress = Math.sin(Math.PI * progress)
                    this.iconView.rotation = Math.PI * 2 * progress
                    this.iconView.tint = colorToColor(255, 255, 255, 255, 255, 0, subProgress)
                    this.iconContainer.scale.set(1 - 0.1 * Math.abs(subProgress))
                }
            })
            .setLoopMode()
            .play()
    }

    presentIdle() {
        this.timeline
            .wind(1)
            .deleteAllAnimations()
            .addAnimation({
                delay: 500,
                duration: 250,
                onProgress: progress => {
                    const subProgress = Math.sin(Math.PI * progress)
                    this.iconView.rotation = 0.5 * subProgress
                    this.iconView.tint = colorToColor(255, 255, 255, 255, 255, 0, subProgress)
                    this.iconContainer.scale.set(1 - 0.1 * Math.abs(subProgress))
                }
            })
            .setLoopMode()
            .play()
    }
}