import { Container, Graphics, Sprite } from "pixi.js";
import { HalfBoxView } from "../../../HalfBoxView";


export class EarView extends Container {
    constructor(assets) {
        super()
        let view = new Sprite(assets.head_ear_stretch)
        view.anchor.set(0.5, 1)
        this.stretchView = view
        this.addChild(view)

        view = new Sprite(assets.head_ear_rib)
        view.anchor.set(0.5, 1)
        view.zIndex = -1
        this.ribView = this.addChild(view)

        view = new Sprite(assets.head_ear)
        view.anchor.set(0.5, 1)
        this.faceView = this.addChild(view)

        view = new Sprite(assets.head_ear_stretch)
        view.anchor.set(0.5, 1)
        this.faceCoverView = this.addChild(view)
    }

    setMirrored(isMirrored = true) {
        this.isMirrored = isMirrored
    }

    setFlip(flipProgress) {
        const angle = flipProgress * Math.PI * 2
        const sin = Math.sin(angle)
        const cos = Math.cos(angle)


        this.faceView.x = 5 * sin
        this.faceView.scale.x = cos

        this.stretchView.scale.x = this.faceView.scale.x
        this.stretchView.x = -this.faceView.x

        this.faceCoverView.x = this.faceView.x
        this.faceCoverView.scale.x = this.faceView.scale.x
        this.faceCoverView.visible = flipProgress < 0.25 || flipProgress > 0.75

        if (this.isMirrored) {
            this.faceView.scale.x *= -1
            this.stretchView.scale.x *= -1
            this.faceCoverView.scale.x *= -1
        }
    }
}