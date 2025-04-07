import { MIPMAP_MODES, Sprite } from "pixi.js";
import { AdaptiveContainer } from "../adaptiveDesign/AdaptiveContainer";
import { GUIView } from "./GUIView";

export class OverlayView extends AdaptiveContainer {
    constructor(assets) {
        super()

        assets.rectangle.baseTexture.mipmap = MIPMAP_MODES.OFF
        
        const sprite = new Sprite(assets.rectangle)
        sprite.tint = 0x000000
        sprite.alpha = 0.9
        sprite.scale.set(1.25)
        sprite.anchor.set(0.5)
        sprite.position.set(45)
        this.addChild(sprite)

        this.eventMode = 'static'
        this.addEventListener('pointerdown', () => {
            this.onClick?.()
            GUIView.isOverlayInteraction = true
        })

        this.addEventListener('pointerup', () => { GUIView.isOverlayInteraction = false })
        this.addEventListener('pointerleave', () => { GUIView.isOverlayInteraction = false })
        this.addEventListener('pointercancel', () => { GUIView.isOverlayInteraction = false })
        this.addEventListener('pointerout', () => { GUIView.isOverlayInteraction = false })
        this.addEventListener('pointerupoutside', () => { GUIView.isOverlayInteraction = false })

        this.setSourceArea({width: 90, height: 90})
            .setTargetArea({x: 0, y: 0, width: 1, height: 1})
            .stretchHorizontally()
            .stretchVertically()
    }
}