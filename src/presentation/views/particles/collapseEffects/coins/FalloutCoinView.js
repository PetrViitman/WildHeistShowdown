import { CoinView } from "./CoinView";

export class FalloutCoinView extends CoinView {
    spinDirection = 1
    constructor(assets) {
        super(assets)
    }

    presentFallout(
        progress,
        offsetX = 300,
        liftHeight = 200,
        fallHeight = 800,
    ) {

        const distortionProgress = Math.min(1, progress * 1.5)
        const liftProgress = Math.sin(Math.PI * Math.min(1, distortionProgress * 3) )


        const progressOffset = 0.25;
        const remainingProgress = distortionProgress - progressOffset
        const finalProgress = progressOffset + remainingProgress * distortionProgress
        const bounceMultiplier = finalProgress > 0.333 ? 0.45 : 1
        const regress = 1 - (remainingProgress / 0.75)

        const subProgress = Math.abs(Math.sin(Math.PI * 3 * finalProgress)) * regress


        this.x = offsetX * Math.min(1, distortionProgress * 3) + (offsetX * 0.66) * Math.max(0, (distortionProgress - 0.5) / 0.5 )
        this.y = fallHeight * (1 - subProgress * bounceMultiplier) - liftHeight * liftProgress 

        this.alpha = Math.min(1, Math.sin(Math.PI * progress) * 5)


        this.setFlip((distortionProgress * 3.25) % 1)
        this.setSpin((distortionProgress * 2.25) % 1)

        // this.bodyView.scale.x = 1 * Math.abs(Math.sin(Math.PI * 8 * progress))
        // this.glowView.alpha = 0.5 + 0.25 * Math.abs(Math.sin(Math.PI * 5 * progress))
    }
}