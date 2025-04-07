import { formatMoney } from "../../../../Utils";
import { PopupSelectorView } from "../PopupSelectorView";
import { KeyboardView } from "./KeyboardView";
import { MinMaxButtonsGroupView } from "./MinMaxButtonsGroupView";

export class BetSelectorView extends PopupSelectorView {
    buttonEraseView
    minimalBet
    maximalBet
    currencyCode
    selectedBet

    constructor({assets, dictionary, currencyCode, isLTRTextDirection, audio}) {
        super({assets, dictionary, isLTRTextDirection})
        this.currencyCode = currencyCode
        this.initMinMaxButtonsGroup({assets, dictionary, audio})
        this.initKeyboard(assets, audio)

        this.reelSelectorView.onUserInputTooSmall = () => this.onUserInputTooSmall()
        this.reelSelectorView.onUserInputTooBig = () => this.onUserInputTooBig()
        this.reelSelectorView.onUserInputIsValid = (value) => this.onUserInputIsValid(value)
        this.reelSelectorView.onEditableStateChange = (isEditable) => this.onEditableStateChange(isEditable)
        this.reelSelectorView.onSelectableOptionsUpdated = () => {this.selectedBet = undefined}
        this.reelSelectorView.getEditablePreset = () => {return this.selectedBet}
    }
    
    initTexts(dictionary) {
        super.initTexts(dictionary)
        this.headerView.setText(dictionary.set_your_bet)
        this.hintView.setText(dictionary.slide_or_tap)
        this.headerView.y = 0
        this.hintView.y = 75
    }

    initReelSelector(assets) {
        super.initReelSelector(assets, false)

        this.reelSelectorView.formatOptions = (options) => {
            return options.map(value => formatMoney({value}) )
        }
    }

    initMinMaxButtonsGroup({assets, dictionary, audio}) {
        const view = new MinMaxButtonsGroupView({assets, dictionary, audio})
        view.onMinimalBetRequested = () => this.onMinimalBetRequested?.()
        view.onMaximalBetRequested = () => this.onMaximalBetRequested?.()
        view.x = 500
        view.y = 200
        this.minMaxButtonsGroupView = this.addChild(view)
    }

    initKeyboard(assets, audio) {
        const {reelSelectorView} = this
        const view = new KeyboardView(assets, audio)
        view.visible = false
        view.scale.set(1.15)
        view.x = 200
        view.y = 950
        this.keyboardView = this.addChild(view)

        view.onInput = (key) => reelSelectorView.onKeyboardInput(key)
        view.onBackspace = () => reelSelectorView.onKeyboardInput('Backspace')
        view.onDoubleUp = () => reelSelectorView.onDoubleUp()
        view.onDoubleDown = () => reelSelectorView.onDoubleDown()
    }

    onOverlayClick() {
        this.reelSelectorView.setEditable(false)
    }

    setBetLimits(minimalBet, maximalBet) {
        this.minimalBet = minimalBet
        this.maximalBet = maximalBet

        this.reelSelectorView.minimalValue = minimalBet
        this.reelSelectorView.maximalValue = maximalBet
    }

    canBeDismissed() {
        return !this.reelSelectorView.isEditable
    }

    onUserInputTooSmall() {
        const {currencyCode, isLTRTextDirection} = this
        const text = this
            .dictionary
            .minimal_bet_is
            .replace(
                '{BET}',
                formatMoney({
                    value: this.minimalBet,
                    currencyCode,
                    isLTRTextDirection
                })
            )
        this.hintView.setFontColor(0xFF0000)
        this.hintView.setText(text)
        this.onUserInputIsInvalid?.()
        this.onSelectedBetIsTooSmall?.()
    }

    onUserInputTooBig() {   
        const {currencyCode, isLTRTextDirection} = this
        const text = this
            .dictionary
            .maximal_bet_is
            .replace(
                '{BET}',
                formatMoney({
                    value: this.maximalBet,
                    currencyCode,
                    isLTRTextDirection
                })
            )
        this.hintView.setFontColor(0xFF0000)
        this.hintView.setText(text)
        this.onUserInputIsInvalid?.()
        this.onSelectedBetIsTooBig?.()
    }

    onUserInputIsValid(value) {
        this.hintView.setFontColor(0xf8ee89)
        this.hintView.setText(this.dictionary.slide_or_tap)
        this.selectedBet = value
    }

    onEditableStateChange(isEditable) {
        this.keyboardView.setVisible(isEditable)
        this.infoBarView?.setVisible(!isEditable)
        this.minMaxButtonsGroupView.setVisible(!isEditable)
    }

    setInteractive({
        isMaximalBetButtonInteractive = true,
        isMinimalBetButtonInteractive = true,
    }) {

        this.minMaxButtonsGroupView.setInteractive({
            isMaximalBetButtonInteractive,
            isMinimalBetButtonInteractive
        })
    }
}