import { Container, Graphics, Sprite } from "pixi.js";
import { SafeDoorView } from "./SafeDoorView";
import { brightnessToHexColor } from "../../../GraphicalPrimitives";
import { Timeline } from "../../../../timeline/Timeline";
import { SubstitutionEffectView } from "./SubstitutionEffectView";
import { CELL_HEIGHT, CELL_WIDTH, WILD_SYMBOL_ID } from "../../../../Constants";

export class SafeView extends Container {
    idleFactor = 1
    doorFlipProgress = 0

    contentContainer
    doorView
    timeline = new Timeline
    cellView
    substitutionEffectView
    isLowVfxLevel


    constructor(assets, vfxLevel) {
        super()

        this.isLowVfxLevel = vfxLevel < 0.15

        this.initBackground(assets)
        this.initSubstitutionEffect(assets, vfxLevel)
        this.initDoor(assets, vfxLevel)
        this.initContainers()
        this.initTimeline()
    }

    initContainers() {
        const container = this.addChild(new Container)
        container.position.set(128)
        this.contentContainer = container
    }

    initBackground(assets) {
        const sprite = new Sprite(assets.safe_base)
        sprite.anchor.set(0.5)
        sprite.position.set(128)
        sprite.scale.set(0.95)

        this.backgroundView = this
            .addChild(sprite)
    }

    initSubstitutionEffect(assets, vfxLevel) {
        if(vfxLevel < 0.15) return

        this.substitutionEffectView = this.addChild(new SubstitutionEffectView(assets))
        this.substitutionEffectView.setColor(0xFFFF00)
        this.substitutionEffectView.position.set(CELL_WIDTH / 2, CELL_HEIGHT / 2)
        this.substitutionEffectView.scale.set(1.25)
    }

    initDoor(assets, vfxLevel) {
        if(vfxLevel < 0.15) return
        this.doorView = this.addChild(new SafeDoorView(assets))
    }

    initTimeline() {
        const { contentContainer } = this
        this.timeline
            .addAnimation({
                duration: 100,
                onProgress: progress => {
                    this.idleFactor = Math.min(this.idleFactor, 1 - progress)
                    this.doorFlipProgress = -0.15

                    this.update()
                }
            })
            .addAnimation({
                delay: 100,
                onDelayFinish: () => {
                    this.addChildAt(contentContainer, 1)
                },
                duration: 100,
                onProgress: progress => {
                    this.doorFlipProgress = -0.15 + 1.15 * progress

                    this.update()
                }
            })
            .addAnimation({
                duration: 125,
                onProgress: progress => {
                    const symbolView = this.cellView.getSymbolView()
                    symbolView.scale.set(1 + Math.sin(Math.PI * progress) * 0.4 - 0.45 * progress)

                    
                }
            })
            .addAnimation({
                duration: 200,
                onProgress: progress => {
                    const symbolView = this.cellView.getSymbolView()
                    symbolView.flameIntensity = 1 - progress
                }
            })
            .addAnimation({
                delay: 100,
                duration: 200,
                onProgress: progress => {
                    this.substitutionEffectView?.present(progress)

                    if(this.isLowVfxLevel) {
                        this.contentContainer.alpha = 1 - Math.sin(Math.PI * progress)
                    }
                }
            })

            .addAnimation({
                delay: 200,
                duration: 100,
                onDelayFinish: () => {
                    this.cellView.getSymbolView().scale.set(1)
                    this.cellView.presentSymbol(-WILD_SYMBOL_ID)
                    this.cellView.getSymbolView().scale.set(0.55)
                },
                onProgress: progress => {
                    this.doorFlipProgress = 1 - progress * 1.15
                    this.update()
                }
            })
            .addAnimation({
                delay: 250,
                onDelayFinish: () => {
                    if(this.doorView) {
                        this.addChildAt(this.contentContainer, 3)
                    } else {
                        this.addChild(this.contentContainer)
                    }
                },
                duration: 100,
                onProgress: progress => {
                    const symbolView = this.cellView.getSymbolView()
                    symbolView.flameIntensity = progress
                    symbolView.scale.set(0.55 + 0.45 * progress + 0.5 * Math.sin(Math.PI * progress))
                    symbolView.featureFlipProgress = progress * 0.5
                    this.backgroundView.alpha = 1 -progress
                },
                onFinish: () => {
                    this.cellView.presentSymbol(WILD_SYMBOL_ID)
                }
            })
    }

    setVisible(isVisible = true) {
        if(this.doorView) {
            this.doorView.visible = isVisible
        }
        this.backgroundView.visible = isVisible
    }

    presentDoorClosure(progress = 0.001) {
        const {doorView} =  this

        if (!doorView) return

        const flipProgress = 0.25 - progress * 0.25
        doorView.pivot.x =  90 * Math.sin(Math.PI * Math.min(0.5, progress))
        doorView.position.set(220, 128)
        doorView.setFlip(flipProgress)
    }

    update(progress) {
        const {idleFactor, doorFlipProgress} = this
        const idleProgress = Math.sin(Math.PI * progress) * 0.5
        const finalProgress = Math.min(1.25, (doorFlipProgress + idleProgress * idleFactor))

        this.presentDoorClosure(finalProgress)
    }

    setBrightness(brightness) {
        this.doorView?.setBrightness(brightness)
        this.backgroundView.tint = brightnessToHexColor(Math.max(0.25, brightness))
    }

    presentSubstitution(progress) {
        this.timeline.wind(progress)
    }

    attach(cellView) {
        this.cellView = cellView
        this.contentContainer
            .addChild(cellView.contentContainer)
    }

    reset() {
        this.backgroundView.alpha = 1

        if (this.doorView) {
            this.doorView.alpha = 1
        }
        this.idleFactor = 1
    }
}