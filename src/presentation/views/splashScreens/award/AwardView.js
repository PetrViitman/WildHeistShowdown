import { Container, Sprite } from "pixi.js";
import { AwardRevolverView } from "./AwardRevolverView";
import { SubstitutionEffectView } from "../../reels/cell/safe/SubstitutionEffectView";
import { AwardCoinsPoolView } from "./AwardCoinsPoolView";
import { colorToColor } from "../../GraphicalPrimitives";

export class AwardView extends Container {
    contentContainer
    substitutionEffectContainer
    substitutionEffectsViews
    revolversContainer
    revolversViews
    ribbonsViews
    coinsPoolView
    audio

    progress

    
    constructor({assets, vfxLevel, audio}) {
        super()
        this.audio = audio
        this.initContainers()
        this.initSubstitutionEffect(assets, vfxLevel)
        this.initRevolvers(assets, vfxLevel)
        this.initRibbons(assets)
        this.initCoins(assets, vfxLevel)
    }

    initContainers() {
        this.contentContainer = this.addChild(new Container)
        this.revolversContainer = this
            .contentContainer
            .addChild(new Container)

        this.ribbonsContainer = this
            .contentContainer
            .addChild(new Container)

        this.ribbonsContainer.y = 300
    }

    initSubstitutionEffect(assets, vfxLevel){
        const container = this.contentContainer.addChildAt(new Container, 1)
        const isHighVFXLevel = vfxLevel >= 0.15
        const descriptors = [
            {
                scale: isHighVFXLevel ? 1 : 0.45,
                color: isHighVFXLevel ? 0xFF5500 : 0xFFFFFF
            },
        ]

        if (isHighVFXLevel) {
            descriptors.push({
                scale: 0.45,
                color: 0xFFFF00
            })
        }

        this.substitutionEffectsViews = descriptors.map(({scale, color}) => {
            const view = new SubstitutionEffectView(assets)
            view.scale.set(scale)
            view.setColor(color)
            return container.addChild(view)
        })

        container.y = 125
        container.scale.set(2)
        this.substitutionEffectContainer = container
    }

    initRevolvers(assets, vfxLevel) {
        this.revolversViews = [
            {
                x: -200,
            },
            {
                x: 200,
                scaleX: -1
            }
        ].map(({
            x,
            scaleX = 1
        }) => {
            const view = new AwardRevolverView({assets, vfxLevel})
            view.scale.x = scaleX
            view.x = x
            view.rotation = -0.45 * scaleX

            return this
                .revolversContainer
                .addChild(view)
        })
    }

    initRibbons(assets) {
        this.ribbonsMap = {}
        this.ribbonsViews = [
            'big',
            'huge',
            'mega',
            'bonus',
        ].map((name) => {
            const sprite = new Sprite(assets['award_' + name])
            sprite.anchor.set(0.5, 0.75)
            this.ribbonsMap[name] = sprite

            return this.ribbonsContainer.addChild(sprite)
        })
    }

    initCoins(assets, vfxLevel) {
        if(vfxLevel < 0.15) return

        this.coinsPoolView = this.contentContainer.addChild(new AwardCoinsPoolView(assets))
        this.coinsPoolView.y = 125
    }

    setIdleProgress(progress) {
        const {revolversContainer, ribbonsContainer} = this
        const revolversProgress = (progress * 2) % 1

        this.substitutionEffectsViews.forEach(view => view.setProgress(revolversProgress))

        this.revolversViews.forEach((view, i) => {
            const shiftedProgress = (revolversProgress + i * 0.5) % 1
            if(shiftedProgress > 0.15 && view.progress <= 0.15) {
                this.audio.presentBigWinShot()
            }
            view.present(shiftedProgress)
            
        })


        revolversContainer.scale.set(1 + 0.1 * Math.sin(Math.PI * 2 * progress))
        ribbonsContainer.scale.x = 1 + 0.025 * Math.sin(Math.PI * 4 * progress)
        ribbonsContainer.skew.x = 0.025 * Math.sin(Math.PI * 2 * progress)

        this.coinsPoolView?.present(revolversProgress)
        this.substitutionEffectContainer.scale.set(1.5 + 0.75 * Math.sin(Math.PI * revolversProgress))
    }

    presentTransition(progress) {
        const subProgress = Math.sin(Math.PI * progress)
        const regress = 1 - progress

        this.contentContainer.scale.set(1 + 0.25 * subProgress)

        this.ribbonsContainer.y = 300 + 350 * regress ** 2
        this.ribbonsContainer.alpha = progress

        this.substitutionEffectsViews[0].scale.set(1 + 0.55 * regress ** 3)
        this.substitutionEffectsViews[1]?.scale.set(0.45 + 0.75 * regress ** 3)
    }

    setSkin(name) {
        this.setRibbonColor()
        this.presentTransition(1)
        this.ribbonsViews.forEach(view => view.visible = false)
        this.ribbonsMap[name].visible = true
    }

    setChipsMode(isChipsMode) {
        this.coinsPoolView?.setChipsMode(isChipsMode)
    }

    setRibbonColor(color = 0xFFFFFF) {
        this.ribbonsViews.forEach(view => {
            view.tint = color
        })
    }
}