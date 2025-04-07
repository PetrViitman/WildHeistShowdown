import { Container, Sprite } from "pixi.js";
import { Timeline } from "../../timeline/Timeline";
import { TextField } from "../text/TextField";
import { colorToColor } from "../GraphicalPrimitives";

export class FreeSpinsIndicatorView extends Container {
    textFields
    timeline = new Timeline
    spinsCount = 0

    constructor(assets) {
        super()

        this.initBase(assets)
        this.initTextFields(assets)

        this.presentShift({
            targetNumber: 0,
            progress: 1,
        })
    }

    initBase(assets) {
        const sprite = new Sprite(assets.free_spins_indicator_base)
        sprite.anchor.set(0.5)
        this.addChild(sprite)
    }

    initTextFields(assets) {
        const width = 150
        const height = 65

        this.textFields = [0, 0].map(_ => {
            const textField = new TextField({
                maximalWidth: width,
                maximalHeight: height
            })
                .setFontName(
                    '0123456789',
                    [
                        assets.fs_0,
                        assets.fs_1,
                        assets.fs_2,
                        assets.fs_3,
                        assets.fs_4,
                        assets.fs_5,
                        assets.fs_6,
                        assets.fs_7,
                        assets.fs_8,
                        assets.fs_9,
                    ])
                .setFontColor(0xffc500)
                .setText('1')
                .setFontSize(height)
                .setLetterSpacing(5)
                .setAlignMiddle()
                .setAlignCenter()

            textField.pivot.set(width / 2, height / 2)
            textField.y = 5
            return this.addChild(textField)
        })
    }

    presentShift({
        targetNumber = 1,
        progress = 1,
    }) {
        const targetProgress = 1 - progress * 0.5
        
        const distance = 133
        const {textFields} = this
        textFields[1].setText(
            '' + (targetNumber - 1)
        )

        textFields[0].setText(
            '' + targetNumber
        )

        textFields.forEach((view, i) => {
            const shiftedProgress = (targetProgress +  i * 0.5) % 1
            const angle = Math.PI * (shiftedProgress - 0.5)
            const sin = Math.sin(angle)
            const cos = Math.abs(Math.cos(angle))
            view.x = distance * sin
            view.scale.x = cos
            view.visible = view.scale.x > 0.005
        })

        
        /*
        this.textFields.forEach((view, i) => {
            const shiftedProgress = (targetProgress +  i * 0.5) % 1

            view.wrapper.x =  halfWidth * Math.sin(Math.PI * (shiftedProgress - 0.5 ))
            view.wrapper.scale.x = Math.sin(Math.PI * shiftedProgress)
            view.wrapper.scale.y = 0.5 + 0.5 * Math.sin(Math.PI * shiftedProgress)
            view.wrapper.skew.x = 0.1 * Math.sin(Math.PI * 2 * shiftedProgress)
            view.wrapper.alpha = Math.min(1, (1 - Math.abs(Math.cos(Math.PI * shiftedProgress))) * 10 )
            view.caseView.alpha = (1 - Math.abs(Math.cos(Math.PI * shiftedProgress)))
            view.caseView.scale.y = 1 / view.wrapper.scale.y * 2
            view.setFontColor(0xfff78a)
            view.alpha = 1
            view.y = 0

            view.setText('x' + leftmostNumber)

            if(i < 3 && view.wrapper.x > 0 ) offsettingTextField = view

            if(i >= 3 && view.wrapper.x > 0) rightmostNumber = leftmostNumber

            leftmostNumber *= 2
            if (leftmostNumber > 1024) leftmostNumber = 1
        })


        offsettingTextField?.setText('x' + (rightmostNumber * 2))

        const currentView = this.textFields[2]
        const targetView = this.textFields[3]

        currentView.setFontColor(
            colorToColor(
                255,
                250,
                179,

                219,
                255,
                7,
                1 - progress
            )
        )

        targetView.setFontColor(
            colorToColor(
                255,
                250,
                179,

                219,
                255,
                7,
                progress
            )
        )
            */
    }

    presentRemainingSpinsCount(targetSpinsCount = 0) {
        const currentSpinsCount = this.spinsCount
        if(currentSpinsCount === targetSpinsCount) return
        
        const spinsCountDelta = targetSpinsCount - currentSpinsCount
        const stepsCount = Math.abs(spinsCountDelta)
        this.spinsCount = targetSpinsCount

        return this
            .timeline
            .deleteAllAnimations()
            .addAnimation({
                duration: Math.min(1000, 350 * stepsCount),
                onProgress: progress => {
                    const totalProgress = Math.max(0, progress * stepsCount - (spinsCountDelta < 0 ? 0.0001 : 0))
                    const subProgress = totalProgress % 1
                    const finalSpinsCount = Math.trunc((currentSpinsCount + 1) + spinsCountDelta * progress)
                    this.presentShift({
                        targetNumber: finalSpinsCount,
                        progress: spinsCountDelta > 0 ? subProgress : (1-subProgress),
                    })
                }
            })
            .play()
    }


    setTimeScale(scale) {
		this.timeline.setTimeScaleFactor({name: 'scale', value: scale})
	}
}