import { AdaptiveContainer } from "./adaptiveDesign/AdaptiveContainer";

export class InteractiveLayerView extends AdaptiveContainer {
    constructor() {
        super()

        this.setTargetArea({x: 0, y: 0, width: 1, height: 1})
            .setSourceArea({width: 100, height: 100})
            .stretchHorizontally()
            .stretchVertically()
            .highlight(0x000000, 0.001)

        this.addEventListener('pointerdown', () => {
            this.onClick?.()
            this.setInteractive(false)
        })
    }

    setInteractive(isInteractive = true) {
        this.eventMode = isInteractive ? 'static' : 'none'
        this.cursor = isInteractive ? 'pointer' : 'default'
    }

    onClick() {
        //
    }
}