import { Graphics } from "pixi.js";
import { brightnessToHexColor } from "../GraphicalPrimitives";
import { BoxView } from "./BoxView";

export class HalfBoxView extends BoxView {
    constructor(assets, vfxLevel) {
        super(assets, vfxLevel)
        this.sortableChildren = false
    }


    initFaces(assets) {
        for(let i = 0; i < 2; i++) {
            const view = new Graphics()
                .beginFill(0xFFFFFF)
                .drawRect(-100, -100, 200, 200)
                .endFill()
    
            this.distances[i] = 100
            this.facesViews[i] = this.addChild(view)
        }
    }

    setFlip(flipProgress) {
        const shift = 0.5 / this.facesViews.length

        this.facesViews.forEach((view, i) => {
            let faceProgress = (shift * i + flipProgress) % 1
            const isMirrored = faceProgress < 0.25 || faceProgress > 0.75

            if (isMirrored) faceProgress += 0.5

            view.x = this.distances[i] * Math.sin( faceProgress * Math.PI * 2)
            view.scale.x = Math.abs(Math.cos(faceProgress * Math.PI * 2))
            const tint = brightnessToHexColor(1 - Math.abs(Math.sin(faceProgress * Math.PI * 2)) * 0.5)
            
            view.tint = tint
        })
    }
}