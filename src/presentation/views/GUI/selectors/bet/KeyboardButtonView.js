import { TextField } from "../../../text/TextField";
import { ButtonView } from "../../buttons/ButtonView";

export class KeyboardButtonView extends ButtonView {
    character

    constructor({
        character = '-',
        assets,
        audio
    }) {
        super(assets, audio)

        this.character = character
        this.textField.setText(character)
    }


    initIcon() {
        const maximalWidth = 150
        const maximalHeight = 150
        const textField = new TextField({
            maximalWidth,
            maximalHeight,
            isDynamicCharacterSet: false
        })
            .setFontName('default')
            .setFontSize(maximalHeight)
            .setFontColor(0xf8ee89)
            .setAlignCenter()
            .setAlignMiddle()

        textField.pivot.set(maximalWidth / 2, maximalHeight / 2)
        textField.x = 10
        this.textField = this.iconContainer.addChild(textField)
        this.iconView = textField
    }
}