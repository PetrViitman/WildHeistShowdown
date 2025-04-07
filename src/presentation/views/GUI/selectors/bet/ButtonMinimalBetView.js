import { Sprite } from "pixi.js"
import { ButtonView } from "../../buttons/ButtonView"
import { TextField } from "../../../text/TextField"

export class ButtonMinimalBetView extends ButtonView{
    constructor({assets, dictionary, audio}) {
        super(assets, audio)

        this.iconView.setText(dictionary.minimal_bet)
    }

    
    initBody(assets) {
        const sprite = new Sprite(assets.buttonBarFace)
        sprite.anchor.set(0.5)
        this.bodyContainer.addChild(sprite)
        this.bodyView = sprite
    }


    initIcon() {
        const maximalWidth = 340
        const maximalHeight = 90

        const textField = new TextField({maximalWidth, maximalHeight})
            .setFontName('default')
            .setFontSize(maximalHeight * 0.65)
            .setFontColor(0xf8ee89)
            .setAlignCenter()
            .setAlignMiddle()

        textField.pivot.set(maximalWidth / 2, maximalHeight / 2)
        this.iconView = this.iconContainer.addChild(textField)
    }
}