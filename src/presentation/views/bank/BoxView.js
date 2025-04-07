import { Container, Graphics } from "pixi.js";
import { brightnessToHexColor } from "../GraphicalPrimitives";

export class BoxView extends Container {
    facesViews = []
    distances = []
    
    constructor(assets, vfxLevel) {
        super()

        this.initFaces(assets, vfxLevel)
        this.sortableChildren = true
    }

    initFaces(assets, vfxLevel) {
        for(let i = 0; i < 4; i++) {
            const view = new Graphics()
                .beginFill(0xFFFFFF)
                .drawRect(-100, -100, 200, 200)
                .endFill()
    
            this.distances[i] = 100
            this.facesViews[i] = this.addChild(view)
        }
    }

    setFlip(flipProgress) {
        const shift = 1 / this.facesViews.length

        this.facesViews.forEach((view, i) => {
            const faceProgress = (shift * i + flipProgress) % 1

            view.x = this.distances[i] * Math.sin( faceProgress * Math.PI * 2)
            view.scale.x = Math.cos(faceProgress * Math.PI * 2)
            view.zIndex = 0

            view.zIndex = faceProgress < 0.25 || faceProgress > 0.75 ? -1 : 1

            view.tint = brightnessToHexColor(1 - Math.abs(Math.sin(faceProgress * Math.PI * 2)) * 0.5)
        })
    }
}