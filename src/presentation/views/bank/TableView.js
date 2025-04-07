import { Sprite } from "pixi.js";
import { HalfBoxView } from "./HalfBoxView";

export class TableView extends HalfBoxView {
    initFaces(assets) {
        for(let i = 0; i < 2; i++) {
            const view = new Sprite(assets['table_face_' + i])
            view.anchor.set(0.5, 1)
            this.facesViews[i] = this.addChild(view)
        }

        this.distances[0] = 134
        this.distances[1] = 190
    }
}