import { Container, Sprite } from "pixi.js";
import {Timeline} from '../../../timeline/Timeline'
import { brightnessToHexColor, colorToColor } from "../../GraphicalPrimitives";
import { GUIView } from "../GUIView";

export class ButtonView extends Container {
    contentContainer
    timeline = new Timeline
    audio

    constructor(assets, audio) {
        super()

        this.audio = audio
        this.initContainers()
        this.initBody(assets) 
        this.initIcon(assets)

        this.setupInteractionListeners()
        this.setInteractive()
    }

    setupInteractionListeners() {
        this.addEventListener('pointerdown', () => {
            GUIView.isOverlayInteraction = true

            if(!this.isResponsive) return
            this.onClick()
            this.presentClick()
        })

        this.addEventListener('pointerup', () => { GUIView.isOverlayInteraction = false })
        this.addEventListener('pointerleave', () => { GUIView.isOverlayInteraction = false })
        this.addEventListener('pointercancel', () => { GUIView.isOverlayInteraction = false })
        this.addEventListener('pointerout', () => { GUIView.isOverlayInteraction = false })
        this.addEventListener('pointerupoutside', () => { GUIView.isOverlayInteraction = false })
    }

    initContainers() {
        this.contentContainer = this.addChild(new Container)
        this.bodyContainer = this.contentContainer.addChild(new Container)
        this.iconContainer = this.contentContainer.addChild(new Container)
    }

    initBody(assets) {
        const sprite = new Sprite(assets.buttonFace)
        sprite.anchor.set(0.5)
        sprite.tint = 0xFF0000
        this.bodyContainer.addChild(sprite)
        this.bodyView = sprite
    }

    initIcon(assets) {
        const sprite = new Sprite(assets.iconClose)
        sprite.anchor.set(0.5)
        sprite.scale.set(0.9)
        this.iconView = sprite
        this.iconContainer.addChild(sprite)
    }

    presentClick() {
        this.audio.presentClick()
        this.timeline
            .deleteAllAnimations()
            .addAnimation({
                duration: 150,
                onProgress: progress => {
                    this.presentPress(progress)
                }
            })
            .play()
    }

    presentPress(progress) {
        const subProgress = Math.sin(Math.PI * progress)

        this.contentContainer.scale.set(1 - 0.35 * subProgress)
        this.iconView.alpha = 1 - subProgress
        //this.iconView.tint = colorToColor(255, 255, 255, 255, 255, 0, Math.min(1, subProgress * 2))
        //this.bodyView.tint = brightnessToHexColor(1 - subProgress * 0.75)
    }

    setInteractive(isInteractive = true) {
        this.eventMode = 'static'// isInteractive ? 'static' : 'none'
        // this.cursor = isInteractive ? 'pointer' : 'default'
        this.iconContainer.alpha = isInteractive ? 1 : 0.25
        this.iconView.tint = isInteractive ? 0xFFFFFF : 0xFFFF00

        this.isResponsive = isInteractive
    }

    onClick() {

    }
}