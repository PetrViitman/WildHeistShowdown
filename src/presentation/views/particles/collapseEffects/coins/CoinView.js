import { Sprite } from "pixi.js";
import { Base3DSymbolView } from "../../../reels/cell/symbols/Base3DSymbolView";

export class CoinView extends Base3DSymbolView {
    initFaces(prefix = 'coin') {
        const {
			facesContainer,
			facesViews,
			distances,
			angles,
		} = this

		const glowView = new Sprite(this.assets[prefix + '_glow'] ?? this.assets.coin_glow)
		this.facesContainer.addChildAt(glowView, 0 )
		glowView.scale.set(2.5)
		glowView.anchor.set(0.5)
		glowView.alpha = 0.5
		this.glowView = glowView

        let sprite = new Sprite(this.assets[prefix + '_stretch'])
		sprite.anchor.set(0.5)
		this.stretchView = facesContainer.addChild(sprite)

        sprite = new Sprite(this.assets[prefix + '_rib'])
		sprite.anchor.set(0.5)
		this.ribView = facesContainer.addChild(sprite)

		sprite = new Sprite(this.assets[prefix + '_face'])
		sprite.anchor.set(0.5)
		angles[0] = - Math.PI
		distances[0] = 8
		facesViews[0] = facesContainer.addChild(sprite)

		angles[1] = 0
		distances[1] = 8
		facesViews[1] = sprite
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

		this.facesContainer.x = 0

		this.glowView.scale.x = 2.5 - 1.25 * Math.abs(Math.sin(Math.PI * 2 * flipProgress))
	}
}