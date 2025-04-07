import { Sprite } from "pixi.js";
import { PopupSelectorView } from "../PopupSelectorView";
import { ButtonBarView } from "../accounts/ButtonBarView";
import { TextField } from "../../../text/TextField";
import { Timeline } from "../../../../timeline/Timeline";
import { colorToColor } from "../../../GraphicalPrimitives";
import { formatMoney } from "../../../../Utils";

const SYMBOLS_PER_LINE_COUNT = 35

export class BuyFeatureSelectorView extends PopupSelectorView {
    scattersViews
    idleTimeline = new Timeline
    bet = 0
    maximalBet = 0
    currencyCode = 'FUN'
    buyFeatureBetMultiplier = 1
    
    constructor({assets, dictionary, currencyCode, isLTRTextDirection, buyFeatureBetMultiplier, audio}) {
        super({assets, dictionary, currencyCode, isLTRTextDirection})

        this.buyFeatureBetMultiplier = buyFeatureBetMultiplier

        this.initScatters(assets)
        this.initButton({assets, dictionary, audio})
        this.initIdleTimeline()
    }

    initReelSelector(assets) {
    }

    initScatters(assets) {
        this.scattersViews = [
            {
                x: 350,
                y: 275,
                rotation: -0.3,
            },
            {
                x: 500,
                y: 275,
                rotation: 0
            },
            {
                x: 650,
                y: 275,
                rotation: 0.3
            },
        ].map(({x, y, rotation}) => {
            const sprite = new Sprite(assets.symbolScatter)

            sprite.anchor.set(0.5)
            sprite.position.set(x, y)
            sprite.scale.set(0.75)
            sprite.rotation = rotation

            return this.addChild(sprite)
        })
    }

    initButton({assets, dictionary, audio}) {
        const view = new ButtonBarView({assets, text: dictionary.purchase, audio})
        view.position.set(500, 900)
        view.onClick = () => this.onPurchaseRequest?.()
        view.iconView.setFontColor(0xFFFF00)
        this.buttonView = this.addChild(view)
    }

    initTexts(dictionary) {
        super.initTexts(dictionary)

        this.headerView.setText(dictionary.buy_bonus_game)
        this.hintView
            .setText(dictionary.get_3_guaranteed_scatters)
            .setCharactersPerLineCount(SYMBOLS_PER_LINE_COUNT) 
        this.hintView.setMaximalHeight(100)


        let maximalWidth = 760
        let maximalHeight = 250
        let textField = new TextField({maximalWidth, maximalHeight})
            .setFontName('default')
            .setCharactersPerLineCount(SYMBOLS_PER_LINE_COUNT)
            .setAlignMiddle()
            .setAlignCenter()
            .setFontColor(0xf8ee89)
            .setText(dictionary.buy_feature_instructions)
            .setFontSize(40)

        textField.pivot.set(maximalWidth / 2, maximalHeight / 2)
        textField.position.set(500, 475)
        this.instructionTextField = this.addChild(textField)



        maximalHeight = 100
        textField = new TextField({maximalWidth, maximalHeight})
            .setFontName('default')
            .setCharactersPerLineCount(SYMBOLS_PER_LINE_COUNT)
            .setAlignBottom()
            .setAlignCenter()
            .setFontColor(0xf8ee89)
            .setText(dictionary.buy_feature_price)
            .setFontSize(50)

        textField.pivot.set(maximalWidth / 2, maximalHeight / 2)
        textField.position.set(500, 650)
        this.priceHeaderTextField = this.addChild(textField)


        maximalHeight = 100
        textField = new TextField({maximalWidth, maximalHeight, isDynamicCharacterSet: false})
            .setCharactersPerLineCount(SYMBOLS_PER_LINE_COUNT)
            .setFontName('default')
            .setAlignMiddle()
            .setAlignCenter()
            .setFontColor(0xFFFF00)
            .setText('123.00 FUN')
            .setFontSize(maximalHeight)

        textField.pivot.set(maximalWidth / 2, maximalHeight / 2)
        textField.position.set(500, 750)
        this.finalPriceTextfield = this.addChild(textField)
    }


    initIdleTimeline() {
        this.idleTimeline
            .addAnimation({
                duration: 1000,
                onProgress: progress => {
                    const regress = 1 - progress
                    const subProgress = Math.sin(Math.PI * progress)

                    const color = colorToColor(
                        255,
                        255,
                        0,
                        255,
                        0,
                        255,
                        subProgress
                    )

                    const color2 = colorToColor(
                        255,
                        255,
                        0,
                        248,
                        238,
                        137,
                        1 - subProgress
                    )

                    this.headerView.setFontColor(color)
                    this.priceHeaderTextField.setFontColor(color2)
                    this.finalPriceTextfield.setFontColor(color2)
                    this.buttonView.iconView.setFontColor(color2)
                    this.scattersViews.forEach((view, i) => {
                        const shiftedProgress =  (regress + i * 0.2) % 1
                        const distortion = Math.sin(Math.PI * 2 * shiftedProgress)
                        view.scale.set(0.7 + 0.05 * distortion)
                    })
                }
            })
            .setLoopMode()
            .play()
    }

    refresh({bet = this.bet, currencyCode = this.currencyCode, maximalBet = this.maximalBet}) {
        this.maximalBet = maximalBet


        const {dictionary, isLTRTextDirection} = this

        this.instructionTextField.setText(
            dictionary
                .buy_feature_instructions
                
                .split('{BET}').join(
                    formatMoney({
                        value: bet,
                        isLTRTextDirection,
                        currencyCode
                    })
                )
        )

        this.finalPriceTextfield.setText(
            formatMoney({
                value: bet * this.buyFeatureBetMultiplier,
                isLTRTextDirection,
                currencyCode
            })
        )
    }
}