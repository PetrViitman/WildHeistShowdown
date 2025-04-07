import { Container, Sprite } from "pixi.js";
import { TextField } from "../../text/TextField";
import { formatMoney } from "../../../Utils";
import { Timeline } from "../../../timeline/Timeline";
import { colorToColor } from "../../GraphicalPrimitives";

const FLIGHT_DISTANCE = 1700

export class PayoutView extends Container {
    backgroundView
    textFields

    constructor(assets) {
        super()

        this.initBackground(assets)
        this.initTextFields(assets)
        this.presentIntro({progress: 0})
        /*
        new Timeline()
            .addAnimation({
                duration: 1000,
                onProgress: progress => this.presentIntro({progress}),
            })
            .addAnimation({
                delay: 1000,
                duration: 1000,
                onProgress: progress => this.presentMultiplier({
                    multipliedPayout: 268,
                    progress,
                }),
            })
            .addAnimation({
                delay: 2000,
                duration: 300,
                onProgress: progress => this.presentOutro({
                    progress,
                }),
            })
            .setLoopMode()
            .play()

            */
    }

    initBackground(assets) {
        const view = new Sprite(assets.payout_background)
        view.anchor.set(0.5)
        this.backgroundView = this.addChild(view)
    }

    initTextFields(assets) {
        const maximalWidth = 800
		const maximalHeight = 350
        const textures = [
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
        ]

        this.textFields = [
            0xfd0500,
            0xdbff07
        ].map(color => {
            const textField = new TextField({
                    maximalWidth,
                    maximalHeight
                })
                .setFontName(
                    '0123456789.,',
                    textures
                )
                .setFontSize(maximalHeight)
                .setAlignCenter()
                .setAlignMiddle()
                .setLetterSpacing(-maximalHeight / 5)
                .setFontColor(color)
                .setText('20354')

            textField.pivot.set(
                maximalWidth / 2,
                maximalHeight / 2)

                textField.setHiddenCharacters([','])

            return this.addChild(textField)
        })

    }

    presentIntro({
        payout = 123,
        progress = 0
    }) {
        const angle = Math.PI * 2 * progress **2
        const sin = Math.sin(angle)
        const halfSin = Math.sin(Math.PI * progress ** 2)
        const quarterSin = Math.sin(Math.PI * 0.5 * progress ** 2)
        const cos = Math.cos(angle)
        const distortion = -sin * 0.5
        const distortionHeight = 150 * sin
        const y = -FLIGHT_DISTANCE * progress ** 2
        const letterSpacing = -70 + 50 * halfSin
        const alpha = Math.min(1, quarterSin * 2)


        this.textFields.forEach(view => {
            view.scale.set(1 + halfSin)
            view.setDistortion(distortion)
                .setLetterSpacing(letterSpacing)
                .setDistortionHeight(distortionHeight)
                .setText(formatMoney({value: payout}))
            view.y = y
            view.alpha = alpha
        })

        this.textFields[0].pivot.y = 175 + 10 * sin
        this.backgroundView.alpha = 0
    }

    presentMultiplier({
        payout = 123,
        multipliedPayout = payout,
        progress = 0
    }) {

        const payoutDelta = multipliedPayout - payout
        const angle = Math.PI * 2 * progress **2
        const sin = Math.sin(angle)
        const finalPayout = formatMoney({
            value: payout + payoutDelta * Math.min(1, progress * 2)
        })

        this.textFields.forEach(view => {
            view.setText(finalPayout)
            view.setDistortion(sin * 0.2)
            view.scale.x = 1 + Math.abs(Math.sin(Math.PI * 2 * progress)) * (1 - progress)
            view.y = -FLIGHT_DISTANCE
        })

        this.textFields[0].pivot.y = 175 + 10 * sin

        this.backgroundView.alpha = Math.min(1, progress * 2)
        this.backgroundView.width = this.textFields[1].width * 2
        this.backgroundView.height = this.textFields[1].height * 2
        this.backgroundView.position.set(this.textFields[0].x, this.textFields[0].y)
    
    }

    presentOutro({
        multipliedPayout = 268,
        progress = 0
    }) {

        const finalPayout = formatMoney({value: multipliedPayout})
        const alpha = 1 - Math.min(1, progress * 2)

        this.backgroundView.alpha = alpha

        this.textFields.forEach(view => {
            view.setText(finalPayout)
            view.scale.y = 1 + 2 * progress ** 2
            view.y = -FLIGHT_DISTANCE + 1000 * progress ** 3
            view.alpha = alpha
        })

    }
}