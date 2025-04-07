import { Container, Graphics, Sprite } from "pixi.js";
import { HalfBoxView } from "./HalfBoxView";

export class CrenelationView extends HalfBoxView {
    initFaces(assets) {
        let view = new Sprite(assets.crenelation_stretch)
        view.anchor.set(0.5, 1)
        view.zIndex = -1000
        this.stretchView = view
        this.addChild(view)

        view = new Sprite(assets.crenelation_side)
        view.anchor.set(0.5, 1)
        view.zIndex = -1000
        this.addChild(view)

        view = new Sprite(assets.crenelation_face)
        view.anchor.set(0.5, 1)
        this.distances[0] = 20
        this.facesViews[0] = this.addChild(view)

        view = new Container
        //view.anchor.set(0.5, 1)
        this.distances[1] = 88
        this.facesViews[1] = this.addChild(view)
    }

    setFlip(flipProgress) {
        super.setFlip(flipProgress)

        this.stretchView.scale.x = this.facesViews[0].scale.x
        this.stretchView.x = -this.facesViews[0].x
    }
}