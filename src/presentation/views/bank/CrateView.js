import { Sprite } from "pixi.js";
import { HalfBoxView } from "./HalfBoxView";

export class CrateView extends HalfBoxView {
    initFaces(assets) {
        for(let i = 0; i < 2; i++) {
            const view = new Sprite(assets.crate_face)
            view.anchor.set(0.5, 1)

            this.distances[i] = 128
            this.facesViews[i] = this.addChild(view)
        }
    }
}