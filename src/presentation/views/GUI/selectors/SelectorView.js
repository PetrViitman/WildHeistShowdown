import { Container, Sprite } from "pixi.js";
import { TextField } from "../../text/TextField";
import { ButtonBetLessView } from "../buttons/ButtonBetLessView";
import { ButtonBetMoreView } from "../buttons/ButtonBetMoreView";
import { Timeline } from "../../../timeline/Timeline";
import { GUIView } from "../GUIView";


export class SelectorView extends Container {
    textField
    buttonLessView
    buttonMoreView
    selectedOptionIndex
    options = ['!']
    timeline = new Timeline


    constructor({
        assets,
        options = ['!'],
        selectedOptionIndex
    }) {
        super()

        this.initPanel(assets)
        this.initButtons(assets)
        this.initTextField()

        this.options = options
        this.presentSelect(selectedOptionIndex)

        this.eventMode = 'static'
        this.addEventListener('pointerdown', () => {
            GUIView.isOverlayInteraction = true

            if(!this.isResponsive) return
            this.onClick()
            this.presentClick()
        })
    }

    setOptions(options) {
        this.options = options
        this.presentSelect(this.selectedOptionIndex, true)
        this.timeline.wind(1)
    }

    initPanel(assets) {
        const sprite = new Sprite(assets.indicatorPanel)
        sprite.anchor.set(0.5)
        sprite.tint = 0x000000
        sprite.alpha = 0.75

        this.addChild(sprite)
    }

    initButtons(assets) {
        let view = new ButtonBetLessView(assets)
        view.position.set(-250, 0)
        view.scale.set(0.5)
        view.onClick = () => {
            this.presentSelect(Math.max(this.selectedOptionIndex - 1, 0))
        }
        this.buttonLessView = this.addChild(view)

        view = new ButtonBetMoreView(assets)
        view.position.set(250, 0)
        view.scale.set(0.5)
        view.onClick = () => {
            this.presentSelect(Math.min(this.selectedOptionIndex + 1, this.options.length - 1))
        }
        this.buttonMoreView = this.addChild(view)
    }

    initTextField() {
        const maximalWidth = 380
		const maximalHeight = 90
        this.textField = this.addChild(
			new TextField({
				maximalWidth,
				maximalHeight
			}))
			.setFontName('default')
			.setFontColor(0xFFFF00)
			.setFontSize(90)
			.setAlignCenter()
			.setAlignMiddle()
            .setFontSize(maximalHeight * 0.75)

        this.textField.pivot.set(maximalWidth / 2, maximalHeight / 2)
    }

    presentSelect(optionIndex, forcePresent) {
        if (optionIndex === this.selectedOptionIndex && !forcePresent) return

        this.buttonLessView.setInteractive(optionIndex > 0)
        this.buttonMoreView.setInteractive(optionIndex < this.options.length - 1)

        this.selectedOptionIndex = optionIndex

        this.timeline
            .wind(1)
            .deleteAllAnimations()
            .addAnimation({
                duration: 200,
                onProgress: progress => {
                    this.textField.alpha = 1 - Math.sin(Math.PI * progress)
                }
            })
            .addAnimation({
                duration: 100,
                onFinish: () => {
                    let text = this.options[optionIndex] + ''
            
                    if(text === 'Infinity') text = '∞'

                    this.textField.setText(text)
                }
            })
            .play()
    }
}