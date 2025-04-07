import { Timeline } from "../../../timeline/Timeline";
import { IndicatorView } from "./IndicatorView";

export class IndicatorBalanceView extends IndicatorView {
    interactionTimeline = new Timeline

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
}