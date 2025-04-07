import { Container, Sprite } from "pixi.js";
import { TextField } from "../../../text/TextField";
import { REELS_COUNT, REELS_LENGTHS, REELS_OFFSETS, WILD_SYMBOL_ID } from "../../../../Constants";
import { MultiplierView } from "../../../reels/MultiplierView";
import { formatMoney } from "../../../../Utils";
import { InfoBarView } from "../../indicators/infoBar/InfoBarView";
import { Timeline } from "../../../../timeline/Timeline";
import { colorToColor } from "../../../GraphicalPrimitives";

const FONT_SCALE_FACTOR = 1.5
const FONT_SIZE_HEADER = 55 * FONT_SCALE_FACTOR
const FONT_SIZE_SUB_HEADER = 45 * FONT_SCALE_FACTOR
const FONT_SIZE_TEXT = 40 * FONT_SCALE_FACTOR
const SYMBOLS_PER_LINE_COUNT = 40

const SYMBOLS_NAMES = [
    'Clubs',
    'Hearts',
    'Diamonds',
    'Spades',
    'Bottle',
    'Hat',
    'Pistol',
    'Watches',
    'Wild',
    'Scatter',
]

const timeline = new Timeline().addAnimation({duration: 1})

function awaitNextFrame() {
    return timeline.wind(0).play()
}

export class PaytableContentView extends Container {
    coefficients
    scattersViews = []
    payoutsTextFields = []
    dictionary
    timeline = new Timeline
    winBoxesViews = []
    multiplierHeaderView
    multiplierView
    isLTRTextDirection

    async init({assets, dictionary, coefficients, isLTRTextDirection}) {
        this.coefficients = coefficients
        this.dictionary = dictionary
        this.isLTRTextDirection= isLTRTextDirection
        

        await this.initSymbolsPayouts(assets, dictionary)
        await this.initGoldFramedFeature(assets, dictionary)
        await this.initMultiplier(assets, dictionary)
        await this.initFreeSpins(assets, dictionary)
        await this.initMaximalWin(dictionary)
        await this.init3600Ways(assets, dictionary)
        
        this.timeline.addAnimation({
            duration: 1000,
            onProgress: progress => {
                const floatingProgress = Math.sin(Math.PI * progress)
                const regress = 1 - progress
                const color = colorToColor(
                    255,
                    0,
                    0,
                    255,
                    255,
                    0,
                    floatingProgress
                )
                
                this.winBoxesViews.forEach(view => {
                    view.tint = color
                })

                this.scattersViews.forEach((view, i) => {
                    const shiftedProgress =  (regress + i * 0.2) % 1
                    const distortion = Math.sin(Math.PI * 2 * shiftedProgress)
                    view.scale.set(0.8 + 0.05 * distortion)
                    view.rotation = -0.3 + 0.1 * distortion
                })

                this.multiplierView.presentTransition({
                    initialMultiplier: 1,
                    multiplier: 2,
                    progress: floatingProgress
                })

                this.multiplierHeaderView.setFontColor(
                    colorToColor(
                        255,
                        250,
                        179,
        
                        219,
                        255,
                        7,
                        floatingProgress
                    )
                )
            }
        })
        .setLoopMode()
        .play()

        await timeline.wind(0).play()
        const sprite = this.addChildAt(new Sprite(assets.rectangle), 0)
        sprite.width = 1000
        sprite.height = this.height + 50
        sprite.tint = 0x000000

        timeline.destroy()
    }

    async initSymbolsPayouts(assets, dictionary) {
        const {isLTRTextDirection} = this
        let maximalWidth = 1000
        

        let textField = new TextField({maximalWidth})
            .setFontName('default')
            .setCharactersPerLineCount(SYMBOLS_PER_LINE_COUNT)
            .setAlignMiddle()
            .setAlignCenter()
            .setFontColor(0xf8ee89)
            .setFontSize(FONT_SIZE_HEADER)
            .setText(dictionary.symbol_payout_values)
        
        textField.pivot.set(maximalWidth / 2, 0)
        textField.position.set(500, 20)
        this.addChild(textField)


        const offsetX = textField.height + 20
        const stepWidth = 225
        const stepHeight = 225

        let offsetY = this.height
        const descriptors = [
            {x: 2, y: 4, color: 0xAAFF55},
            {x: 0, y: 4, color: 0xFF2200},
            {x: 2, y: 3, color: 0xFF22AA},
            {x: 0, y: 3, color: 0x55AAFF},
            {x: 2, y: 2, color: 0x22FFFF},
            {x: 0, y: 2, color: 0x2266FF},
            {x: 2, y: 1, color: 0xEEEEEE},
            {x: 0, y: 1, color: 0xFFAA22},
            {x: 2, y: 0, color: 0xAAFF00, align: 'center', isSpecialSymbol: true},
            {x: 0, y: 0, color: 0xFFFF00, scale: 1.25, align: 'center', isSpecialSymbol: true},
        ]

        for(let i = 0; i < descriptors.length; i++) {
            await awaitNextFrame()
            const  {x, y, color = 0xf8ee89, scale = 1, align, isSpecialSymbol} = descriptors[i]
            const sprite = new Sprite(assets['symbol' + SYMBOLS_NAMES[i]])
            sprite.anchor.set(0.5)
            sprite.scale.set(0.8 * scale)
            sprite.position.set(x * stepWidth + offsetX, (y + 1) * stepHeight + offsetY)
            this.addChild(sprite)

            const maximalWidth = 240
            const maximalHeight = 180

            await awaitNextFrame()
            const textField = new TextField({
                maximalWidth,
                maximalHeight,
                isDynamicCharacterSet: isSpecialSymbol ? undefined : false
            })
                .setFontName('default')
                .setAlignMiddle()
                .setAlignLeft()
                .setFontColor(color)
                .setFontSize(FONT_SIZE_SUB_HEADER)

            if (align === 'center') {
                textField.setAlignCenter()
            }

            textField.pivot.set(maximalWidth / 2, maximalHeight / 2)

            this.payoutsTextFields.push(textField)

            textField.position.set((x + 1) * stepWidth + offsetX, (y + 1) * stepHeight + offsetY)

            if (!isLTRTextDirection) {
                const defaultSymbolPositionX = sprite.x
                sprite.x = textField.x
                textField.x = defaultSymbolPositionX
            }

            this.addChild(textField)

        }

        await awaitNextFrame()
        offsetY = this.height + 175
        maximalWidth = 900

        textField = new TextField({maximalWidth})
            .setFontName('default')
            .setAlignTop()
            .setAlignLeft()
            .setFontColor(0xf8ee89)
            .setFontSize(FONT_SIZE_TEXT)
            .setCharactersPerLineCount(SYMBOLS_PER_LINE_COUNT)
            .setText(
                dictionary
                    .symbol_payout_instructions
            )

        textField.pivot.set(maximalWidth / 2, 0)
        textField.position.set(500, offsetY)
        this.addChild(textField)
    }

    generateSymbolsGroup({
        assets,
        ids = [
            [1, 2, 3],
            [4, 5, 6, 7],
            [8, 1, 2, 3, 4],
            [5, 6, 7, 8, 1],
            [2, 3, 4, 5],
            [6, 7, 8],
        ],
        winMap = [
            [0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0],
        ],
        isWinBoxVisible = true
    }) {
        const stepWidth = 150
        const stepHeight = 150
        const container = new Container
        for (let x = 0; x < REELS_COUNT; x++) {
            for (let y = 0; y < REELS_LENGTHS[x]; y++) {
                const id = ids[x][y]
                const isWildSymbol = id === WILD_SYMBOL_ID
                const isWinSymbol = winMap[x][y] || isWildSymbol

                if (isWildSymbol) {
                    const sprite = new Sprite(assets['safe'])
                    sprite.scale.set(0.85)
                    sprite.anchor.set(0.5)
                    sprite.position.set(x * stepWidth, (y + REELS_OFFSETS[x]) * stepHeight )
                    container.addChild(sprite)
                }


                const sprite = new Sprite(assets['symbol' + SYMBOLS_NAMES[id - 1]])
                sprite.anchor.set(0.5)
                sprite.position.set(x * stepWidth, (y + REELS_OFFSETS[x]) * stepHeight)
                container.addChild(sprite)


                sprite.alpha = isWinSymbol ? 1 : 0.2
                sprite.scale.set(isWinSymbol ? 0.7 : 0.65)


                if (isWinBoxVisible && isWinSymbol && !isWildSymbol) {
                    const winBoxOffsetY = id === 7 ? -25 : 0
                    const winBoxScale = id === 7 ? 0.65 : 0.7

                    const sprite = new Sprite(assets.win_box)
                    sprite.scale.set(winBoxScale)
                    sprite.tint = 0xFF0000
                    sprite.anchor.set(0.5)
                    sprite.position.set(x * stepWidth, (y + REELS_OFFSETS[x]) * stepHeight + winBoxOffsetY)
                    container.addChild(sprite)

                    this.winBoxesViews.push(sprite)
                }
            }
        }

        
        return container
    }

    async initGoldFramedFeature(assets, dictionary) {
        let offsetY = this.height + 150
        let maximalWidth = 1000
        let textField = new TextField({maximalWidth})
            .setFontName('default')
            .setAlignMiddle()
            .setAlignCenter()
            .setFontColor(0xf8ee89)
            .setFontSize(FONT_SIZE_HEADER)
            .setText(dictionary.gold_framed_symbols)

        textField.pivot.set(maximalWidth / 2, 0)
        textField.position.set(500, offsetY)
        this.addChild(textField)
        await awaitNextFrame()

        offsetY += textField.height + 200
        const offsetX = 125
        const symbolsGroupView = this.generateSymbolsGroup({
            assets,
            ids: [
                [1, 7, 2],
                [2, 1, 7, 4],
                [1, 4, 9, 1, 8],
                [8, 5, 5, 3, 8],
                [5, 4, 5, 4],
                [4, 8, 3],
            ],
            winMap: [
                [0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0],
            ],
        })

        this.addChild(symbolsGroupView)

        symbolsGroupView.position.set(offsetX, offsetY)

        offsetY += symbolsGroupView.height + 25


        maximalWidth = 900
        textField = new TextField({maximalWidth})
            .setFontName('default')
            .setCharactersPerLineCount(SYMBOLS_PER_LINE_COUNT)
            .setAlignTop()
            .setAlignLeft()
            .setFontColor(0xf8ee89)
            .setFontSize(FONT_SIZE_TEXT)
            .setText(
                dictionary
                    .gold_framed_symbols_instructions
                    
            )

        textField.pivot.set(maximalWidth / 2, 0)
        textField.position.set(500, offsetY)
        this.addChild(textField)
        await awaitNextFrame()
    }

    async initMultiplier(assets, dictionary) {
        let offsetY = this.height + 125
        let maximalWidth = 1000
        let textField = new TextField({maximalWidth})
            .setFontName('default')
            .setAlignMiddle()
            .setAlignCenter()
            .setFontColor(0xf8ee89)
            .setFontSize(FONT_SIZE_HEADER)
            .setText(dictionary.multiplier)

        textField.pivot.set(maximalWidth / 2, 0)
        textField.position.set(500, offsetY)
        this.multiplierHeaderView = this.addChild(textField)
        await awaitNextFrame()


        offsetY += textField.height + 150
        const view = new MultiplierView(assets)
        view.position.set(500, offsetY)
        view.scale.set(0.5)
        this.multiplierView = this.addChild(view)

        offsetY += 150
        maximalWidth = 900
        
        textField = new TextField({maximalWidth})
            .setFontName('default')
            .setCharactersPerLineCount(SYMBOLS_PER_LINE_COUNT)
            .setAlignTop()
            .setAlignLeft()
            .setFontColor(0xf8ee89)
            .setFontSize(FONT_SIZE_TEXT)
            .setText(
                dictionary
                    .multiplier_instructions
                    
            )


        textField.pivot.set(maximalWidth / 2, 0)
        textField.position.set(500, offsetY)
        this.addChild(textField)
        await awaitNextFrame()
        
    }

    async initFreeSpins(assets, dictionary) {
        let offsetY = this.height + 150
        let maximalWidth = 1000
        let textField = new TextField({maximalWidth})
            .setFontName('default')
            .setAlignMiddle()
            .setAlignCenter()
            .setFontColor(0xf8ee89)
            .setFontSize(FONT_SIZE_HEADER)
            .setText(dictionary.free_spins_feature)

        textField.pivot.set(maximalWidth / 2, 0)
        textField.position.set(500, offsetY)
        this.addChild(textField)
        await awaitNextFrame()

        offsetY += textField.height + 150

        for(let x = 0; x < 3; x++) {
            const sprite = new Sprite(assets.symbolScatter)
            sprite.anchor.set(0.5)
            sprite.scale.set(0.8)
            sprite.rotation = -0.3
            sprite.x = x * 200 + 300
            sprite.y = offsetY
            this.scattersViews.push(this.addChild(sprite))
        }

        offsetY += 150

        maximalWidth = 900
        textField = new TextField({maximalWidth})
            .setFontName('default')
            .setCharactersPerLineCount(SYMBOLS_PER_LINE_COUNT)
            .setAlignTop()
            .setAlignLeft()
            .setFontColor(0xf8ee89)
            .setFontSize(FONT_SIZE_TEXT)
            .setText(
                dictionary
                    .free_spins_feature_instructions
                    
            )

        textField.pivot.set(maximalWidth / 2, 0)
        textField.position.set(500, offsetY)
        this.addChild(textField)
        await awaitNextFrame()

    }

    async initMaximalWin(dictionary) {
        let offsetY = this.height + 150
        let maximalWidth = 1000
        let textField = new TextField({maximalWidth})
            .setFontName('default')
            .setAlignMiddle()
            .setAlignCenter()
            .setFontColor(0xf8ee89)
            .setFontSize(FONT_SIZE_HEADER)
            .setText(dictionary.maximal_win)

        textField.pivot.set(maximalWidth / 2, 0)
        textField.position.set(500, offsetY)
        this.addChild(textField)
        await awaitNextFrame()

        offsetY += textField.height * 1.5
        maximalWidth = 900
        textField = new TextField({maximalWidth})
            .setFontName('default')
            .setCharactersPerLineCount(SYMBOLS_PER_LINE_COUNT)
            .setAlignTop()
            .setAlignLeft()
            .setFontColor(0xf8ee89)
            .setFontSize(FONT_SIZE_TEXT)
            .setText(
                dictionary
                    .maximal_win_instructions
                    
            )

        textField.pivot.set(maximalWidth / 2, 0)
        textField.position.set(500, offsetY)
        this.maximalWinTextField = this.addChild(textField)
        await awaitNextFrame()
    }

    async init3600Ways(assets, dictionary) {
        let offsetY = this.height + 200
        let maximalWidth = 1000
        let textField = new TextField({maximalWidth})
            .setFontName('default')
            .setAlignMiddle()
            .setAlignCenter()
            .setFontColor(0xf8ee89)
            .setFontSize(FONT_SIZE_HEADER)
            .setText(dictionary.win_3600_ways)

        textField.pivot.set(maximalWidth / 2, 0)
        textField.position.set(500, offsetY)
        this.addChild(textField)
        await awaitNextFrame()

        offsetY += textField.height * 1.5
        maximalWidth = 900
        textField = new TextField({maximalWidth})
            .setFontName('default')
            .setCharactersPerLineCount(SYMBOLS_PER_LINE_COUNT)
            .setAlignTop()
            .setAlignLeft()
            .setFontColor(0xf8ee89)
            .setFontSize(FONT_SIZE_TEXT)
            .setText(
                dictionary
                    .win_3600_ways_instructions
                    
            )

        textField.pivot.set(maximalWidth / 2, 0)
        textField.position.set(500, offsetY)
        this.addChild(textField)
        await awaitNextFrame()

        offsetY = this.height + 150
        let symbolsGroupView = this
            .generateSymbolsGroup({
                assets,
                ids: [
                    [1, 1, 2],
                    [3, 1, 4, 1],
                    [1, 1, 5, 6, 2],
                    [8, 5, 4, 2, 3],
                    [7, 6, 8, 2],
                    [2, 3, 5],
                ],
                winMap: [
                    [1, 1, 0],
                    [0, 1, 0, 1],
                    [1, 1, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0],
                ],
            })
        symbolsGroupView.scale.set(0.45)
        symbolsGroupView.position.set(100, offsetY)
        this.addChild(symbolsGroupView)

        symbolsGroupView = this
            .generateSymbolsGroup({
                assets,
                ids: [
                    [5, 8, 2],
                    [4, 1, 5, 1],
                    [1, 1, 4, 3, 3],
                    [5, 1, 1, 2, 7],
                    [6, 7, 8, 2],
                    [3, 2, 6],
                ],
                winMap: [
                    [0, 0, 0],
                    [0, 1, 0, 1],
                    [1, 1, 0, 0, 0],
                    [0, 1, 1, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0],
                ],
                isWinBoxVisible: false
            })
        symbolsGroupView.scale.set(0.45)
        symbolsGroupView.position.set(575, offsetY)

        this.addChild(symbolsGroupView)
        offsetY = this.height + 100

        maximalWidth = 400
        textField = new TextField({maximalWidth})
            .setFontName('default')
            .setAlignTop()
            .setAlignCenter()
            .setFontColor(0xFFFF00)
            .setFontSize(FONT_SIZE_SUB_HEADER)
            .setText(dictionary.win)

        textField.pivot.set(maximalWidth / 2, 0)
        textField.position.set(275, offsetY)
        this.addChild(textField)
        await awaitNextFrame()

        textField = new TextField({maximalWidth})
            .setFontName('default')
            .setAlignTop()
            .setAlignCenter()
            .setFontColor(0x555555)
            .setFontSize(FONT_SIZE_SUB_HEADER)
            .setText(dictionary.no_win)
        textField.pivot.set(maximalWidth / 2, 0)
        textField.position.set(750, offsetY)
        this.addChild(textField)
        await awaitNextFrame()


        offsetY += 150
        maximalWidth = 900
        textField = new TextField({maximalWidth})
            .setFontName('default')
            .setCharactersPerLineCount(SYMBOLS_PER_LINE_COUNT)
            .setAlignTop()
            .setAlignLeft()
            .setFontColor(0xf8ee89)
            .setFontSize(FONT_SIZE_TEXT)
            .setText(
                dictionary
                    .win_3600_ways_instructions_part_2
                    
            )

        textField.pivot.set(maximalWidth / 2, 0)
        textField.position.set(500, offsetY)
        this.addChild(textField)
        await awaitNextFrame()

        offsetY = this.height + 150
        maximalWidth = 900
        textField = new TextField({maximalWidth})
            .setFontName('default')
            .setAlignBottom()
            .setAlignCenter()
            .setFontColor(0xf8ee89)
            .setFontSize(FONT_SIZE_SUB_HEADER)
            .setText(dictionary.win_3600_ways_example)

        textField.pivot.set(maximalWidth / 2, 0)
        textField.position.set(500, offsetY)
        this.addChild(textField)
        await awaitNextFrame()

        offsetY += 150

        
        const infoBarView = new InfoBarView({assets, dictionary, isLTRTextDirection: this.isLTRTextDirection})
        this.addChild(infoBarView)
        infoBarView.scale.set(0.8)
        infoBarView.position.set(500, offsetY)
        this.infoBarView = infoBarView

        offsetY += 150

        maximalWidth = 900
        textField = new TextField({maximalWidth})
            .setFontName('default')
            .setCharactersPerLineCount(SYMBOLS_PER_LINE_COUNT)
            .setAlignTop()
            .setAlignLeft()
            .setFontColor(0xf8ee89)
            .setFontSize(FONT_SIZE_TEXT)
            .setText(
                dictionary
                    .win_3600_ways_instructions_part_3
                    
            )

        textField.pivot.set(maximalWidth / 2, 0)
        textField.position.set(500, offsetY)
        this.addChild(textField)
        await awaitNextFrame()
    }

    refresh({bet, currencyCode = ''}) {
        if(this.bet === bet && this.currencyCode === currencyCode) return
        const finalBet =  bet || 1

        this.bet = finalBet

        this.currencyCode = currencyCode

        const {
            payoutsTextFields,
            dictionary,
            coefficients,
            infoBarView,
            isLTRTextDirection,
        } = this
        
        payoutsTextFields.forEach((textField, id) => {
            let text = ''
            
            if (isLTRTextDirection) {
                for(let i = 6; i >= 3; i--) {
                    const payout = formatMoney({
                        value: finalBet * (coefficients[id + 1]?.[i] ?? 0),
                    })

                    if (isLTRTextDirection) {
                        text += i + 'x: ' + payout
                    } else {
                        text += payout + ' :x' + i
                    }

                    if(i > 3) {
                        text += '\n'
                    }
                }
            } else {
                for(let i = 3; i <= 6; i++) {
                    const payout = formatMoney({
                        value: finalBet * (coefficients[id + 1]?.[i] ?? 0),
                    })

                    if (isLTRTextDirection) {
                        text += i + 'x: ' + payout
                    } else {
                        text += payout + ' :x' + i
                    }

                    if(i < 6) {
                        text += '\n'
                    }
                }
            }

            textField.setText(text)
        })

        payoutsTextFields[8].setText(dictionary.wild)
        payoutsTextFields[9].setText(dictionary.scatter)

        this.maximalWinTextField.setText(
            this.dictionary
                .maximal_win_instructions
                
                .split('{PAYOUT}').join(
                    formatMoney({
                        value: this.bet * 5000,
                        currencyCode,
                        isLTRTextDirection
                    }))
        )

        infoBarView.presentPayout({
            collapses: [
                {symbolId: 1, symbolsCount: 2},
                {symbolId: 1, symbolsCount: 2},
                {symbolId: 1, symbolsCount: 2},
            ],
            multiplier: 1,
            payout: 8 * finalBet * coefficients[1][3],
            currencyCode
        })

        infoBarView.fadeTimeline.wind(1)
        infoBarView.timeline.wind(1)
    }
}