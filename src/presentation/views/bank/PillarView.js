import { Sprite } from "pixi.js";
import { HalfBoxView } from "./HalfBoxView";

export class PillarView extends HalfBoxView {
    initFaces(assets, vfxLevel) {
        this.baseView = this.addChild(new Sprite(assets.pillar_top))
        this.baseView.anchor.set(0.5, 0)
        this.baseView.scale.y = 1.05
        this.baseView.y = -214

        if (vfxLevel >= 0.15) {
            this.reflectionView = this.addChild(new Sprite(assets.pillar_reflection))
            this.reflectionView.y = -214
            this.reflectionView.scale.y = 1.05
            this.reflectionView.anchor.set(0.5, 0)
        }

        for(let i = 0; i < 2; i++) {
            const view = new Sprite(assets.pillar_face)
            view.y = -10
            view.anchor.set(0.5, 1)

            this.distances[i] = 90
            this.facesViews[i] = this.addChild(view)
        }
    }

    setFlip(flipProgress) {
        super.setFlip(flipProgress)

        this.baseView.width = this.facesViews[0].width + this.facesViews[1].width
        if(this.reflectionView) {
            this.reflectionView.width = this.baseView.width
        }
    }

    setReflectionAlpha(alpha) {
        if(!this.reflectionView) return
        this.reflectionView.alpha = alpha
    }
}