import { Container, Sprite } from "pixi.js";

export class BaseBootView extends Container {
    constructor(assets) {
        super()

        const container =  this.addChild(new Container)
        this.contentContainer = container

        this.stretchView = container.addChild(new Sprite(assets.boot_stretch))
        this.stretchView.anchor.set(0.95, 1)

        this.backView = container.addChild(new Sprite(assets.boot_back))
        this.backView.anchor.set(0.5, 1)

        this.faceView = container.addChild(new Sprite(assets.boot_face))
        this.faceView.y = -21
        this.faceView.anchor.set(0.5, 1)

        this.edgeView = container.addChild(new Sprite(assets.boot_edge))
        this.edgeView.anchor.set(0.5, 1)

        this.sideView = container.addChild(new Sprite(assets.boot_side))
        this.sideView.anchor.set(0.95, 1)


        this.spurView = container.addChild(new Container)
        this.spurView.y = -25
        this.spurStarView = container.addChild(new Sprite(assets.spur_star))
        this.spurStarView.y = -25
        this.spurStarView.anchor.set(0.5)
        this.spurView.addChild(new Sprite(assets.spur_handle)).anchor.set(0, 0.35)

        container.sortableChildren = true
    }

    setFlip(flipProgress) {
        
        const angle = Math.PI * 2 * flipProgress
        const distance = flipProgress > 0.5 ? -25 : 25

        this.contentContainer.x = 30 * Math.sin(angle)

        this.sideView.x = distance * Math.cos(angle)
        this.sideView.scale.x = Math.sin(angle)
        this.stretchView.x = -this.sideView.x
        this.stretchView.scale.x = this.sideView.scale.x

        this.edgeView.x = 130 * Math.cos(angle + Math.PI / 2)
        this.edgeView.scale.x = Math.cos(angle) * 1.5


        this.backView.scale.x = this.edgeView.scale.x
        this.faceView.scale.x = this.edgeView.scale.x

        this.faceView.x = 57 * Math.cos(angle + Math.PI / 2)

        this.faceView.visible = flipProgress < 0.25 || flipProgress > 0.75
        this.edgeView.visible = this.faceView.visible
        this.backView.visible = !this.faceView.visible


        this.spurView.x = -8 * Math.cos(angle + Math.PI / 2)
        this.spurView.scale.x = -Math.cos(angle + Math.PI / 2)
        this.spurView.zIndex = flipProgress > 0.25 && flipProgress < 0.75 ? 2 : -2

        this.spurStarView.x = -30 * Math.cos(angle + Math.PI / 2)

        this.spurStarView.scale.x = Math.max(0.4, Math.abs(Math.cos(angle + Math.PI / 2)))
        // this.spurStarView.rotation = angle * 4
        this.spurStarView.zIndex = this.spurView.zIndex - 1
    }
}