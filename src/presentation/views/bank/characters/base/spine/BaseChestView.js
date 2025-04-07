import { Container, Sprite } from "pixi.js";

export class BaseChestView extends Container {
    shoulderDistance = 140
    contentContainer
    joints

    constructor(assets) {
        super()

        this.initContentContainer()
        this.initBase(assets)
        this.initFront(assets)
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
        const sprite = new Sprite(assets.chest)
        sprite.zIndex = 0
        this.contentContainer.addChild(sprite)
        sprite.anchor.set(0.5)

        this.baseView = sprite
    }

    initFront(assets) {
        this.frontView = this
            .contentContainer
            .addChild(new Sprite(assets.uniform_front_top))

        this.frontView.anchor.set(0.5)
        this.frontView.y = 0

        this.buttonsViews = [-25, 25].map(y => {
            const sprite = new Sprite(assets.button)
            this.contentContainer.addChild(sprite)
            sprite.anchor.set(0.5)
            sprite.y = y

            return sprite
        })

        this.badgeView = this
            .contentContainer
            .addChild(new Sprite(assets.guard_badge))

        this.badgeView.anchor.set(0.5)
        this.badgeView.y = -25
    }

    setFlip(flipProgress) {
        const {
            contentContainer,
            armLeftView,
            armRightView,
            buttonsViews,
            strapLeftView,
            strapRightView,
            joints
        } = this

        const angle = Math.PI * 2 * flipProgress
        const cos = Math.cos(angle)
        const sin = Math.sin(angle)

        contentContainer.skew.x = cos * 0.15
        contentContainer.scale.set(
            1 * (0.75 + 0.25 * (1 - Math.abs(cos))),
            1
        )
        
        joints[0].y = -40
        joints[0].x = sin * this.shoulderDistance

        joints[1].y = -40
        joints[1].x = sin * -this.shoulderDistance

        const rootContainer = this.parent.parent.parent.parent

        let jointPosition = joints[0].getGlobalPosition()
        let localPosition = rootContainer.toLocal(jointPosition)
        armLeftView.zIndex = cos * -300
        armLeftView.position.set(
            localPosition.x,
            localPosition.y
        )

        jointPosition = joints[1].getGlobalPosition()
        localPosition = rootContainer.toLocal(jointPosition)
        armRightView.zIndex = cos * 300
        armRightView.position.set(
            localPosition.x,
            localPosition.y
        )

        if(strapLeftView) {
            joints[0].y = -75
            joints[0].x = sin * 120

            joints[1].y = -75
            joints[1].x = sin * -120

            jointPosition = joints[0].getGlobalPosition()
            localPosition = rootContainer.toLocal(jointPosition)

            const strapScale = 1 + Math.abs(sin) * 0.75

            strapLeftView.scale.x = strapScale
            strapLeftView.zIndex = cos * -45
            strapLeftView.rotation = this.parent.parent.rotation + Math.PI / 2  + sin * 0.25
            strapLeftView.position.set(
                localPosition.x,
                localPosition.y
            )

            jointPosition = joints[1].getGlobalPosition()
            localPosition = rootContainer.toLocal(jointPosition)

            strapRightView.scale.x = strapScale
            strapRightView.zIndex = cos * 45
            strapRightView.rotation = this.parent.parent.rotation + Math.PI / 2 - sin * 0.25
            strapRightView.position.set(
                localPosition.x,
                localPosition.y
            )
        }


        if (this.frontView) {
            const frontProgress = (flipProgress + 0.955) % 1
            const frontAngle = Math.PI * 2 * frontProgress
            const frontSin = Math.sin(frontAngle)
            const frontCos = Math.cos(frontAngle)

            this.frontView.x = 125 * frontCos
            this.frontView.scale.x = frontSin
            this.frontView.scale.y = 0.75 + 0.25 * Math.abs(frontSin)
            this.frontView.visible = frontProgress < 0.5
        }

        if (buttonsViews) {
            const buttonProgress = (flipProgress + 0.98) % 1
            const buttonAngle = Math.PI * 2 * buttonProgress
            const buttonSin = Math.sin(buttonAngle)
            const buttonCos = Math.cos(buttonAngle)


            const scaleY = 1 / this.parent.scale.y
            buttonsViews[0].x = 125 * buttonCos
            buttonsViews[0].scale.y = scaleY
            buttonsViews[0].scale.x = buttonSin / contentContainer.scale.x
            buttonsViews[0].visible = buttonProgress < 0.5

            buttonsViews[1].x = 115 * buttonCos
            buttonsViews[1].scale.y = scaleY
            buttonsViews[1].scale.x = buttonSin / contentContainer.scale.x
            buttonsViews[1].visible = buttonProgress < 0.5
        
            if (this.badgeView) {
                const badgeProgress = (flipProgress + 0.075) % 1
                const badgeAngle = Math.PI * 2 * badgeProgress
                const badgeSin = Math.sin(badgeAngle)
                const badgeCos = Math.cos(badgeAngle)
    
                this.badgeView.x = 125 * badgeCos
                this.badgeView.scale.x = badgeSin / contentContainer.scale.x
                this.badgeView.scale.y = scaleY
                this.badgeView.skew.x = - contentContainer.skew.x
                this.badgeView.visible = badgeProgress < 0.5
            }
        }
    }

    attachArms(armsViews){    
        this.armLeftView = armsViews[0]
        this.armRightView = armsViews[1]
    }

    attachStraps(strapsViews) {
        this.strapLeftView = strapsViews[0]
        this.strapRightView = strapsViews[1]
    }

    setColor(color) {
        this.baseView.tint = color

        if(this.frontView) {
            this.frontView.tint = color
        }
    }

    setButtonsColor(color) {
        this.buttonsViews.forEach(view => view.tint = color)
    }
}