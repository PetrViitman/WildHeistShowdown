import { Sprite } from "pixi.js";
import { Base3DSymbolView } from "./Base3DSymbolView";

export class LowValueSymbolView extends Base3DSymbolView {

    initFaces(symbolName = 'clubs') {
        const {
			facesContainer,
			facesViews,
			distances,
			angles,
            assets,
		} = this

        let sprite = new Sprite(assets['symbol_' + symbolName + '_stretch'])
		sprite.anchor.set(0.5)
		this.stretchView = facesContainer.addChild(sprite)

        sprite = new Sprite(assets['symbol_' + symbolName + '_rib'])
		sprite.anchor.set(0.5)
		this.ribView = facesContainer.addChild(sprite)

		sprite = new Sprite(assets['symbol_' + symbolName + '_face'])
		sprite.anchor.set(0.5)
		angles[0] = - Math.PI
		distances[0] = 11
		facesViews[0] = facesContainer.addChild(sprite)

		angles[1] = 0
		distances[1] = 11
		facesViews[1] = sprite
    }

	initFlames(symbolName = 'clubs') {
		super.initFlames(this.assets['symbol_' + symbolName + '_glow'])
	}

    setFlip(flipProgress) {
        const {facesViews, stretchView} = this

		super.setFlip(flipProgress)

        if (flipProgress > 0.25 || flipProgress < 0.75) {
            stretchView.x = -facesViews[0].x
        } else {
            stretchView.x = facesViews[0].x
        }
        facesViews[0].visible = true

        stretchView.scale.x = facesViews[0].scale.x
	}
}