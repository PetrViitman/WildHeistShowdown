import { Container, Sprite } from "pixi.js";
import { Base3DSymbolView } from "./Base3DSymbolView";
import { brightnessToHexColor } from "../../../GraphicalPrimitives";

export class SymbolBottleView extends Base3DSymbolView {
    initFaces() {
        const {
			facesContainer,
			facesViews,
			distances,
			angles,
            assets,
		} = this


        // BACKGROUND...
        let sprite = new Sprite(assets.symbol_bottle_back)
		sprite.anchor.set(0.5)
		this.stretchView = facesContainer.addChild(sprite)
        // ...BACKGROUND

        // BEER...
        sprite = new Sprite(assets.symbol_bottle_beer)
		sprite.anchor.set(0.5)
        sprite.scale.x = 0.95
        sprite.scale.y = 1.15
        sprite.y = 75
		facesContainer.addChild(sprite)

        sprite = new Sprite(assets.symbol_bottle_beer)
		sprite.anchor.set(0.5)
        sprite.scale.x = 0.95
        sprite.y = 55
		this.beerView = facesContainer.addChild(sprite)
        // ...BEER

        // FOG...
        sprite = new Sprite(assets.symbol_bottle_fog)
		sprite.anchor.set(0.5)
        sprite.y = 27
        sprite.scale.x = 0.95
        facesContainer.addChild(sprite)
        // ...FOG

        const container = facesContainer.addChild(new Container)

        sprite = new Sprite(assets.symbol_bottle_face)
        sprite.y = 27
		sprite.anchor.set(0.5)
		angles[0] = Math.PI / 2
		distances[0] = 90
		facesViews[0] = container.addChild(sprite)

		angles[1] = Math.PI / 2 * 3
		distances[1] = 90
		facesViews[1] = sprite


        sprite = new Sprite(assets.symbol_bottle_face)
        sprite.y = 27
		sprite.anchor.set(0.5)
		angles[2] = 0
		distances[2] = 90
		facesViews[2] = container.addChild(sprite)
/*
        sprite = new Sprite(assets.symbol_bottle_face)
        sprite.y = 30
		sprite.anchor.set(0.5)
		angles[1] = Math.PI / 4
		distances[1] = -40
		facesViews[1] = facesContainer.addChild(sprite)

        */

        this.facesSubContainer = container
    }

    setFlip(flipProgress) {
        const {facesViews, facesContainer} = this

		super.setFlip(flipProgress)

        facesViews.forEach(view => view.visible = true)

        this.facesSubContainer.width = 181

        const beerProgress = (flipProgress * 3) % 1

        this.beerView.skew.y = Math.sin(Math.PI * 8 * beerProgress) * 0.1
		this.beerView.scale.y = 0.8 + Math.sin(Math.PI * 5 * beerProgress) * 0.2
	}

    onBrightnessUpdated(tint) {
        this.facesViews.forEach(view => view.tint = tint)
	}


    initFlames() {
		super.initFlames(this.assets.symbol_bottle_glow)
	}

    initBlurredBody() {
        const {
            assets,
		} = this

		this.blurredBodyView = this.addChild(new Sprite(assets.symbol_bottle_motion_blur))
        this.blurredBodyView.scale.set(2)
        this.blurredBodyView.anchor.set(0.5, 0.6)
	}
}