import { Sprite } from "pixi.js"
import { ButtonView } from "./ButtonView"


export class ButtonAudioView extends ButtonView {
    isAudioReadyToPlay = false
    isMuted = true
    
    constructor(assets, audio) {
        super(assets, audio)

        this.setMuted(this.audio.isMuted)
        audio.onCookieMuteStateRecovered = (isMuted) => {
            this.setMuted(isMuted)
        }

        if (audio.isReadyToPlay) {
            this.onAudioReady()
        }
    }

    initIcon(assets) {
        this.iconsViews = [
            'Unmute',
            'Loading',
            'Mute',
        ].map(name => {
            const sprite = new Sprite(assets['iconAudio' + name])
            sprite.anchor.set(0.5)
            sprite.scale.set(1.15)
            this.iconView = sprite
            this.iconView.visible = false
            return this.iconContainer.addChild(sprite)
        })

        this.iconUnmutedView = this.iconsViews[0]
        this.iconLoadingView = this.iconsViews[1]
        this.iconMutedView = this.iconsViews[2]
    }

    setMuted(isMuted = true) {
        this.isMuted = isMuted
        this.updateIcon()
    }

    updateIcon() {
        this.iconView.visible = false

        if (this.isMuted) {
            this.iconView = this.iconMutedView
        } else {
            this.iconView = this.isAudioReadyToPlay
                ? this.iconUnmutedView
                : this.iconLoadingView
        }

        this.iconView.visible = true
    }

    onAudioReady() {
        this.isAudioReadyToPlay = true
        this.setMuted(this.isMuted) 
    }   
}