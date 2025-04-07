import { Container, Graphics, Sprite } from "pixi.js";
import { brightnessToHexColor } from "../GraphicalPrimitives";
import { HalfBoxView } from "./HalfBoxView";

export class WedgeView extends HalfBoxView {

    initFaces(assets) {

        const container = new Container
        let view = new Sprite(assets.wedge_face)
        view.anchor.set(0.5, 1)
        container.addChild(view)

        view = new Sprite(assets.wedge_light)
        view.anchor.set(0.5, 1)
        container.addChild(view)

        container.skewAngle = Math.atan2(400, -25) - Math.PI / 2

        this.distances[0] = 25
        this.facesViews[0] = this.addChild(container)
        container.setTint = (tint) => { container.children[0].tint = tint }

        view = new Sprite(assets.wedge_side)
        view.anchor.set(0.5, 1)

        this.distances[1] = 40
        this.facesViews[1] = this.addChild(view)
    }


    setFlip(flipProgress) {
        const shift = 0.5 / this.facesViews.length

        this.facesViews.forEach((view, i) => {
            let faceProgress = (shift * i + flipProgress) % 1
            const isMirrored = faceProgress < 0.25 || faceProgress > 0.75
            view.skew.x = 0
            view.height = 200

            view.scale.y = 1

            if (isMirrored) faceProgress += 0.5
            if(isMirrored && !i) {
                const angle = view.skewAngle * Math.sin(Math.PI * 2 * faceProgress)

                view.scale.y = 1 / Math.abs(Math.sin(-Math.PI / 2 + angle) )

                view.skew.x = angle

                
            }

            view.x = this.distances[i] * Math.sin( faceProgress * Math.PI * 2)
            view.scale.x = Math.cos(faceProgress * Math.PI * 2)

            if (isMirrored)
                view.scale.x *= -1

            const brightness = brightnessToHexColor(1 - Math.abs(Math.sin(faceProgress * Math.PI * 2)) * 0.5)

            view.tint = brightness
            view.setTint?.(brightness)
        })

        this.facesViews[0].children[1].tint = this.facesViews[1].tint
    }
}