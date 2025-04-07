import { Container, Sprite } from "pixi.js";
import { TextField } from "../../../text/TextField";
import { Timeline } from "../../../../timeline/Timeline";
import { formatMoney } from "../../../../Utils";
import { InfoBarSymbolsPoolView } from "./InfoBarSymbolsPoolView";
import { colorToColor } from "../../../GraphicalPrimitives";
import { SCATTER_SYMBOL_ID, WILD_SYMBOL_ID } from "../../../../Constants";

const MAXIMAL_WIDTH = 1175
const DELAY_BEFORE_IDLE_MESSAGES = 5000

const TEXT_COLOR_MAP = [
    0x000000, // EMPTY
	0x00FF00, // ♣️ CLUBS
	0xFF0000, // ♥️ HEARTS
	0xFF55FF, // ♦️ DIAMONDS
	0x00BBFF, // ♠️ SPADES
	0x00FFFF, // RUM
	0x00BBFF, // HAT
	0xFFFFFF, // PISTOL
	0xFFFF00, // WATCHES
	0x00FF00, // WILD
	0xFFFF00, // SCATTER
]

export class InfoBarView extends Container {
    visibilityTimeline = new Timeline
    fadeTimeline = new Timeline
    timeline = new Timeline
    textField
    isLTRTextDirection = true

    contentContainer
    textFields = []
    symbolsPoolsViews = []
    
    assets
    dictionary
    idleMessageIndex = 0

    expansionFactor = 1
    contentWidth
    
    constructor({assets, dictionary, isLTRTextDirection}) {
        super()

        this.isLTRTextDirection = isLTRTextDirection
        this.assets = assets
        this.dictionary = dictionary
        this.initPanel(assets)
        this.initContentContainer()
        this.initTextField()
    }

    initPanel(assets) {
        const sprite = new Sprite(assets.infoBarPanel)
        sprite.anchor.set(0.5)

        sprite.tint = 0x000000
        sprite.alpha = 0.45

        this.panelView = this.addChild(sprite)
    }

    initContentContainer() {
        this.contentContainer = this.addChild(new Container)
    }

    initTextField() {
        const maximalWidth = 1175
        const maximalHeight = 80
        const textField = new TextField({maximalWidth, maximalHeight})
        textField.pivot.set(maximalWidth / 2, maximalHeight / 2)
        // textField.position.set(maximalWidth / 2, maximalHeight / 2)
        textField
            .setFontName('default')
            .setAlignMiddle()
            .setAlignCenter()
            .setFontSize(maximalHeight * 0.75)
            .setFontColor(0xFFFF00)
            .setText('123456')

        this.textField = this.addChild(textField)

        textField.visible = false
    }

    getTextField(index) {
        const {textFields} = this
        const textHeight = 42
        if(!textFields[index]) {
            const textField = new TextField({})
            textField
                .setFontName('default')
                .setFontSize(textHeight)
                .setFontColor(0xFFFF00)
                .setAlignLeft()
                .setAlignMiddle()
                .setText('123456')

            textField.pivot.y = textHeight / 2

            textFields[index] = this
                .contentContainer
                .addChild(textField)
        }

        return textFields[index]
    }

    getSymbolsPool(index) {
        const {symbolsPoolsViews} = this
        if(!symbolsPoolsViews[index]) {
            const view = new InfoBarSymbolsPoolView(this.assets)
            view.scale.set(0.45)
            view.visible = false

            symbolsPoolsViews[index] = this
                .contentContainer
                .addChildAt(view, 0)
        }

        return symbolsPoolsViews[index]
    }

    presentMessage(text) {
        this.textField.setText(text)
    }

    presentFade() {
        this.timeline.wind(1).deleteAllAnimations()

        return new Promise (resolve => {
            this.fadeTimeline
                .deleteAllAnimations()
                .addAnimation({
                    duration: 200,
                    onProgress: progress => {
                        this.contentContainer.alpha = 1 - Math.sin(Math.PI * progress)
                    }
                })
                .addAnimation({
                    duration: 100,
                    onFinish: resolve
                })
                .play()
        })
    }

    adjustContentContainer(width = this.contentWidth) {
        this.contentWidth = width
        this.panelView.scale.x = this.expansionFactor
        const finalMaximalWidth = MAXIMAL_WIDTH * this.expansionFactor
        this.contentContainer.scale.set(Math.min(1, finalMaximalWidth / width))

        this.contentContainer.x = -Math.min(finalMaximalWidth, width) / 2
    }

    drop() {
        this.contentContainer.scale.set(1)
        this.textFields.forEach(textField => {
            textField.setFontColor(0xf8ee89)
            textField.visible = false
            textField.x = 0
        })
        this.symbolsPoolsViews.forEach(view => {
            view.visible = false
            view.rotation = 0
            view.scale.set(0.45)
            view.x = 0
        })
    }

    async presentPayout({
        collapses = [
            {symbolId: 1, symbolsCount: 3},
            {symbolId: 2, symbolsCount: 3},
            {symbolId: 3, symbolsCount: 3},
            {symbolId: 4, symbolsCount: 3},
            {symbolId: 5, symbolsCount: 3},
        ],
        multiplier = 2,
        payout = 123,
        currencyCode = 'FUN'
    }) {
        await this.presentFade()

        const {
            dictionary,
            isLTRTextDirection
        } = this

        this.drop()
        const textParts = dictionary.info_bar_payout.split(/[{}]/)
        let width = 0
        let textFieldIndex = 0
        let multiplierTextField
        let payoutTextField
        
        textParts.forEach((textPart) => {
            let finalText = textPart
        
            if (textPart === 'PAYOUT') {
                payoutTextField = this.getTextField(textFieldIndex)
                finalText = formatMoney({
                    value: payout,
                    currencyCode,
                    isLTRTextDirection
                })
            } else if (textPart === '×') {
                multiplierTextField = this.getTextField(textFieldIndex)
                const multiplierTextPart = this.isLTRTextDirection
                    ? '× ' + multiplier
                    : multiplier + ' ×'
            
                finalText = multiplier > 1 ? multiplierTextPart : ''
            } else if (textPart === 'SYMBOLS') {
                finalText = undefined
                collapses.forEach(({
                    symbolId,
                    symbolsCount
                }, i) => {
                    if(isLTRTextDirection) {
                        const textField = this.getTextField(textFieldIndex)
                        textField.setText((i ? ' ': '') + ((symbolsCount > 1) ? (symbolsCount + 'x') : ''))
                        textField.x = width
                        textField.visible = true
                        textField.setFontColor(TEXT_COLOR_MAP[symbolId])
                        width += textField.width
                        textFieldIndex++
                    }

                    const poolView = this.getSymbolsPool(i)
                    poolView.presentSymbol(symbolId)
                    poolView.scale.set(0.45)
                    poolView.visible = true
                    poolView.x = width + poolView.width / 2
                    width += poolView.width


                    if(!isLTRTextDirection) {
                        const textField = this.getTextField(textFieldIndex)
                        textField.setText((i ? ' ': '') + ((symbolsCount > 1) ? ('x' + symbolsCount) : ''))
                        textField.x = width
                        textField.visible = true
                        textField.setFontColor(TEXT_COLOR_MAP[symbolId])
                        width += textField.width
                        textFieldIndex++
                    }

                })
            }


            if (finalText) {
                const textField = this.getTextField(textFieldIndex)
                textField.setText(finalText)
                textField.setFontColor(0xf8ee89)
                textField.x = width
                textField.visible = true
                width += textField.width
                textFieldIndex++
            }
        })
        

        this.adjustContentContainer(width)


        this.timeline
            .wind(1)
            .deleteAllAnimations()
            .addAnimation({
                duration: 500,
                onDelayFinish: {

                },
                onProgress: progress => {
                    const subProgress = Math.abs(Math.sin(Math.PI * 2 * progress))
                    const scale = 0.45 - subProgress * 0.1

                    this.symbolsPoolsViews.forEach(view => view.scale.set(scale))

                    const color = colorToColor(
                        255,
                        255,
                        0,
                        255,
                        0,
                        255,
                        subProgress
                    )

                    multiplierTextField?.setFontColor(color)
                    payoutTextField?.setFontColor(color)
                }
            })
            .play()
    }

    async presentIdle() {
        const {
            dictionary,
        } = this
        
        const idleMessages = [
            dictionary.info_bar_idle_3600_ways,
			dictionary.info_bar_idle_wild,
			dictionary.info_bar_idle_multiplier,
			dictionary.info_bar_idle_scatter,
        ]

        this.idleMessageIndex = (this.idleMessageIndex + 1) % idleMessages.length

        await this.presentFade()

        this.drop()
        const textParts = idleMessages[this.idleMessageIndex].split(/[{}]/)
        let width = 0
        let textFieldIndex = 0
        let scattersCountTextField
        let freeSpinsCountTextField
        let waysTextField

        const poolView = this.getSymbolsPool(0)
        
        textParts.forEach((textPart) => {
            let finalText = textPart
        
            if (textPart === 'WAYS_COUNT') {
                waysTextField = this.getTextField(textFieldIndex)
                finalText = '3600'
            } else if (textPart === 'WILD_SYMBOL') {
                finalText = ''
                poolView.presentSymbol(WILD_SYMBOL_ID)
                poolView.scale.set(0.45)
                poolView.visible = true
                poolView.x = width + poolView.width / 2
                width += poolView.width

            } else if (textPart === 'SCATTER_SYMBOL') {
                finalText = ''
                poolView.presentSymbol(SCATTER_SYMBOL_ID)
                poolView.scale.set(0.45)
                poolView.visible = true
                poolView.x = width + poolView.width / 2
                width += poolView.width
            } else if (textPart === 'SCATTERS_COUNT') {
                scattersCountTextField = this.getTextField(textFieldIndex)
                finalText = '3'
            } else if (textPart === 'FS_COUNT') {
                freeSpinsCountTextField = this.getTextField(textFieldIndex)
                finalText = '10'
            }


            if (finalText) {
                const textField = this.getTextField(textFieldIndex)
                textField.setText(finalText)
                textField.setFontColor(0xf8ee89)
                textField.x = width
                textField.visible = true
                width += textField.width
                textFieldIndex++
            }
        })
        

        this.adjustContentContainer(width)

        this.timeline
            .wind(1)
            .deleteAllAnimations()
            .addAnimation({
                duration: 500,
                onProgress: progress => {
                    const subProgress = Math.abs(Math.sin(Math.PI * 2 * progress))
                    const scale = 0.45 - subProgress * 0.1

                    this.symbolsPoolsViews.forEach(view => view.scale.set(scale))

                    const color = colorToColor(
                        255,
                        255,
                        0,
                        255,
                        0,
                        0,
                        subProgress
                    )

                    waysTextField?.setFontColor(color)
                    scattersCountTextField?.setFontColor(color)
                    freeSpinsCountTextField?.setFontColor(color)
                },
                onFinish: () => {

                }
            })
            .addAnimation({
                duration: DELAY_BEFORE_IDLE_MESSAGES,
                onFinish: () => { this.presentIdle()}
            })
            .play()
    }

    async presentSpinStart() {
        await this.presentFade()
        
        const {
            dictionary,
        } = this

        this.drop()

        let width = 0
        let poolView = this.getSymbolsPool(0)
        poolView.presentSymbol(1)
        
        poolView.rotation = -0.35
        poolView.visible = true
        poolView.x = width + poolView.width / 2
        width += poolView.width * 1.25
        poolView.scale.x = -0.45

        const textField = this.getTextField(0)
        textField.setText(dictionary.good_luck)
        textField.x = width
        textField.visible = true
        width += textField.width

        poolView = this.getSymbolsPool(1)
        poolView.presentSymbol(1)
        poolView.rotation = 0.35
        poolView.visible = true
        poolView.x = width + poolView.width * 1.25 / 2
        width += poolView.width

        

        this.adjustContentContainer(width)


        this.timeline
            .wind(1)
            .deleteAllAnimations()
            .addAnimation({
                duration: 500,
                onProgress: progress => {
                    const subProgress = Math.abs(Math.sin(Math.PI * 2 * progress))
                    const scale = 0.45 - subProgress * 0.1

                    this.symbolsPoolsViews.forEach(view => view.scale.set(scale))

                    const color = colorToColor(
                        255,
                        255,
                        0,
                        150,
                        255,
                        0,
                        subProgress
                    )

                    textField.setFontColor(color)
                }
            })
            .play()
    }



    async presentLose() {
        await this.presentFade()
        
        const {
            dictionary,
        } = this

        this.drop()

        let width = 0
        let poolView = this.getSymbolsPool(0)
        poolView.presentSymbol(1)
        
        poolView.rotation = -0.35
        poolView.visible = true
        poolView.x = width + poolView.width / 2
        width += poolView.width * 1.25
        poolView.scale.x = -0.45


        const textField = this.getTextField(0)
        textField.setText(dictionary.no_luck)
        textField.x = width
        textField.visible = true
        width += textField.width

        poolView = this.getSymbolsPool(1)
        poolView.presentSymbol(1)
        poolView.rotation = 0.35
        poolView.visible = true
        poolView.x = width + poolView.width * 1.25 / 2
        width += poolView.width

        

        this.adjustContentContainer(width)


        this.timeline
            .wind(1)
            .deleteAllAnimations()
            .addAnimation({
                duration: 500,
                onProgress: progress => {
                    const subProgress = Math.abs(Math.sin(Math.PI * 2 * progress))
                    const scale = 0.45 - subProgress * 0.1

                    this.symbolsPoolsViews.forEach(view => view.scale.set(scale))

                    const color = colorToColor(
                        255,
                        255,
                        0,
                        150,
                        255,
                        0,
                        subProgress
                    )

                    textField.setFontColor(color)
                }
            })
            .addAnimation({
                duration: DELAY_BEFORE_IDLE_MESSAGES,
                onFinish: () => {
                    this.presentIdle()
                }
            })
            .play()
    }


    async presentFreeSpinsAward({
        scattersCount = 3,
        freeSpinsCount = 10
    }) {
        await this.presentFade()
        
        const {
            dictionary,
        } = this

        this.drop()
        const textParts = dictionary.info_bar_free_spins_triggered.split(/[{}]/)
        let width = 0
        let textFieldIndex = 0
        let multiplierTextField
        let spinsCountTextField
        
        textParts.forEach((textPart) => {
            let finalText = textPart
        
            if (textPart === 'FS_COUNT') {
                spinsCountTextField = this.getTextField(textFieldIndex)
                finalText = freeSpinsCount + ''
            } else if (textPart === 'SCATTER_SYMBOLS') {
                finalText = undefined
                for (let i = 0; i < scattersCount; i++) {
                    const poolView = this.getSymbolsPool(i)
                    poolView.presentSymbol(SCATTER_SYMBOL_ID)
                    poolView.rotation = -0.25
                    poolView.visible = true
                    poolView.x = width + poolView.width / 2
                    width += poolView.width
                    poolView.scale.x = 0.45
                }
            }


            if (finalText) {
                const textField = this.getTextField(textFieldIndex)
                textField.setText(finalText)
                textField.setFontColor(0xf8ee89)
                textField.x = width
                textField.visible = true
                width += textField.width
                textFieldIndex++
            }
        })


       this.adjustContentContainer(width)

        this.timeline
            .wind(1)
            .deleteAllAnimations()
            .addAnimation({
                duration: 500,
                onProgress: progress => {
                    const subProgress = Math.abs(Math.sin(Math.PI * 2 * progress))
                    const scale = 0.45 - subProgress * 0.1

                    this.symbolsPoolsViews.forEach(view => view.scale.set(scale))

                    const color = colorToColor(
                        255,
                        255,
                        0,
                        255,
                        0,
                        255,
                        subProgress
                    )

                    spinsCountTextField.setFontColor(color)
                }
            })
            .play()
        
    }

    async presentTension() {
        await this.presentFade()
        
        const {
            dictionary,
        } = this

        this.drop()
        const textParts = dictionary.info_bar_tension.split(/[{}]/)
        let width = 0
        let textFieldIndex = 0
        let multiplierTextField
        let spinsCountTextField
        
        textParts.forEach((textPart) => {
            let finalText = textPart
        
            if (textPart === 'SCATTER_SYMBOL') {
                finalText = undefined
                const poolView = this.getSymbolsPool(0)
                poolView.presentSymbol(SCATTER_SYMBOL_ID)
                poolView.visible = true
                poolView.x = width + poolView.width / 2
                width += poolView.width
            }


            if (finalText) {
                const textField = this.getTextField(textFieldIndex)
                textField.setText(finalText)
                textField.setFontColor(0xf8ee89)
                textField.x = width
                textField.visible = true
                width += textField.width
                textFieldIndex++
            }
        })


       this.adjustContentContainer(width)

        this.timeline
            .wind(1)
            .deleteAllAnimations()
            .addAnimation({
                duration: 500,
                onProgress: progress => {
                    const subProgress = Math.abs(Math.sin(Math.PI * 2 * progress))
                    const scale = 0.45 - subProgress * 0.1

                    this.symbolsPoolsViews.forEach(view => view.scale.set(scale))

                    /*
                    const color = colorToColor(
                        255,
                        255,
                        0,
                        255,
                        0,
                        255,
                        subProgress
                    )*/
                }
            })
            .play()
    }

    async presentCommonPayout({
        payout = 123,
        currencyCode = 'FUN',
        delay = DELAY_BEFORE_IDLE_MESSAGES
    }) {
        await this.presentFade()

        this.drop()
        const {isLTRTextDirection} = this
        const textParts = this.dictionary.info_bar_common_payout.split(/[{}]/)
        let width = 0
        let textFieldIndex = 0
        let payoutTextField

        let poolView = this.getSymbolsPool(0)
        poolView.presentSymbol(WILD_SYMBOL_ID)
        
        poolView.rotation = -0.35
        poolView.visible = true
        poolView.x = width + poolView.width / 2
        width += poolView.width * 1.25
        poolView.scale.x = -0.45

        textParts.forEach((textPart) => {
            let finalText = textPart
        
            if (textPart === 'PAYOUT') {
                payoutTextField = this.getTextField(textFieldIndex)
                finalText = formatMoney({value: payout, currencyCode, isLTRTextDirection})
            }


            if (finalText) {
                const textField = this.getTextField(textFieldIndex)
                textField.setText(finalText)
                textField.setFontColor(0xf8ee89)
                textField.x = width
                textField.visible = true
                width += textField.width
                textFieldIndex++
            }
        })

        poolView = this.getSymbolsPool(1)
        poolView.presentSymbol(WILD_SYMBOL_ID)
        poolView.rotation = 0.35
        poolView.visible = true
        poolView.x = width + poolView.width * 1.25 / 2
        width += poolView.width
        

        this.adjustContentContainer(width)


        this.timeline
            .wind(1)
            .deleteAllAnimations()
            .addAnimation({
                duration: 500,
                onDelayFinish: {

                },
                onProgress: progress => {
                    const subProgress = Math.abs(Math.sin(Math.PI * 2 * progress))
                    const scale = 0.45 - subProgress * 0.1

                    this.symbolsPoolsViews.forEach(view => view.scale.set(scale))

                    payoutTextField.alpha = Math.min(1, progress * 2)

                    const color = colorToColor(
                        255,
                        255,
                        0,
                        255,
                        0,
                        255,
                        subProgress
                    )

                    payoutTextField?.setFontColor(color)
                }
            })
            .addAnimation({
                duration: delay,
                onFinish: () => {
                    this.presentIdle()
                }
            })
            .play()
    }

    async presentIntro() {
        await this.presentFade()
        
        const {
            dictionary,
        } = this

        this.drop()

        let width = 0
        let poolView = this.getSymbolsPool(0)
        poolView.presentSymbol(7)
        poolView.rotation = -0.35
        poolView.visible = true
        poolView.x = width + poolView.width / 2
        width += poolView.width * 1.25
        poolView.scale.x = -0.45

        const textField = this.getTextField(0)
        textField.x = width
        textField.visible = true
        width += textField.width

        poolView = this.getSymbolsPool(1)
        poolView.presentSymbol(7)
        poolView.rotation = 0.35
        poolView.visible = true
        poolView.x = width + poolView.width * 1.25 / 2
        width += poolView.width

        

        this.adjustContentContainer(width)


        this.timeline
            .wind(1)
            .deleteAllAnimations()
            .addAnimation({
                duration: 500,
                onProgress: progress => {
                    const subProgress = Math.abs(Math.sin(Math.PI * 2 * progress))
                    const scale = 0.45 - subProgress * 0.1

                    this.symbolsPoolsViews.forEach(view => view.scale.set(scale))

                    const color = colorToColor(
                        255,
                        255,
                        0,
                        150,
                        255,
                        0,
                        subProgress
                    )

                    textField.setFontColor(color)
                }
            })
            .play()
    }

    setVisible(isVisible) {
        this.visibilityTimeline
            .deleteAllAnimations()
            .addAnimation({
                duration: 100,
                onProgress: progress => {
                    this.alpha = isVisible
                        ? Math.max(this.alpha, progress)
                        : Math.min(this.alpha, 1 - progress)
                    this.visible = this.alpha > 0
                }
            })
            .play()
    }


    expand(expansionFactor = 1) {
        this.expansionFactor = expansionFactor
        this.adjustContentContainer()
    }
}