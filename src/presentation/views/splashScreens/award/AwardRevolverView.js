import { Container, Sprite } from "pixi.js";
import { Timeline } from "../../../timeline/Timeline";
import { brightnessToHexColor } from "../../GraphicalPrimitives";

export class AwardRevolverView extends Container {
    flashView
    backSparklesViews
    distortionContainer
    triggerView
    hammerView
    hammerFlashView
    baseView
    handleView
    drumSectionsViews
    audio
    progress

    
    constructor({assets, vfxLevel, audio}) {
        super()

        this.audio = audio
        this.initFlash(assets)
        this.initDistortionContainer()
        this.initTrigger(assets)
        this.initHammer(assets)
        this.initHammerFlash(assets)
        this.initBackSparkles(assets, vfxLevel)
        this.initBase(assets)
        this.initDrum(assets)
        this.initHandle(assets)
    }

    initFlash(assets) {
        const sprite = new Sprite(assets.award_revolver_flash)
        sprite.anchor.set(0.05, 0.5)
        sprite.position.set(750, -95)
        this.flashView = this.addChild(sprite)
    }

    initBackSparkles(assets, vfxLevel) {
        if(vfxLevel < 0.15) return

        this.backSparklesViews = new Array(5)
            .fill(1)
            .map(() => {
                const sprite = new Sprite(assets.award_revolver_sparkle)
                sprite.anchor.set(0.85, 0.5)

                return this.distortionContainer.addChild(sprite)
            })
    }

    initDistortionContainer() {
        const container = this.addChild(new Container())
        this.distortionContainer = container
    }

    initTrigger(assets) {
        const sprite = new Sprite(assets.award_revolver_trigger)
        sprite.anchor.set(0.1, 0.5)
        sprite.position.set(10, 50)
        sprite.rotation = 1.25

        this.triggerView = this
            .distortionContainer
            .addChild(sprite)
    }

    initHammer(assets) {
        const sprite = new Sprite(assets.award_revolver_hammer)
        sprite.anchor.set(0.9)
        sprite.position.set(-40, -30)

        this.hammerView = this
            .distortionContainer
            .addChild(sprite)
    }

    initHammerFlash(assets) {
        const sprite = new Sprite(assets.award_revolver_flash)
        sprite.anchor.set(0.05, 0.5)
        sprite.rotation = -3.5
        sprite.position.set(0, -100)

        this.hammerFlashView = this
            .distortionContainer
            .addChild(sprite)
    }

    initBase(assets) {
        const sprite = new Sprite(assets.award_revolver_base)
        sprite.anchor.set(0.2, 0.5)
        sprite.rotation = -0.25

        this.baseView = this
            .distortionContainer
            .addChild(sprite)
    }

    initHandle(assets) {
        const sprite = new Sprite(assets.award_revolver_handle)
        sprite.anchor.set(0.5)
        sprite.rotation = 0.45
        sprite.position.set(-90, 75)

        this.handleView = this
            .distortionContainer
            .addChild(sprite)
    }

    initDrum(assets) {
        this.drumSectionsViews = new Array(5)
            .fill(0)
            .map(_ => {
                const sprite = new Sprite(assets.award_revolver_drum_section)
                sprite.anchor.set(0.5)
                sprite.x = 90

                return this
                    .distortionContainer
                    .addChild(sprite)
            })   
    }

    present(progress) {
        this.progress = progress
        const drumProgress = Math.min(1, progress * 1.5) ** 5 * 0.2

        this.drumSectionsViews.forEach((view, i) => {
            const shiftedProgress = (drumProgress +  i * 0.2) % 1
            const angle = Math.PI * shiftedProgress
            const sin = Math.sin(angle)

            view.y =  - 45 + 65 * Math.sin(Math.PI * (shiftedProgress - 0.5 ))
            view.scale.y = sin
            view.tint = brightnessToHexColor(sin)
        })

        const {triggerView} = this
        const triggerProgress = Math.sin(Math.PI * progress ** 3)
        triggerView.x = 20 - 25 * triggerProgress

        const {hammerView} = this
        const hammerProgress = 1 - Math.sin(Math.PI * Math.min(1, progress * 1.5) ** 5)
        hammerView.rotation =  1 * hammerProgress

        const {flashView, hammerFlashView} = this
        const flashProgress =  Math.sin(Math.PI *  Math.max(0, (progress - 0.6) / 0.4 )) ** 5
        flashView.scale.set(flashProgress * 4)
        hammerFlashView.scale.set(flashProgress * 1.5)

        const {distortionContainer} = this
        distortionContainer.x = -50 * flashProgress


        const sparklesProgress = Math.max(0, (progress - 0.7) / 0.3 )
        this.backSparklesViews?.forEach((view, i) => {
            const shiftedProgress = (sparklesProgress + 0.1 * i) % 1 * sparklesProgress
            const angle = i * 0.5 * shiftedProgress - 0.5
            const distance = 500 * shiftedProgress
            const scale = Math.min(1, Math.sin(Math.PI * shiftedProgress) * 2) * 0.75
            view.scale.set( -scale, scale )
            view.rotation = -angle
            view.position.set(
                -50 - distance * Math.cos(angle),
                -125 + distance * Math.sin(angle)
            )
        })
    }
}