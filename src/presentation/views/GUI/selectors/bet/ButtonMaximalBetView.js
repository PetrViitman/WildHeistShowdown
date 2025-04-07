import { ButtonMinimalBetView } from "./ButtonMinimalBetView"

export class ButtonMaximalBetView extends ButtonMinimalBetView {
    constructor({assets, dictionary, audio}) {
        super({assets, dictionary, audio})

        this.iconView.setText(dictionary.maximal_bet)
    }
}