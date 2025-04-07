import { Container, Sprite } from "pixi.js";

export class BasePelvisView extends Container {
    contentContainer
    joints

    constructor(assets) {
        super()

        this.initContentContainer()
        this.initBase(assets)
        this.initJoints()
    }

    initContentContainer() {
        this.contentContainer = this.addChild(new Container)
        this.contentContainer.sortableChildren = true
    }

    initJoints() {
        this.joints = [0, 0].map(_ => {
            return this
                .contentContainer
                .addChild(new Container)
        })
    }

    initBase(assets) {
        const sprite = new Sprite(assets.pelvis)
        sprite.zIndex = 0
        this.contentContainer.addChild(sprite)
        sprite.anchor.set(0.5)

        this.baseView = sprite

        sprite.tint = 0x888888
    }

    setFlip(flipProgress) {
        const {
            legLeftView,
            legRightView,
            hostlerView,
            joints
        } = this

        const angle = Math.PI * 2 * flipProgress
        const sin = Math.sin(angle)
        const cos = Math.cos(angle)

        this.baseView.skew.x = cos * -0.25
        this.baseView.scale.set(
            0.75 + 0.25 * ( 1- Math.abs(cos)),
            1
        )

        joints[0].y = 45
        joints[0].x = sin * 50

        joints[1].y = 45
        joints[1].x = sin * -50


        const rootContainer = this.parent.parent.parent.parent
        let jointPosition = joints[0].getGlobalPosition()
        let localPosition = rootContainer.toLocal(jointPosition)
        legLeftView.zIndex = cos * -40
        legLeftView.position.set(
            localPosition.x,
            localPosition.y
        )

        jointPosition = joints[1].getGlobalPosition()
        localPosition = rootContainer.toLocal(jointPosition)
        legRightView.zIndex = cos * 40
        legRightView.position.set(
            localPosition.x,
            localPosition.y
        )

        joints[0].y = 50
        joints[0].x = sin * -115

        jointPosition = joints[0].getGlobalPosition()
        localPosition = rootContainer.toLocal(jointPosition)
        hostlerView.rotation = this.parent.parent.rotation + Math.PI / 2
        hostlerView.zIndex = cos * 50
        hostlerView.position.set(
            localPosition.x,
            localPosition.y
        )

        hostlerView.setFlip((flipProgress + 0.25) % 1 )
    }

    attachLegs(legsViews){    
        this.legLeftView = legsViews[0]
        this.legRightView = legsViews[1]
    }

    attachHostler(hostlerView) {
        this.hostlerView = hostlerView
    }

    setColor(color) {
        this.baseView.tint = color
    }
}