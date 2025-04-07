import { Sprite } from "pixi.js"
import { ButtonView } from "./ButtonView"

export class ButtonFullScreenView extends ButtonView {
    initIcon(assets) {
        this.iconsViews = ['iconFullScreen', 'iconMinimizeScreen'].map(name => {
            const sprite = new Sprite(assets[name])
            sprite.anchor.set(0.5)
            sprite.scale.set(1.25)
            sprite.visible = false
            this.iconContainer.addChild(sprite)

            return sprite
        })

        this.iconView = this.iconsViews[0]
    }


    setFullscreenMode(isFullscreenMode = true) {
        this.iconView.visible = false
        const iconView = this.iconsViews[isFullscreenMode ? 1 : 0]
        iconView.visible = true
        iconView.scale.set(1.25)
        iconView.alpha = 1
        this.iconView = iconView
    }

    presentPress(progress) {
        const subProgress = Math.sin(Math.PI * progress)

        this.contentContainer.scale.set(1 - 0.35 * subProgress)
    }
}