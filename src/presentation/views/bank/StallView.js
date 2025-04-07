import { Container, Sprite } from "pixi.js";

export class StallView extends Container {
    constructor(assets) {
        super()

        this.initPillars(assets)
        this.initCrossbar(assets)
    }

    initPillars(assets) {
        this.pillarsViews = [0, 0].map(_ => {
            const sprite = new Sprite(assets.stall_pillar)
            sprite.anchor.set(0.5, 1)
            
            
            return this.addChild(sprite)
        })
    }

    initCrossbar(assets) {
        let sprite = new Sprite(assets.stall_crossbar_back)
        sprite.anchor.set(0.5)
        sprite.y = -345
        this.crossbarBackView = this.addChild(sprite)

        sprite = new Sprite(assets.stall_crossbar)
        sprite.anchor.set(0.5)
        sprite.y = -345
        this.crossbarView = this.addChild(sprite)

        sprite = new Sprite(assets.stall_crossbar_face)
        sprite.anchor.set(0.5)
        sprite.y = -345
        this.crossbarFaceView = this.addChild(sprite)
    }

    setFlip(flipProgress) {
        const {
            pillarsViews,
            crossbarView,
            crossbarBackView,
            crossbarFaceView
        } = this
        const angle = Math.PI * 2 * flipProgress
        const sin = Math.sin(angle)
        const cos = Math.cos(angle)

        pillarsViews[0].x = flipProgress < 0.5 ? -170 * cos : 170 * cos
        pillarsViews[1].x = flipProgress < 0.5 ? 170 * cos : -170 * cos

        crossbarView.scale.x = cos
        crossbarBackView.scale.x = sin
        crossbarBackView.x = flipProgress > 0.5
            ? 276 * cos
            : -276 * cos

        crossbarFaceView.scale.x = sin
        crossbarFaceView.x = flipProgress > 0.5
            ? -276 * cos
            : 276 * cos

    }
}