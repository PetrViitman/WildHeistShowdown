import { Sprite } from "pixi.js";
import { LowValueSymbolView } from "./LowValueSymbolView";
import { colorToColor } from "../../../GraphicalPrimitives";

export class SymbolScatterView extends LowValueSymbolView {
    initFaces() {
        const {
			facesContainer,
			facesViews,
			distances,
			angles,
            assets,
		} = this
        super.initFaces('scatter')


        const edgesViews = []
        let sprite = new Sprite(assets.symbol_scatter_edge)
		sprite.anchor.set(0.5)
        sprite.y = -60
		angles[2] = Math.PI * 0.5
		distances[2] = 110
		facesViews[2] = facesContainer.addChild(sprite)
        edgesViews.push(sprite)


        sprite = new Sprite(assets.symbol_scatter_edge)
		sprite.anchor.set(0.5)
        sprite.y = 60
		angles[3] = Math.PI * 0.5
		distances[3] = 110
		facesViews[3] = facesContainer.addChild(sprite)
        edgesViews.push(sprite)

        sprite = new Sprite(assets.symbol_scatter_edge)
		sprite.anchor.set(0.5)
        sprite.y = 60
		angles[4] = Math.PI * 0.5
		distances[4] = -110
		facesViews[4] = facesContainer.addChild(sprite)
        edgesViews.push(sprite)

        sprite = new Sprite(assets.symbol_scatter_edge)
		sprite.anchor.set(0.5)
        sprite.y = -60
		angles[5] = Math.PI * 0.5
		distances[5] = -110
		facesViews[5] = facesContainer.addChild(sprite)
        edgesViews.push(sprite)


        sprite = new Sprite(assets.symbol_scatter_edge)
		sprite.anchor.set(0.5)
        sprite.y = -120
        facesContainer.addChild(sprite)
        edgesViews.push(sprite)

        sprite = new Sprite(assets.symbol_scatter_edge)
		sprite.anchor.set(0.5)
        sprite.y = 120
        facesContainer.addChild(sprite)
        edgesViews.push(sprite)
        
        this.edgesViews = edgesViews
    }

	initFlames() {
		super.initFlames('scatter')

        this.flamesContainer.scale.set(1.5)
	}

    setFlip(flipProgress) {
        const {
			facesContainer,
			edgesViews
		} = this
        super.setFlip(flipProgress)

        edgesViews.forEach(view => {
            view.visible = true
            view.scale.set(1)
            view.rotation = -facesContainer.rotation
            view.skew.x = -facesContainer.skew.x
        })
	}

    presentTeasing(progress) {
        const subProgress =  Math.abs(Math.sin(Math.PI * 3 * progress))

        const distortion = 1 + 0.5 * subProgress * (1 - progress)
		this.contentContainer.scale.set(distortion)

        this.flamesContainer.scale.set(1.5 / distortion)
	}

    presentSpecialWin(progress) {
        this.presentTeasing(progress)
    }

    presentCoefficients(progress) {
		this.contentContainer.scale.set(1 + 0.35 * Math.abs(Math.sin(Math.PI * progress)))
	}

    presentTension(progress) {
		this.contentContainer.scale.set(1 + 0.35 * Math.sin(Math.PI * progress))
        this.contentContainer.rotation =Math.PI * 2 * progress
    }

    initBlurredBody() {
        const {
            assets,
		} = this

		this.blurredBodyView = this.addChild(new Sprite(assets.symbol_scatter_motion_blur))
        this.blurredBodyView.scale.set(2)
        this.blurredBodyView.anchor.set(0.5, 0.6)
	}

    update(progress) {
        super.update(progress)

        this.setFlameColor(colorToColor(
            255,
            255,
            0,
            255,
            0,
            255,
            Math.abs(Math.sin(Math.PI * (((progress ?? 0) + this.idleProgressOffset) % 1) * 4))
        ))
    }
}