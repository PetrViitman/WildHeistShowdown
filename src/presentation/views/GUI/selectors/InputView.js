import { Container, Sprite } from "pixi.js";
import { TextField } from "../../text/TextField";

export class InputView extends Container {
    constructor(assets) {
        super()

        this.initPanel(assets)
        this.initTextField()
        this.initButton(assets)
    }

    initPanel(assets) {
        const sprite = new Sprite(assets.indicatorPanel)
        sprite.anchor.set(0.5)

        sprite.tint = 0x000000
        sprite.alpha = 0.6

        this.panelView = this.addChildAt(sprite, 0)
    }

    initTextField() {
        const maximalWidth = 290
        const maximalHeight = 80
        const textField = new TextField({maximalWidth, maximalHeight})
            .setFontName('default')
            .setText('123456789')
            .setAlignMiddle()
            .setAlignCenter()
            .setFontColor(0xf8ee89)
            .setFontSize(maximalHeight * 0.75)

        textField.x = 48
        textField.pivot.set(maximalWidth / 2, maximalHeight / 2)

        this.textField = this.addChild(textField)
    }

    initButton(assets) {

    }
}