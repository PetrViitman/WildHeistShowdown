import { Container } from "pixi.js";
import { formatMoney } from "../../../Utils";
import { TextField } from "../../text/TextField";

export class AwardPayoutView extends Container {
    payoutTextFields

    constructor(assets) {
        super()

        this.initTextFields(assets)
    }

    initTextFields(assets) {
        const maximalWidth = 800
		const maximalHeight = 200
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

        this.payoutTextFields = [
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


            textField.pivot.set(
                maximalWidth / 2,
                maximalHeight / 2)

            textField.setHiddenCharacters([','])

            return this.addChild(textField)
        })

    }

    presentDistortion(progress) {
        const distortionProgress = -Math.sin(Math.PI * 9 * progress)

        this.payoutTextFields[0].y = 5 * distortionProgress
        this.payoutTextFields[1].y = -5 * distortionProgress

        this.payoutTextFields.forEach(view => {
            view.setDistortion(0.25 * distortionProgress)
            view.setDistortionHeight(25 * distortionProgress)
        })
    }

    presentPayout(payout = 123) {
        this.payoutTextFields.forEach(view => {
            view.setText(formatMoney({value: payout}))
        })
    }

    setColor(color = 0xFFFFFF) {
        this.payoutTextFields[1].setFontColor(color)
    }
}