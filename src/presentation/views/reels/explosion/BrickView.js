import { Container, Sprite } from "pixi.js";
import { brightnessToHexColor } from "../../GraphicalPrimitives";

export class BrickView extends Container {
    constructor(assets) {
        super()

        this.initFaces(assets)
    }

    initFaces(assets) {
        const container = new Container
        let sprite = new Sprite(assets.brick_rib)
        sprite.anchor.set(0.5)
        sprite.scale.set(2)
        this.ribView = container.addChild(sprite)

        sprite = new Sprite(assets.brick_stretch)
        sprite.anchor.set(0.5)
        sprite.scale.set(2)
        this.stretchView = container.addChild(sprite)

        sprite = new Sprite(assets.brick_face)
        sprite.anchor.set(0.5)
        sprite.scale.set(2)
        this.faceView = container.addChild(sprite)

        this.contentContainer = this.addChild(container)
    }

    setFlip(progress) {
        const {
            ribView,
            stretchView,
            faceView
        } = this

        const finalProgress = progress > 0.5
            ? (progress + 0.5) % 1
            : progress

        const angle = Math.PI * 2 * finalProgress
        const sin = Math.sin(angle)
        const cos = Math.cos(angle)

        ribView.scale.x = cos * 2
        faceView.x = 29 * cos
        faceView.scale.x = sin * 2

        
        stretchView.scale.x = sin * 2
        stretchView.x = -faceView.x

        faceView.tint = brightnessToHexColor(0.25 + 0.75 * Math.abs(cos))
        ribView.tint = brightnessToHexColor(0.25 + 0.75 * Math.abs(sin))
        stretchView.tint = ribView.tint

        
    }

    setSpin(angle) {
        this.contentContainer.rotation = angle
    }
}