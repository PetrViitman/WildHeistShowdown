import { Sprite } from "pixi.js";
import { HalfBoxView } from "./HalfBoxView";

export class WallRingView extends HalfBoxView {

    initFaces(assets) {
        this.cornersViews = []

        for(let i = 0; i < 2; i++ ) {
            let view = new Sprite(assets.wall_ring)
            view.anchor.set(0.5, 0)    
            this.distances[i] = 275
            this.facesViews[i] = this.addChild(view)
        }
    }
}