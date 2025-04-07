import { Container, Sprite } from "pixi.js";
import { TextField } from "../text/TextField";
import { Timeline } from "../../timeline/Timeline";
import { colorToColor } from "../GraphicalPrimitives";

export class MultiplierView extends Container {
    textFields
    pointerView

    constructor(assets){
        super()

        this.initTextFields(assets)
        this.initPointer(assets)

        this.presentShift({})


        new Timeline()
            .addAnimation({
                duration: 3000,
                onProgress: progress => {
                    this.presentGlow(progress)
                }
            })
            .setLoopMode()
            .play()


        /*
        document.addEventListener('keyup', () => {
            new Timeline()
                .addAnimation({
                    duration: 3000,
                    onProgress: progress => {
                        this.presentTransition({
                            initialMultiplier: 1,
                            multiplier: 32,
                            progress
                        }) 
                    }
                })
                .play()

        })
        */
    }

    initTextFields(assets) {
        const maximalWidth = 600
		const maximalHeight = 350
    
        this.textFields = new Array(5).fill(0).map(_ => {
            const container = this.addChild(new Container)
            const sprite = new Sprite(assets.multiplier_case)
            sprite.anchor.set(0.5)
            sprite.width = maximalWidth * 0.88
            sprite.width = maximalWidth * 1.25
            sprite.y = 25
            sprite.tint = 0xfff78a
            //sprite.scale.y = -1
            sprite.height = maximalHeight
            container.addChild(sprite)

            const textField = new TextField({
				maximalWidth,
				maximalHeight
			})
			.setFontName(
				'x0123456789.,',
				[
					assets.payout_x,
					assets.payout_0,
					assets.payout_1,
					assets.payout_2,
					assets.payout_3,
					assets.payout_4,
					assets.payout_5,
					assets.payout_6,
					assets.payout_7,
					assets.payout_8,
					assets.payout_9,
					assets.payout_period,
					assets.payout_period,
				])
			.setFontSize(maximalHeight * 0.85)
			.setAlignCenter()
			.setAlignMiddle()
            .setLetterSpacing(-maximalHeight / 5)

            
            textField.pivot.set(
                maximalWidth / 2,
                maximalHeight / 2)

            textField.wrapper = container
            textField.caseView = sprite

            return container.addChild(textField)
        }) 
    }

    initPointer(assets)  {
        const sprite = new Sprite(assets.multiplier_pointer)
        sprite.anchor.set(0.5)
        sprite.tint = 0xe2fd56
        sprite.scale.set(1)

        this.pointerView = this.addChild(sprite)
    }

    presentShift({
        multiplier = 1,
        progress = 1,
        isIncrementing = true
    }) {
        const width = 1500
        const halfWidth = width * 0.5
        const targetProgress = 1 - progress * 0.2
        let leftmostMultiplier =  multiplier
        
        
        for(let i = 0; i < 3; i ++) {
            leftmostMultiplier /= 2

            if (leftmostMultiplier < 1) leftmostMultiplier = 1024            
        }


        let offsettingTextField
        let rightmostMultiplier = 1

        this.textFields.forEach((view, i) => {
            const shiftedProgress = (targetProgress +  i * 0.2 + 0.1) % 1

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

            if(i < 3 && view.wrapper.x > 0 ) {
                offsettingTextField = view
            } else {
                view.setText('x' + leftmostMultiplier)
            }
            

            if(i >= 3 && view.wrapper.x > 0) rightmostMultiplier = leftmostMultiplier

            leftmostMultiplier *= 2
            if (leftmostMultiplier > 1024) leftmostMultiplier = 1
        })

        offsettingTextField?.setText('x' + (rightmostMultiplier * 2))

        const currentView = this.textFields[2]
        const targetView = this.textFields[3]

        if (isIncrementing) currentView.alpha = progress


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
    }

    presentTransition({
        initialMultiplier = 1,
        multiplier = 8,
        progress = 0
    }) {
        let stepsCount = 0

        const isMultiplierIncreasing = initialMultiplier < multiplier
        const startMultiplier = isMultiplierIncreasing
            ? initialMultiplier
            : multiplier
        
        const targetMultiplier = isMultiplierIncreasing
            ? multiplier
            : initialMultiplier

        let currentMultiplier = startMultiplier

        while(currentMultiplier < targetMultiplier) {
            currentMultiplier *= 2
            stepsCount++
        }

        if (!isMultiplierIncreasing) progress = 1 - progress

        const finalProgress = (stepsCount * progress) % 1
        const stepIndex = Math.trunc(stepsCount * progress)

        let finalMultiplier = startMultiplier

        for (let i = 0; i < stepIndex + 1; i++) {
            finalMultiplier *= 2
        }

        this.presentShift({
            progress: finalProgress,
            multiplier: finalMultiplier,
            isIncrementing: false,
        })
    }

    presentOutro({
        minimalMultiplier = 1,
        multiplier = 4,
        progress = 0
    }) {
        let stepsCount = 0

        let currentMultiplier = minimalMultiplier
        while(currentMultiplier < multiplier) {
            currentMultiplier *= 2
            stepsCount++
        }



        const finalProgress = 1 - ((stepsCount * progress) % 1)
        const stepIndex = Math.trunc(stepsCount * progress)

        let finalMultiplier = multiplier
        for(let i = 0; i < stepIndex; i++) {
            finalMultiplier /= 2
        }


        this.presentShift({
            progress: finalProgress,
            multiplier: finalMultiplier,
            isIncrementing: false,
        })
    }

    presentMultiplier({
        multiplier = 2,
        progress = 1
    }) {
        this.presentShift({
            multiplier,
            progress: 1,
        })

        this.textFields[3].y = 350 * Math.min(1, progress * 3) ** 2
        this.textFields[3].scale.set(1 + 1.5 * Math.abs(Math.sin(Math.PI * 3 * progress)) * (1 -progress ))
        this.textFields[3].alpha = Math.min(1, (1 - progress) * 2)

        this.textFields[3].setFontColor(
            colorToColor(
                241,
                125,
                255,
                255,
                255,
                255,
                Math.min(1, progress * 3)
            )
        )
    }

    presentGlow(progress) {
        const finalProgress = Math.sin(progress * Math.PI)
        this.pointerView.y = -200 + 15 * finalProgress

        this.textFields.forEach((view, i) => {
            const shiftedProgress =  Math.sin(((i * 0.5 + finalProgress) % 1) * Math.PI)

            view.caseView.scale.x = 4 + shiftedProgress * 2
            //view.wrapper.y = 5 * Math.sin(Math.PI * 2 * (progress + (view.wrapper.x + 750) / 1500 )) 
            //view.caseView.y = 25 - view.wrapper.y
        })
    }
}