import { Sprite } from "pixi.js";
import { LowValueSymbolView } from "./LowValueSymbolView";

export class SymbolSpadesView extends LowValueSymbolView {
    initFaces() {
        super.initFaces('spades')
    }

	initFlames() {
		super.initFlames('spades')
	}

    initBlurredBody() {
        const {
            assets,
		} = this

		this.blurredBodyView = this.addChild(new Sprite(assets.symbol_spades_motion_blur))
        this.blurredBodyView.scale.set(2)
        this.blurredBodyView.anchor.set(0.5, 0.6)
	}
}