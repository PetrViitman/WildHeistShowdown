import { Container } from "pixi.js";
import { ButtonMinimalBetView } from "./ButtonMinimalBetView";
import { ButtonMaximalBetView } from "./ButtonMaximalBetView";
import { Timeline } from "../../../../timeline/Timeline";

export class MinMaxButtonsGroupView extends Container {
    buttonMinimalBetView
    buttonMaximalBetView
    timeline = new Timeline

    constructor({assets, dictionary, audio}) {
        super()
        this.initButtons({assets, dictionary, audio})
    }

    initButtons({assets, dictionary, audio}) {
        this.buttonMaximalBetView = this.addChild(new ButtonMaximalBetView({assets, dictionary, audio}))
        this.buttonMaximalBetView.scale.set(0.8)
        this.buttonMaximalBetView.onClick = () => this.onMaximalBetRequested?.()
        this.buttonMinimalBetView = this.addChild(new ButtonMinimalBetView({assets, dictionary, audio}))
        this.buttonMinimalBetView.scale.set(0.8)
        this.buttonMinimalBetView.y = 750
        this.buttonMinimalBetView.onClick = () => this.onMinimalBetRequested?.()
    }

    setInteractive({
        isMaximalBetButtonInteractive = true,
        isMinimalBetButtonInteractive = true,
    }) {
        this.buttonMinimalBetView.setInteractive(isMinimalBetButtonInteractive)
        this.buttonMaximalBetView.setInteractive(isMaximalBetButtonInteractive)
    }

    setVisible(isVisible) {
        this.timeline
            .deleteAllAnimations()
            .addAnimation({
                duration: 100,
                onProgress: progress => {
                    this.alpha = isVisible
                        ? Math.max(this.alpha, progress)
                        : Math.min(this.alpha, 1 - progress)
                    this.visible = this.alpha > 0
                }
            })
            .play()
    } 
}