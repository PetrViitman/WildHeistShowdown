import { Sprite } from "pixi.js";
import { brightnessToHexColor } from "../../GraphicalPrimitives";
import { HalfBoxView } from "../HalfBoxView";

export class StairsBoxView extends HalfBoxView {

    constructor(assets) {
        super(assets)

        this.stretchView = new Sprite(assets.stairs_stretch)
        this.stretchView.anchor.set(0.5, 1)
        this.addChildAt(this.stretchView, 0)

        this.level = 1
    }

    
    setFlip(flipProgress) {
        const shift = 0.5 / this.facesViews.length

        this.facesViews.forEach((view, i) => {
            let faceProgress = (shift * i + flipProgress) % 1
            const isMirrored = faceProgress < 0.25 || faceProgress > 0.75

            if (isMirrored) faceProgress += 0.5

            view.x = this.distances[i] * Math.sin( faceProgress * Math.PI * 2)
            view.scale.x = -Math.abs(Math.cos(faceProgress * Math.PI * 2))
            if (isMirrored) view.scale.x *= -1


            view.alpha = Math.min(1, (1 - Math.abs(Math.sin(faceProgress * Math.PI * 2))) * 50)
            const tint = brightnessToHexColor(1 - Math.abs(Math.sin(faceProgress * Math.PI * 2)) * 0.5)
            //if(!i)
            //view.tint = tint
        })

        this.facesViews[1].scale.x *= -1

        this.stretchView.height = this.facesViews[1].height
       
        this.stretchView.width = Math.abs(this.facesViews[1].width) + Math.abs(this.distances[1] * 2 * Math.cos(flipProgress * Math.PI * 2))
    }
}