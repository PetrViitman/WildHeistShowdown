import { Container, Sprite } from "pixi.js";
import { Base3DSymbolView } from "./Base3DSymbolView";

export class SymbolWatchesView extends Base3DSymbolView {

    initFaces() {
        const {
			facesContainer,
			facesViews,
			distances,
			angles,
            assets,
		} = this

        let sprite = new Sprite(assets.symbol_watches_stretch)
		sprite.anchor.set(0.5)
		this.stretchView = facesContainer.addChild(sprite)

        sprite = new Sprite(assets.symbol_watches_rib)
		sprite.anchor.set(0.5)
		this.ribView = facesContainer.addChild(sprite)

        

        sprite = new Sprite(assets.symbol_watches_back)
		sprite.anchor.set(0.5)
        facesViews[0] = facesContainer.addChild(sprite)
		angles[0] = - Math.PI
		distances[0] = 20
        


        const displayContainer = facesContainer.addChild(new Container)
		sprite = new Sprite(assets.symbol_watches_face)
		sprite.anchor.set(0.5)
        displayContainer.addChild(sprite)
        this.displayContainer = displayContainer


        sprite = new Sprite(assets.symbol_watches_arrow)
        sprite.anchor.set(0.12, 0.5)
        sprite.scale.set(0.75)
        this.arrowMinutesView = displayContainer.addChild(sprite)

        sprite = new Sprite(assets.symbol_watches_arrow)
        sprite.anchor.set(0.12, 0.5)
        this.arrowSecondsView = displayContainer.addChild(sprite)

        sprite = new Sprite(assets.symbol_watches_blick)
		sprite.position.set(5, -70)
        sprite.alpha = 0.43
        this.blickView = displayContainer.addChild(sprite)

		angles[1] = 0
		distances[1] = 20
		facesViews[1] = displayContainer


        sprite = new Sprite(assets.symbol_watches_gear_top)
		sprite.anchor.set(0.5)
        sprite.y = -117
        this.gearTopView = facesContainer.addChild(sprite)

        sprite = new Sprite(assets.symbol_watches_gear_bottom)
		sprite.anchor.set(0.5)
        sprite.y = 117
        this.gearBottomView = facesContainer.addChild(sprite)
    }

	initFlames() {
		super.initFlames(this.assets.symbol_watches_glow)
	}

    setFlip(flipProgress) {
        const {facesViews, stretchView} = this

		super.setFlip(flipProgress)


        if (this.flipProgress < 0.25 || this.flipProgress > 0.75) {
            stretchView.x = -facesViews[1].x
            stretchView.scale.x = facesViews[1].scale.x
        } else {
            stretchView.x = -facesViews[0].x
            stretchView.scale.x = facesViews[0].scale.x
        }
	}

    onBrightnessUpdated(tint) {
        this.displayContainer.children.forEach(view => view.tint = tint)
	}


    update(progress) {
		super.update(progress)

        const finalProgress = (progress + this.idleProgressOffset * this.idleFactor) % 1

		this.arrowMinutesView.rotation = Math.PI * 2 * finalProgress
		this.arrowSecondsView.rotation = Math.PI * 24 * finalProgress
        this.blickView.alpha = 0.4 + 0.2 * Math.abs(Math.sin(Math.PI * 4 * finalProgress))
        this.blickView.x = 5 * Math.sin(Math.PI * 6 * finalProgress)
        this.blickView.scale.y = 0.8 + 0.2 * Math.abs(Math.sin(Math.PI * 3 * finalProgress))
        this.gearTopView.skew.x = - this.facesContainer.skew.x
        this.gearBottomView.skew.x = this.gearTopView.skew.x 
	}

    initBlurredBody() {
        const {
            assets,
		} = this

		this.blurredBodyView = this.addChild(new Sprite(assets.symbol_watches_motion_blur))
        this.blurredBodyView.scale.set(2)
        this.blurredBodyView.anchor.set(0.5, 0.625)
	}
}