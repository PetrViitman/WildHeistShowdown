import { Sprite } from "pixi.js";
import { StairsBoxView } from "./StairsBoxView";

export class StairsStageBottomView extends StairsBoxView {
    initFaces(assets) {
        let view = new Sprite(assets.stairs_side_bottom)
        view.anchor.set(0.5, 1)
        this.distances[0] = 166
        this.facesViews[0] = this.addChild(view)

        view = new Sprite(assets.stairs_face_bottom)
        view.anchor.set(0.5, 1)
        this.distances[1] = 126
        this.facesViews[1] = this.addChild(view)

        this.level = 1
    }
}