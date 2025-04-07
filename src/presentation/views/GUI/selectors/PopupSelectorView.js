import { Sprite } from "pixi.js";
import { AdaptiveContainer } from "../../adaptiveDesign/AdaptiveContainer";
import { ReelSelectorView } from './ReelSelectorView'
import { TextField } from "../../text/TextField";

export class PopupSelectorView extends AdaptiveContainer {
    reelSelectorView
    headerView
    hintView
    dictionary
    isLTRTextDirection

    offsetTop = 0
    offsetBottom = 0

    constructor({assets, dictionary, isLTRTextDirection, isDynamicCharacterSet}) {
        super()

        this.isLTRTextDirection = isLTRTextDirection
        this.dictionary = dictionary

        this.setTargetArea({x: 0, y: 0.20 * 0.9, width: 1, height: 0.6 * 0.9})
            .setSourceArea({width: 1000, height: 1000})

        this.initReelSelector(assets, isDynamicCharacterSet)
        this.initTexts(dictionary)

        this.alpha = 0
        this.visible = false
    }

    setLocked(isLocked = true) {
        this.reelSelectorView.setLocked(isLocked)
    }

    initReelSelector(assets, isDynamicCharacterSet) {
        const view = new ReelSelectorView(assets, isDynamicCharacterSet)
        view.position.set(500, 290)
        view.scale.set(2.5)
        view.onOptionSelected = (option, index) => {
            this.onOptionSelected?.(option, index)
        }

        this.reelSelectorView = this.addChild(view)
    }

    initTexts(dictionary) {
        // HEADER...
        let maximalWidth = 800
        let maximalHeight = 100
        let textField = new TextField({maximalWidth, maximalHeight})
            .setFontName('default')
            .setAlignMiddle()
            .setAlignCenter()
            .setFontColor(0xf8ee89)
            .setFontSize(maximalHeight)
            // .highlightArea()

        textField.pivot.set(maximalWidth / 2, maximalHeight / 2)
        textField.position.set(500, 50)
        this.headerView = this.addChild(textField)
        // ...HEADER


        // HINT...
        maximalWidth = 800
        maximalHeight = 50
        textField = new TextField({maximalWidth, maximalHeight})
            .setFontName('default')
            .setAlignMiddle()
            .setAlignCenter()
            .setFontColor(0xf8ee89)
            .setFontSize(maximalHeight * 0.9)
            // .highlightArea()

        textField.pivot.set(maximalWidth / 2, maximalHeight / 2)
        textField.position.set(500, 125)
        this.hintView = this.addChild(textField)
        // ...HINT
    }

    setSelectableOptions(options) {
        this.reelSelectorView.setSelectableOptions(options)
    }

    getSelectedOptionIndex() {
        return this.reelSelectorView.selectedOptionIndex
    }

    forceSelect({optionIndex, dropUserInput}) {
        this.reelSelectorView.forceSelect({optionIndex, dropUserInput})
    }

    onOverlayClick() {

    }

    canBeDismissed() {
        return true
    }

    updateTargetArea(sidesRatio) {
        const {offsetTop, offsetBottom} = this
        if (sidesRatio > 1) {
            this.setTargetArea({x: 0, y: 0.075 * 0.9 + offsetTop, width: 1, height: 0.8 * 0.9 - offsetBottom - offsetTop})
        } else {
            this.setTargetArea({x: 0, y: 0.20 * 0.9 + offsetTop, width: 1, height: 0.6 * 0.9 - offsetBottom - offsetTop})
        }
    }

    setAdaptiveDesignOffsets({offsetTop = 0, offsetBottom = 0}) {
        this.offsetTop = offsetTop
        this.offsetBottom = offsetBottom
        this.onResize()
    }
}