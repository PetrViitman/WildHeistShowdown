import { Container, Sprite } from "pixi.js";
import { Base3DSymbolView } from "./Base3DSymbolView";

export class SymbolHatView extends Base3DSymbolView {
    initFaces() {
        const {
			facesContainer,
			facesViews,
			distances,
			angles,
            assets,
		} = this


        // BOTTOM...
        let sprite = new Sprite(assets.symbol_hat_bottom)
		sprite.anchor.set(0.5)
		this.bottomView = facesContainer.addChild(sprite)
        // ...BOTTOM

        // BASE...
        sprite = new Sprite(assets.symbol_hat_base)
		sprite.anchor.set(0.5)
        facesContainer.addChild(sprite)
        // ...BASE

        // RIBBON...
        sprite = new Sprite(assets.symbol_hat_ribbon)
		sprite.anchor.set(0.5, 0.95)
        sprite.y = 45
        this.ribbonView = facesContainer.addChild(sprite)
        // ...RIBBON


        // SIDES...
        sprite = new Sprite(assets.symbol_hat_side)
		sprite.anchor.set(0.5, 0)
		sprite.position.set(-98, -70)
		this.sideLeftView = facesContainer.addChild(sprite)

        sprite = new Sprite(assets.symbol_hat_side)
		sprite.anchor.set(0.5, 0)
		sprite.position.set(101, -70)
		this.sideRightView = facesContainer.addChild(sprite)
        // ...SIDES

        // TOP...
        sprite = new Sprite(assets.symbol_hat_top)
		sprite.anchor.set(0.5)
        sprite.x = -2
        sprite.y = -100
        this.topView = facesContainer.addChild(sprite)
        // ...TOP

        // STAR...
        sprite = new Sprite(assets.symbol_hat_star)
		sprite.anchor.set(0.5)
        sprite.y = 0
        this.starView = facesContainer.addChild(sprite)
        // ...STAR
    }

    setFlip(flipProgress) {
        const {
            facesContainer,
            bottomView,
            starView,
            topView,
            sideLeftView,
            sideRightView,
            ribbonView
        } = this

		super.setFlip(flipProgress)

        starView.skew.x = -facesContainer.skew.x
        topView.skew.x = this.starView.skew.x
        // starView.rotation = -this.facesContainer.rotation


        const scaleProgress = Math.min(0.5, Math.max(0, Math.abs(flipProgress) * 7))
        bottomView.scale.x = 0.8 + 0.2 * scaleProgress
        bottomView.scale.y = 0.6 + 0.4 * scaleProgress
        bottomView.y = 30 * (1 - scaleProgress)


        topView.scale.y = 0.5 + 0.5 * scaleProgress
        topView.y = -90 + 25 * scaleProgress
        
        sideLeftView.scale.y = 0.6 + 1 * scaleProgress
        sideRightView.scale.y = 0.6 + 1 * scaleProgress
        
        starView.scale.set(1.25 - 0.25 * scaleProgress)
        starView.y = -20 + 30 * scaleProgress

        ribbonView.scale.y = 0.8 + 0.2 * scaleProgress
        // ribbonView.y = 15 * (1 - scaleProgress)


        //this.facesSubContainer.width = 181
	}

    initFlames() {
		super.initFlames(this.assets.symbol_hat_glow)
	}

    initBlurredBody() {
        const {
            assets,
		} = this

		this.blurredBodyView = this.addChild(new Sprite(assets.symbol_hat_motion_blur))
        this.blurredBodyView.scale.set(2)
        this.blurredBodyView.anchor.set(0.5, 0.6)
	}
}