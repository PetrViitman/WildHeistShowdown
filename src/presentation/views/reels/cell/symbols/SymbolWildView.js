import { Container, Sprite } from "pixi.js";
import { Base3DSymbolView } from "./Base3DSymbolView";
import { brightnessToHexColor, colorToColor } from "../../../GraphicalPrimitives";

export class SymbolWildView extends Base3DSymbolView {
    initFaces() {
        const {
			facesContainer,
			facesViews,
			distances,
			angles,
            assets,
		} = this


        const container = facesContainer.addChild(new Container)
        container.rotation = -Math.PI / 2

        let sprite = new Sprite(assets.symbol_wild_rib)
		sprite.anchor.set(0.5)
		angles[0] = Math.PI / 2
		distances[0] = 88
		facesViews[0] = container.addChild(sprite)

		angles[1] = Math.PI / 2 * 3
		distances[1] = 88
		facesViews[1] = sprite


        sprite = new Sprite(assets.symbol_wild_face)
		sprite.anchor.set(0.5)
		angles[2] = 0
		distances[2] = 30
		facesViews[2] = container.addChild(sprite)

		angles[3] = Math.PI
		distances[3] = 30
		facesViews[3] = sprite


        this.facesSubContainer = container
    }

    setFlip(flipProgress) {
        const {facesViews, facesContainer} = this

		super.setFlip(flipProgress)
		facesViews.forEach(view => view.visible = true)
	}

    initFlames() {
		super.initFlames(this.assets.symbol_wild_glow)
		this.flamesContainer.scale.set(1.35)
	}

	initBlurredBody() {
        const {
            assets,
		} = this

		this.blurredBodyView = this.addChild(new Sprite(assets.symbol_wild_motion_blur))
        this.blurredBodyView.scale.set(2)
        this.blurredBodyView.anchor.set(0.5, 0.6)
	}

	update(progress) {
        super.update(progress)

        this.setFlameColor(colorToColor(
            255,
            255,
            255,
            175,
            255,
            0,
            Math.abs(Math.sin(Math.PI * (((progress ?? 0) + this.idleProgressOffset) % 1) * 4))
        ))
    }

	adjustBrightness() {
		const tint = brightnessToHexColor(
			Math.max(0.25, this.brightness))

		this.facesSubContainer.children.forEach(view => {
			view.tint = tint
		})

		this.flamesContainer.alpha = this.brightness * this.flameIntensity
		if(this.blurredBodyView)
		this.blurredBodyView.tint = tint

		this.onBrightnessUpdated(tint)
	}
}