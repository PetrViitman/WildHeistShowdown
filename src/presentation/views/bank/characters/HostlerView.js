import { Container, Sprite } from "pixi.js";

export class HostlerView extends Container {
    constructor(assets) {
        super()

        this.initStretch(assets)
        this.initRib(assets)
        this.initFace(assets)
    }

    initStretch(assets) {
        const sprite = new Sprite(assets.hostler_stretch)
        sprite.anchor.set(0.65, 1)
        this.stretchView = this.addChild(sprite)
    }

    initRib(assets) {
        const sprite = new Sprite(assets.hostler_rib)
        sprite.anchor.set(0.5, 1)
        sprite.scale.x = 0.5
        this.ribView = this.addChild(sprite)
    }

    initFace(assets) {
        const sprite = new Sprite(assets.hostler_face)
        sprite.anchor.set(0.65, 1)
        this.faceView = this.addChild(sprite)
    }

    setFlip(flipProgress) {
        const angle = flipProgress * Math.PI * 2
        const sin = Math.sin(angle)
        const cos = Math.cos(angle)
        const {
            stretchView,
            ribView,
            faceView
        } = this


        if(flipProgress < 0.5) {
            faceView.x = 10 * cos
        } else {
            faceView.x = -10 * cos
        }
        faceView.scale.x = sin

        ribView.x = 20 * sin
        ribView.scale.x = cos * 0.65

        stretchView.x = -faceView.x
        stretchView.scale.x = faceView.scale.x
    }
}