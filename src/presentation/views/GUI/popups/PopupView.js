import { AdaptiveContainer } from "../../adaptiveDesign/AdaptiveContainer";
import { GUIView } from "../GUIView";

export class PopupView extends AdaptiveContainer {
    contentContainer

    constructor(assets) {
        super()

        this.initOverlay()
        this.initContentContainer()
    }

    initOverlay() {
        const container = this
            .addChild(new AdaptiveContainer())
            .setTargetArea({x: 0, y: 0, width: 1, height: 1})
            .setSourceArea({width: 100, height: 100})
            .stretchHorizontally()
            .stretchVertically()
            .highlight(0x000000, 0.8)

        container.eventMode = 'static'
        container.addEventListener('pointerdown', () => {
            GUIView.isOverlayInteraction = true

            if(!this.isResponsive) return
            this.onClick()
            this.presentClick()
        })
    }

    initContentContainer() {
        this.contentContainer = this
            .addChild(new AdaptiveContainer())
            .setTargetArea({x: 0, y: 0.25, width: 1, height: 0.5})
            .setSourceArea({width: 1000, height: 1000})
            .highlight(0x000000, 0.6)

    }
}