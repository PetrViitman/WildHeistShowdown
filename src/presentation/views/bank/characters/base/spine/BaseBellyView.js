import { Container, Sprite } from "pixi.js";

export class BaseBellyView extends Container {
    contentContainer
    baseView
    beltView

    constructor(assets) {
        super()

        this.initContentContainer()
        this.initBase(assets)
        this.initFront(assets)
    }

    initContentContainer() {
        const container = this.addChild(new Container)
        this.contentContainer = container
    }

    initBase(assets) {
        this.baseView = this
            .contentContainer
            .addChild(new Sprite(assets.belly))
        this.baseView.anchor.set(0.5)
    }

    initFront(assets) {
        this.frontView = this
            .contentContainer
            .addChild(new Sprite(assets.uniform_front_bottom))

        this.frontView.anchor.set(0.5)
        this.frontView.y = 30

        this.buttonsViews = [25].map(y => {
            const sprite = new Sprite(assets.button)
            this.contentContainer.addChild(sprite)
            sprite.anchor.set(0.5)
            sprite.y = y

            return sprite
        })
    }

    setFlip(flipProgress) {
        const { contentContainer, buttonsViews } = this
        const distortionFactor = -Math.cos(Math.PI * 2 * flipProgress)
        contentContainer.skew.x = -distortionFactor * 0.1
        contentContainer.x = -distortionFactor * 15
        contentContainer.scale.set(
            1 * (0.75 + 0.25 * ( 1- Math.abs(distortionFactor))),
            1
        )

        this.beltView?.setFlip(flipProgress)


        if (buttonsViews) {
            const buttonProgress = (flipProgress + 0.98) % 1
            const buttonAngle = Math.PI * 2 * buttonProgress
            const buttonSin = Math.sin(buttonAngle)
            const buttonCos = Math.cos(buttonAngle)


            const scaleY = 1 / this.parent.scale.y
            buttonsViews[0].x = 115 * buttonCos
            buttonsViews[0].scale.y = scaleY
            buttonsViews[0].scale.x = buttonSin / contentContainer.scale.x
            buttonsViews[0].visible = buttonProgress < 0.5
        }

        if(this.frontView) {
            const frontProgress = (flipProgress + 0.955) % 1
            const frontAngle = Math.PI * 2 * frontProgress
            const frontSin = Math.sin(frontAngle)
            const frontCos = Math.cos(frontAngle)

            this.frontView.x = 125 * frontCos
            this.frontView.scale.x = frontSin
            this.frontView.visible = frontProgress < 0.5
        }
    }

    attachBelt(beltView) {
        this.beltView = this.contentContainer.addChild(beltView)
        this.beltView.scale.set(0.95)
        this.beltView.y = 75
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