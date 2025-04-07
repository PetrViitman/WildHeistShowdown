import { Sprite } from "pixi.js"
import { LowValueSymbolView } from "./LowValueSymbolView"

export class SymbolDiamondsView extends LowValueSymbolView {
    initFaces() {
        super.initFaces('diamonds')
    }

	initFlames() {
		super.initFlames('diamonds')
	}

    initBlurredBody() {
        const {
            assets,
		} = this

		this.blurredBodyView = this.addChild(new Sprite(assets.symbol_diamonds_motion_blur))
        this.blurredBodyView.scale.set(2)
        this.blurredBodyView.anchor.set(0.5, 0.6)
	}
}