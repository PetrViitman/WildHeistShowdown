import { Container, Sprite } from "pixi.js";
import { TextField } from "../../text/TextField";
import { formatMoney } from "../../../Utils";
import { Timeline } from "../../../timeline/Timeline";
import { colorToColor } from "../../GraphicalPrimitives";
import { GUIView } from "../GUIView";

export class IndicatorView extends Container {
    panelView
    iconContainer
    iconView
    textField
    currencyCode = 'FUN'

    timeline = new Timeline
    currentValue
    dictionary

    constructor({assets, dictionary, isLTRTextDirection}) {
        super()

        this.isLTRTextDirection = isLTRTextDirection
        this.dictionary = dictionary
        this.initContainers()
        this.initPanel(assets)
        this.initIcon(assets)
        this.initTextField(assets)

        this.eventMode = 'static'
        this.addEventListener('pointerdown', () => {
            GUIView.isOverlayInteraction = true

            if(!this.isResponsive) return
            this.onClick?.()
            this.presentClick()
        })

        this.addEventListener('pointerup', () => { GUIView.isOverlayInteraction = false })
        this.addEventListener('pointerleave', () => { GUIView.isOverlayInteraction = false })
        this.addEventListener('pointercancel', () => { GUIView.isOverlayInteraction = false })
        this.addEventListener('pointerout', () => { GUIView.isOverlayInteraction = false })
        this.addEventListener('pointerupoutside', () => { GUIView.isOverlayInteraction = false })
    }

    initContainers() {
        this.contentContainer = this.addChild(new Container)
        this.iconContainer = this.contentContainer.addChild(new Container())
        this.iconContainer.x = -150
    }

    initPanel(assets) {
        const sprite = new Sprite(assets.indicatorPanel)
        sprite.anchor.set(0.5)

        sprite.tint = 0x000000
        sprite.alpha = 0.6

        this.panelView = this.contentContainer.addChildAt(sprite, 0)
    }

    initTextField(assets) {
        const maximalWidth = 290
        const maximalHeight = 80
        const textField = new TextField({maximalWidth, maximalHeight, isDynamicCharacterSet: false})
            .setFontName('default')
            .setText('')
            .setAlignMiddle()
            .setAlignCenter()
            .setFontColor(0xf8ee89)
            .setFontSize(maximalHeight * 0.75)

        textField.x = 48
        textField.pivot.set(maximalWidth / 2, maximalHeight / 2)

        this.textField = this.contentContainer.addChild(textField)
    }

    initIcon(assets) {
        const sprite = new Sprite(assets.iconWallet)
        sprite.anchor.set(0.5)
        sprite.scale.set(0.8)

        this.iconView = this.iconContainer.addChild(sprite)
    }

    setValue(value = this.currentValue ?? 0, currencyCode = this.currencyCode) {
        if(value === this.currentValue && currencyCode === this.currencyCode) return

        this.currencyCode = currencyCode

        const initialValue = this.currentValue ?? 0
        const delta = value - initialValue

        this.currentValue = value

        this.timeline
            .deleteAllAnimations()
            .addAnimation({
                duration: 500,
                onProgress: progress => {
                    const {isLTRTextDirection} = this
                    const formattedPayout = formatMoney({
                        value: initialValue + delta * progress,
                        currencyCode,
                        isLTRTextDirection
                    })

                    this.textField.setText(formattedPayout)

                    const floatingProgress = Math.abs(Math.sin(Math.PI * 2 * progress))
                    this.textField.setFontColor(
                        colorToColor(
                            248,
                            238,
                            137,

                            255,
                            255,
                            0,

                            floatingProgress
                        )
                    )

                    this.iconView.tint = colorToColor(
                        255,
                        255,
                        255,

                        255,
                        255,
                        0,

                        floatingProgress
                    )

                    this.iconContainer.scale.set(1 - floatingProgress * 0.3)
                }
            })
            .play()


        if(!value) {
            this.timeline.wind(1)
            this.textField.setText('-')
        }
    }

    setInteractive(isInteractive = true) {
        this.eventMode = 'static'// isInteractive ? 'static' : 'none'
        // this.cursor = isInteractive ? 'pointer' : 'default'
        //this.iconContainer.alpha = isInteractive ? 1 : 0.25

        this.isResponsive = isInteractive
    }

    presentClick() {

    }
}