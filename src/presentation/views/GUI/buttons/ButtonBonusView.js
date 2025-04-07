import { Sprite } from "pixi.js";
import { ButtonView } from "./ButtonView";
import { Timeline } from "../../../timeline/Timeline";
import { colorToColor } from "../../GraphicalPrimitives";


export class ButtonBonusView extends ButtonView {
    initIcon(assets) {
        const sprite = new Sprite(assets.iconBonus)
        sprite.anchor.set(0.5)
        sprite.scale.set(1.2)
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

                    sprite.rotation = -0.25 - 0.075 * subProgress
                }
            })
            .setLoopMode()
            .play()
    }
}