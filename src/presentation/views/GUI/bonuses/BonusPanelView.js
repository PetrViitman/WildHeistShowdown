import { Sprite } from "pixi.js";
import { AdaptiveContainer } from "../../adaptiveDesign/AdaptiveContainer";
import { TextField } from "../../text/TextField";
import { Timeline } from "../../../timeline/Timeline";
import { colorToColor } from "../../GraphicalPrimitives";
import { ButtonCloseView } from "../scrollable/ButtonCloseView";

export class BonusPanelView extends AdaptiveContainer {
    overlayStripView
    contentContainer
    textField

    buttonCloseView
    iconView

    timeline = new Timeline
    idleTimeline = new Timeline

    dictionary

    constructor({assets, dictionary, audio}) {
        super()

        this.dictionary = dictionary


        this.initOverlayStrip(assets)
        this.initContentContainer()
        this.initButton(assets, audio)
        this.initIcon(assets)
        this.initTextField()


        this.idleTimeline
            .addAnimation({
                duration: 2500,
                onProgress: progress => {
                    const colorProgress = Math.sin(Math.PI * progress)

                    const color = colorToColor(
                        153,
                        255,
                        0,
                        255,
                        255,
                        0,
                        colorProgress
                    )

                    const distortionProgress = Math.sin(Math.PI * 12 * progress) * (1 - progress)

                    this.textField.setFontColor(color)
                    this.textField.scale.x = 1 + 0.1 * distortionProgress
                    this.iconView.tint = color

                    this.iconView.rotation = -0.2 + 0.1 * distortionProgress
                    this.iconView.scale.y = 0.6 + 0.05 * distortionProgress

                    this.buttonCloseView.iconView.rotation = 0.25 * distortionProgress

                    this.overlayStripView.tint = colorToColor(136, 153, 0, 153, 153, 0, colorProgress)
                }
            })
            .setLoopMode()
            .play()
    }

    initOverlayStrip(assets) {
        const container = this
            .addChild(new AdaptiveContainer)
            .stretchHorizontally()
            .stretchVertically()
            .setSourceArea({width: 248, height: 300})
            .setTargetArea({x: 0, y: 0, width: 1, height: 0.1})


        const sprite = new Sprite(assets.gradient)
        sprite.anchor.set(0, 1)
        sprite.scale.y = -1
        sprite.tint = 0x889900
        sprite.alpha = 0.5
        this.overlayStripView = container.addChild(sprite)
    }

    initContentContainer() {
        this.contentContainer = this
            .addChild(new AdaptiveContainer)
            .setSourceArea({width: 600, height: 100})
            .setTargetArea({x: 0, y: 0, width: 1, height: 0.1})
    }

    initTextField() {
        const maximalWidth = 350
        const maximalHeight = 80

        const textField = new TextField({maximalWidth, maximalHeight})
            .setFontName('default')
            .setFontSize(30)
            .setFontColor(0x99FF00)
            .setAlignCenter()
            .setAlignMiddle()

        const x = maximalWidth / 2
        const y = maximalHeight / 2

        textField.pivot.set(x, y)
        textField.position.set(300, y + 10)
        this.textField = this.contentContainer.addChild(textField)
    }

    initButton(assets, audio) {
        const view = new ButtonCloseView(assets, audio)
        view.bodyView.tint = 0xAACC00
        view.iconView.tint = 0xFFFF00
        view.scale.set(0.35)
        view.position.set(535, 50)
        this.buttonCloseView = this
            .contentContainer
            .addChild(view)

        view.onClick = () => {
            this.onButtonCloseClick?.()
        }
    }

    initIcon(assets) {
        const view = new Sprite(assets.iconBonus)
        view.scale.set(0.6)
        view.anchor.set(0.5)
        view.position.set(65, 50)
        this.iconView = this
            .contentContainer
            .addChild(view)

    }

    presentBonus(descriptor) {
        this.timeline
            .wind(1)
            .deleteAllAnimations()
            .addAnimation({
                duration: 250,
                onStart: () => {
                    if (descriptor) {
                        this.idleTimeline.play()
                        const textsMap = {
			                1: "bonus_double_up_shorthand",
			                2: "bonus_secure_half_bet_shorthand",
                            3: "bonus_free_bet_shorthand",
                        }


                        this.textField.setText(this.dictionary[textsMap[descriptor.type]])
                    }
                },
                onProgress: progress => {
                    this.alpha = descriptor
                        ? Math.max(this.alpha, progress)
                        : Math.min(this.alpha, 1 - progress)

                    this.visible = this.alpha > 0
                },
                onFinish: () => {
                    if(!descriptor) {
                        this.idleTimeline.pause()
                    }
                }
            })
            .windToTime(1)
            .play()
    }

    setInteractive(isInteractive = true) {
        this.buttonCloseView.setInteractive(isInteractive)
    }
}