import { Sprite } from "pixi.js"
import { Timeline } from "../../timeline/Timeline"
import { AdaptiveContainer } from "../adaptiveDesign/AdaptiveContainer"

export class NetworkStatusView extends AdaptiveContainer{
    backgroundContainer
    iconContainer
    iconView
    timeline = new Timeline
    loopTimeline = new Timeline
    
    constructor(assets) {
        super()
        this.initBackground(assets)
        this.initIcon(assets)
        this.initTimeline()
        this.visible = false
    }

    initBackground(assets) {
        const width = 80
        const height = 80
        const container = this.addChild(new AdaptiveContainer())
        container.alpha = 0

        container
            .setSourceArea({width, height})
            .setTargetArea({x: 0, y: 0, width: 1, height: 1})
            .stretchHorizontally()
            .stretchVertically()


        const sprite = container.addChild(new Sprite(assets.rectangle))
        sprite.alpha = 0.6
        sprite.tint = 0x000000
        this.backgroundContainer = container
    }

    initIcon(assets) {
        const width = 200
        const height = 200
        const container = this.addChild(new AdaptiveContainer())
        this.iconContainer = container

        container
            .setSourceArea({width, height})
            .setTargetArea({x: 0.3, y: 0.3, width: 0.4, height: 0.4})

        const sprite = container.addChild(new Sprite(assets.iconSpin))

        sprite.anchor.set(0.5)
        sprite.position.set(width / 2, height / 2)
        sprite.alpha = 0
        this.iconView = sprite
    }

    initTimeline() {
        this.loopTimeline
            .addAnimation({
                duration: 500,
                onProgress: progress => {
                    this.iconView.rotation = Math.PI * 2 * progress
                }
            })
            .setLoopMode()
    }

    present(isResponsive = true) {
        const {
            loopTimeline,
            backgroundContainer,
            iconView
        } = this

        this.timeline
            .dropAllAnimations()
            .addAnimation({
                delay: isResponsive ? 0 : 2000,
                duration: 500,
                onStart: () => {
                    if (!isResponsive) {
                        this.visible = true
                        loopTimeline.play()
                    }
                },
                onProgress: progress => {
                    const alpha = isResponsive
                        ? Math.min(iconView.alpha, 1 - progress)
                        : Math.max(iconView.alpha, progress)

                    backgroundContainer.alpha = alpha
                    iconView.alpha = alpha
                },
                onFinish: () => {
                    if (isResponsive) {
                        this.visible = false
                        loopTimeline.pause()
                    }
                }
            })
            .play()
    }
}