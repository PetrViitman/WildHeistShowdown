import { Container, Sprite } from "pixi.js";

const BONUS_ICONS_NAMES_MAP = {
    3: 'FreeBet',
    2: 'HalfBet',
    1: 'DoubleUp',
}

export class BonusIconsPoolView extends Container {
    assets
    iconsViews = []
    currentIconView
    tint = 0xFFFFFF
    
    constructor(assets) {
        super()
        this.assets = assets
        this.presentBonus()
    }


    getIconView(bonusTypeId) {
        if(! this.iconsViews[bonusTypeId]) {
            const textureName = 'iconBonus' + (BONUS_ICONS_NAMES_MAP[bonusTypeId] ?? '')
            const sprite = new Sprite(this.assets[textureName])
            sprite.anchor.set(0.5)
            this.iconsViews[bonusTypeId] = this.addChild(sprite)
        }

        return this.iconsViews[bonusTypeId]
    }

    presentBonus(bonusTypeId) {
        if(this.currentIconView) {
            this.currentIconView.visible = false
        }

        this.currentIconView = this.getIconView(bonusTypeId)
        this.currentIconView.visible = true
        this.currentIconView.tint = this.tint
    }

    setTint(tint = 0xFFFFFF) {
        this.tint = tint

        if (this.currentIconView) {
            this.currentIconView.tint = tint
        }
    }
}