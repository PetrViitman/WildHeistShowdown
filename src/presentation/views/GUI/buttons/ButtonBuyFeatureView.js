import { Sprite } from "pixi.js";
import { ButtonView } from "./ButtonView";
import { Timeline } from "../../../timeline/Timeline";
import { colorToColor } from "../../GraphicalPrimitives";

export class ButtonBuyFeatureView extends ButtonView {
    initIcon(assets) {
        const sprite = new Sprite(assets.iconBuyFeature)
        sprite.anchor.set(0.5)
        sprite.scale.set(0.85)
        sprite.rotation = 0.25
        this.iconView = sprite
        this.iconContainer.addChild(sprite)

        new Timeline()
            .addAnimation({
                duration: 2000,
                onProgress: progress => {
                    const subProgress = Math.sin(Math.PI * 2 * progress)

                    sprite.tint = colorToColor(
                        255,
                        255,
                        255,
                        255,
                        255,
                        0,
                        Math.abs(subProgress)
                    )

                    sprite.rotation = 0.25 + 0.05 * subProgress
                }
            })
            .setLoopMode()
            .play()
    }

    setInteractive(isInteractive = true) {
        this.eventMode = 'static'// isInteractive ? 'static' : 'none'
        // this.cursor = isInteractive ? 'pointer' : 'default'
        this.iconContainer.alpha = isInteractive ? 1 : 0.25

        this.isResponsive = isInteractive
    }
}