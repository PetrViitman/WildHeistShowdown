import { Container, Graphics, Sprite } from "pixi.js";
import { CharacterHeadView } from "./head/CharacterHeadView";
import { brightnessToHexColor } from "../../../GraphicalPrimitives";

function setTint(tint, container) {

    if(!container) return
    container.tint = tint

    container.children?.forEach(view => {

        setTint(tint, view)
    })
}

export class LimbView extends Container {
    contentContainer
    bendMultiplier
    jointScaleFactor = 1
    colorableItemsViews = []
    itemsViews = []
    targetContainer
    length = 0
    bendProgress = 0
    flipProgress = 0

    targetX = 123
    targetY = 123

    finalSectionLength

    constructor(assets) {
        super()

        this.initContentContainer()
        this.initLimbParts(assets)
        // this.initMarkers()
    }

    initContentContainer() {
        const container = new Container
        container.sortableChildren = true

        this.contentContainer = this.addChild(container)
    }

    initLimbParts(assets) {
        const l = 7

        for(let i = 0; i < l; i++) {
            const view = new Sprite(assets.leg_section)
            view.anchor?.set(0, 0.5)
            view.pivot.x = 25
            this.attach({
                view,
                length: 75,
            })
        }
    }

    initMarkers() {
        this.markersViews = [0xFF0000, 0x00FF00].map(
            color => {
                const view = this
                    .contentContainer
                    .addChild(new Graphics)
                    .beginFill(color, 0.0)
                    .drawRect(-25, -25, 50, 50)
                    .endFill()

                view.zIndex = 10000
                
                return view
            })
    }


    attach({
        view,
        length = 123,
        lengthInLimb = length,
        rotationOffset,
        flipOffset = 0,
        scaleX = 1,
        scaleY = scaleX,
        minimalScaleX = 0,
        noDistortion = false,
        zIndex = this.itemsViews.length
    }) {

        if(lengthInLimb > 0) {
            this.length += lengthInLimb
            this.finalSectionLength = lengthInLimb
        }

        if (rotationOffset) {
            const container = new Container
            container.flipOffset = flipOffset
            container.noDistortion = noDistortion
            container.minimalScaleX = minimalScaleX
            container.length = length
            container.scaleX = scaleX
            container.scaleY = scaleY
            container.lengthInLimb = lengthInLimb
            container.setFlip = (flipProgress) => {view?.setFlip?.(flipProgress)}
            container.addChild(view)
            view.rotation = rotationOffset
            this.contentContainer.addChildAt(container, zIndex)
            this.itemsViews.push(container)

            return container
        }

        view.length = length
        view.noDistortion = noDistortion
        view.minimalScaleX = minimalScaleX
        view.scaleX = scaleX
        view.scaleY = scaleY
        view.lengthInLimb = lengthInLimb
        view.flipOffset = flipOffset
        this.contentContainer.addChildAt(view, zIndex)
        this.itemsViews.push(view)

        return view
    }

    stretch(
        targetX = this.targetX,
        targetY = this.targetY,
        flipProgress = this.flipProgress
    ) {
        this.flipProgress = flipProgress % 1
        
        const {
            length,
            itemsViews,
            bendMultiplier
        } = this

        this.targetX = targetX
        this.targetY = targetY

        const distance = Math.hypot(targetX - this.x, targetY - this.y)
        const finalFlipFactor = Math.sin(Math.PI * 2 * this.flipProgress)
        const stretchFactor = distance / length
        let height = (length - length * stretchFactor) * finalFlipFactor// * Math.abs(finalFlipFactor)
        

        for(let i = 0; i <= itemsViews.length; i++) {
            let view = itemsViews[i - 1] ?? itemsViews[i]
            const progress = i / itemsViews.length
            const nextX = this.length * progress * stretchFactor
            const nextY = Math.sin(Math.PI * progress) * height


            view = itemsViews[i]
            if(view) {
                view.x = nextX
                view.y = nextY
            }

        
            if (i > 0) {
                const previousView = itemsViews[i - 1]
                const length = previousView?.length ?? this.finalSectionLength
                const angle = Math.atan2(nextY - previousView.y, nextX - previousView.x)
                const distance = Math.hypot(nextX - previousView.x, nextY - previousView.y)
                const scaleX =  Math.max(previousView.minimalScaleX,  previousView.noDistortion ? 1 : distance / length)

                previousView.scale.x = scaleX * previousView.scaleX * this.jointScaleFactor
                previousView.scale.y = previousView.scaleY
                previousView.rotation = angle
                previousView.setFlip?.((this.flipProgress + 0.25 + previousView.flipOffset) % 1)
            }
        } 

        //this.markersViews[0].position.set(0, 0)
        //this.markersViews[1].position.set(distance, 0)

        this.contentContainer.rotation = Math.atan2(targetY - this.y, targetX - this.x)
    }

    setTint(tint) {
        setTint(tint, this)
    }

    setColor(color = 0xFFFFFF) {
        this.colorableItemsViews.forEach(view => view.tint = color)
    }
}