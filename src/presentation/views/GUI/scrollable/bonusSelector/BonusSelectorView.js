import { Sprite } from "pixi.js";
import { ScrollableWindow } from "../ScrollableWindowView";
import { BonusSelectorContentView } from "./BonusSelectorContentView";

const GAME_ID = 578

export class BonusSelectorView extends ScrollableWindow {
    isMobileApplicationClient

    async init({assets, dictionary, coefficients, isLTRTextDirection, locale, audio, isMobileApplicationClient}) {
        await super.init({assets, dictionary, coefficients, isLTRTextDirection, locale, audio})

        this.textField.setText(dictionary.bonuses)
        this.isMobileApplicationClient = isMobileApplicationClient
    }


    initContent({assets, dictionary, isLTRTextDirection, locale}) {
        this.contentView = this
            .scrollableContainer
            .addChild(new BonusSelectorContentView({assets, dictionary, isLTRTextDirection, locale, audio: this.audio}))

        this.contentView.scale.set(0.97)

        this.contentView.onBonusActivationRequest = (bonusDescriptor) => {
            this.onBonusActivationRequest?.(bonusDescriptor)
        }
    }

    refresh(bonuses, isPrimaryAccountActive) {
        bonuses.forEach(bonus => {
            if(bonus.GID === 578) {
                bonus.color = 0xFFFF00
                bonus.isLocked = !isPrimaryAccountActive
            }
        })
        bonuses.sort((bonus1, bonus2) => {
            if (bonus1.GID < bonus2.GID){
                return -1;
            }
            return 1
        })

        bonuses.sort((bonus1, bonus2) => {
            if (bonus1.GID === 578){
                return -1;
            }
            return 0
        })

        bonuses.sort((bonus1, bonus2) => {
            if (bonus1.GID === bonus2.GID && bonus1.BNTP > bonus2.BNTP){
                return -1;
            }
            return 0
        })

        if(this.isMobileApplicationClient) {
            const finalBonuses = []
            bonuses.forEach(bonus => {
                if(bonus.GID === GAME_ID) {
                    finalBonuses.push(bonus)
                }
            })

            bonuses = finalBonuses
        }


        this.contentView.refresh(bonuses)

        this.setScroll(0)
    }

    initIcon(assets) {
        const sprite = new Sprite(assets.iconBonus)
        sprite.anchor.set(0.5)
        sprite.scale.set(0.86)
        sprite.rotation = -0.25
        this.iconView = this.wrapperContainer.addChild(sprite)
    }
}