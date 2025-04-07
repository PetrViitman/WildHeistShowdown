import { Sprite } from "pixi.js";
import { BaseChestView } from "../../base/spine/BaseChestView";

export class AdventurerChestView extends BaseChestView {
    initFront(assets) {
        this.frontView = this
            .contentContainer
            .addChild(new Sprite(assets.uniform_front_top))

        this.frontView.anchor.set(0.5)
        this.frontView.y = 0

        this.buttonsViews = [-25, 25].map(y => {
            const sprite = new Sprite(assets.button)
            this.contentContainer.addChild(sprite)
            sprite.anchor.set(0.5)
            sprite.y = y

            return sprite
        })

        this.pocketsViews = [0.075, 0.875].map(flipProgressOffset => {
            const sprite = new Sprite(assets.pocket)
            this.contentContainer.addChild(sprite)
            sprite.flipProgressOffset = flipProgressOffset
            sprite.anchor.set(0.5)
            sprite.y = -20

            return sprite
        })

        let sprite = new Sprite(assets.adventurer_scarf)
        sprite.tint = 0xFF0000
        this.contentContainer.addChild(sprite)
        sprite.anchor.set(0.5)
        sprite.y = -74
        sprite.scale.y = 0.5

        sprite = new Sprite(assets.adventurer_scarf_node)
        sprite.tint = 0xFF0000
        this.contentContainer.addChild(sprite)
        sprite.anchor.set(0.5, 0.15)
        sprite.y = -85
        this.scarfNodeView = sprite
    }

    setFlip(flipProgress) {
        super.setFlip(flipProgress)
        
        const {contentContainer, scarfNodeView} = this

        this.pocketsViews.forEach(view => {
            const progress = (flipProgress + view.flipProgressOffset) % 1
            const angle = Math.PI * 2 * progress
            const sin = Math.sin(angle)
            const cos = Math.cos(angle)

            view.x = 125 * cos
            view.scale.x = sin / contentContainer.scale.x
            view.skew.x = - contentContainer.skew.x
            view.visible = progress < 0.5
        })


        const angle = Math.PI * 2 * flipProgress
        const sin = Math.sin(angle)
        const cos = Math.cos(angle)

        scarfNodeView.x = 75 * cos
        scarfNodeView.scale.y = 0.5
        scarfNodeView.scale.x = sin
        scarfNodeView.skew.x = cos
        scarfNodeView.visible = flipProgress < 0.5

        // this.ropeView.skew.x = - contentContainer.skew.x
    }

    setColor(color) {
        super.setColor(color)
        this.pocketsViews.forEach(view => view.tint = color)
    }
}