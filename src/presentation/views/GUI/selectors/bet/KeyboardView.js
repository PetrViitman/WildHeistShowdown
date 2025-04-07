import { Container, Sprite } from "pixi.js";
import { KeyboardButtonView } from "./KeyboardButtonView";
import { ButtonEraseView } from "./ButtonEraseView";
import { Timeline } from "../../../../timeline/Timeline";
import { GUIView } from "../../GUIView";

export class KeyboardView extends Container {
    buttonsViews
    timeline = new Timeline
    
    constructor(assets, audio) {
        super()

        this.initBackground(assets)
        this.initButtons(assets, audio)
        this.alpha = 0
    }

    initBackground(assets) {
        const sprite = new Sprite(assets.rectangle)
        sprite.alpha = 0.0001
        sprite.position.set(-75, -100)
        sprite.width = 700
        sprite.height = 300
        sprite.eventMode = 'static'
        this.addChild(sprite)

        sprite.addEventListener('pointerdown', () => {
            GUIView.isOverlayInteraction = true
        })

        sprite.addEventListener('pointerup', () => { GUIView.isOverlayInteraction = false })
        sprite.addEventListener('pointerleave', () => { GUIView.isOverlayInteraction = false })
        sprite.addEventListener('pointercancel', () => { GUIView.isOverlayInteraction = false })
        sprite.addEventListener('pointerout', () => { GUIView.isOverlayInteraction = false })
        sprite.addEventListener('pointerupoutside', () => { GUIView.isOverlayInteraction = false })
    }

    initButtons(assets, audio) {
        const offsetX = 100
        this.buttonsViews = '12345'.split('').map((character, i) => {
            const view = new KeyboardButtonView({assets, character, audio})
            view.x = offsetX * i
            view.scale.set(0.5)
            view.onClick = () => {this.onInput?.(view.character)}

            return this.addChild(view)
        })

        this.buttonsViews = '67890.'.split('').map((character, i) => {
            const view = new KeyboardButtonView({assets, character, audio})
            view.x = offsetX * i + offsetX / 2
            view.y = offsetX
            view.scale.set(0.5)
            view.onClick = () => {this.onInput?.(view.character)}

            return this.addChild(view)
        })

        let view = new ButtonEraseView(assets, audio)
        view.position.set(525, -25)
        view.scale.set(0.6)
        view.onClick = () =>  this.onBackspace?.()
        this.buttonEraseView = this.addChild(view)

        view = new KeyboardButtonView({assets, character: '½', audio})
        view.position.set(545, -280)
        view.scale.set(0.5)
        view.onClick = () => this.onDoubleDown?.()
        this.buttonDoubleDownView = this.addChild(view)

        view = new KeyboardButtonView({assets, character: ' x2 ', audio})
        view.position.set(545, -380)
        view.scale.set(0.5)
        view.onClick = () => this.onDoubleUp?.()
        this.buttonDoubleUpView = this.addChild(view)
    }

    setVisible(isVisible) {
        this.timeline
            .deleteAllAnimations()
            .addAnimation({
                duration: 100,
                onProgress: progress => {
                    this.alpha = isVisible
                        ? Math.max(this.alpha, progress)
                        : Math.min(this.alpha, 1 - progress)
                    this.visible = this.alpha > 0
                }
            })
            .play()
    } 
}