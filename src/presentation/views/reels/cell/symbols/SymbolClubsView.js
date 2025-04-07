import { Sprite } from "pixi.js";
import { LowValueSymbolView } from "./LowValueSymbolView";

export class SymbolClubsView extends LowValueSymbolView {
    initFaces() {
        super.initFaces('clubs')
    }

	initFlames() {
		super.initFlames('clubs')
	}

    initBlurredBody() {
        const {
            assets,
		} = this

		this.blurredBodyView = this.addChild(new Sprite(assets.symbol_clubs_motion_blur))
        this.blurredBodyView.scale.set(2)
        this.blurredBodyView.anchor.set(0.5, 0.6)
	}
}