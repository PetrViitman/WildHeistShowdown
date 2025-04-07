import { Container, Sprite } from "pixi.js";

export class BaseHandView extends Container {
    facesViews = []

    contentContainer

    constructor(assets) {
        super()

        this.initFaces(assets)
    }

    initFaces(assets) {
        const {
            facesViews
        } = this

        const container = new Container
        container.sortableChildren = true
        this.contentContainer = this.addChild(container)

        let sprite = new Sprite(assets.hand_stretch)
        sprite.anchor.set(0.5)
        sprite.zIndex = 1
        this.stretchView = container.addChild(sprite)

        //sprite = new Sprite(assets.hand_finger)
        //sprite.anchor.set(0.5)
        //sprite.y = -20
        //this.fingerView = container.addChild(sprite)

        sprite = new Sprite(assets.hand_face)
        sprite.anchor.set(0.5)
        facesViews[0] = container.addChild(sprite)

        sprite = new Sprite(assets.hand_back)
        sprite.anchor.set(0.5)
        facesViews[2] = container.addChild(sprite)

        sprite = new Sprite(assets.hand_rib)
        sprite.anchor.set(0.5)
        facesViews[1] = container.addChild(sprite)
    }
 
    setFlip(flipProgress) {
        const angle = flipProgress * Math.PI * 2
        const sin = -Math.sin(angle)
        const cos = -Math.cos(angle)
        const {
            facesViews,
            contentContainer
        } = this

        contentContainer.x = sin * 15

        this.stretchView.scale.x = Math.max(0.75, Math.abs(sin))
        
        facesViews[0].x = cos * 22
        facesViews[0].scale.x = sin
        facesViews[0].zIndex = Math.trunc(sin * 22)
        facesViews[1].x = sin * 39
        facesViews[1].scale.x = -cos
        facesViews[1].zIndex = Math.trunc(-cos * 22)
        facesViews[2].x = -cos * 22
        facesViews[2].scale.x = -sin
        facesViews[2].zIndex = Math.trunc(-sin * 22)


        /*
        this.fingerView.x = this.facesViews[2].x
        this.fingerView.scale.x = Math.max(0.5, this.facesViews[2].scale.x)

        if (flipProgress > 0.25 && flipProgress < 0.75) this.fingerView.scale.x *= -1
        this.fingerView.zIndex = (flipProgress > 0.5) ? 100 : -100
        */

        if (this.revolverView) {
            this.revolverView.setFlip((1 - flipProgress + 0.75) % 1)
            this.revolverView.skew.x = -this.skew.x
        }

        if (this.dynamiteView) {
            this.dynamiteView.x = 15 * sin
            // this.dynamiteView.setFlip((1 - flipProgress + 0.75) % 1)
            this.dynamiteView.skew.x = -this.skew.x
        }
    }

    attachRevolver(revolverView) {
        this.revolverView = this.contentContainer.addChild(revolverView)
        this.revolverView.zIndex = -1000
    }

    attachDynamite(dynamiteView) {
        this.dynamiteView = this.contentContainer.addChild(dynamiteView)
        this.dynamiteView.zIndex = -1000
    }
}