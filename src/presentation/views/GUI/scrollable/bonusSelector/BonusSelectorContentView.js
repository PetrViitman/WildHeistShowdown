import { Container, Sprite } from "pixi.js";
import { SelectableBonusView } from "./SelectableBonusView";
import { Timeline } from "../../../../timeline/Timeline";
import { TextField } from "../../../text/TextField";

export class BonusSelectorContentView extends Container {
    backgroundView
    bonusesViews = []
    assets
    dictionary
    timeline = new Timeline
    refreshTimestamp = Date.now()
    locale
    audio
    placeholderView

    
    constructor({assets, dictionary, isLTRTextDirection = true, locale, audio}) {
        super()
        this.audio = audio
        this.assets = assets
        this.dictionary = dictionary
        this.isLTRTextDirection = isLTRTextDirection

        this.initPlaceholder()


        this.initBackground()
        this.initTimeline(locale)
    }

    initBackground() {
        const sprite = this.addChildAt(new Sprite(this.assets.rectangle), 0)
        sprite.width = 1000
        sprite.tint = 0x000000

        this.backgroundView = sprite
    }

    initPlaceholder() {
        const maximalWidth = 950
        const maximalHeight = 1000

        const textField = new TextField({
            maximalWidth,
            maximalHeight,
        })
            .setFontName('default')
            .setFontSize(40)
            .setFontColor(0xf8ee89)
            .setAlignCenter()
            .setAlignMiddle()
            .setText(this.dictionary.no_bonuses)
            .setCharactersPerLineCount(40)

        textField.position.set(25, 250)

        this.placeholderView = this.addChild(textField)
    }

    initTimeline(locale) {
        this.timeline.addAnimation({
            duration: 5_000,
            onStart: () => {
                const elapsedMinutesCount = Math.trunc((Date.now() - this.refreshTimestamp) / 1000 / 60)
                
                this.bonusesViews.forEach(view => {
                    view.presentRemainingTime(elapsedMinutesCount, locale)
                })
            }
        })
        .setLoopMode()
    }

    getBonus(index) {
        const {bonusesViews, assets, isLTRTextDirection, dictionary, audio} = this
        
        if (!bonusesViews[index]) {
            const view = new SelectableBonusView({assets, dictionary, isLTRTextDirection, audio})
            bonusesViews[index] = this.addChild(view)

            view.onBonusActivationRequest = (bonusDescriptor) => {
                this.onBonusActivationRequest?.(bonusDescriptor)
            }
        }

        return bonusesViews[index]
    }

    refresh(bonuses) {
        this.refreshTimestamp = Date.now()
        const {bonusesViews} = this
        let  offsetY = 0
        bonuses.forEach(({
            BC: description, // description
            BNID: id, // id
            BNTP: type, // type
            CNT: count, // count
            FBSE: bet, // free bet size
            GID: gameId, // game id
            TLM: remainingMinutesCount, // remaining time
            color,
            isLocked
        }, i) => {
            const view = this.getBonus(i)
            view.visible = true
            view.y = offsetY
            view.refresh({
                id,
                description,
                type,
                count,
                bet,
                remainingMinutesCount,
                gameId,
                color,
                isLocked
            })

            offsetY += 250
        })

        for (let i = bonuses.length; i < bonusesViews.length; i++) {
            bonusesViews[i].visible = false
        }

        this.backgroundView.height = offsetY
        this.placeholderView.visible = !bonuses.length
    }
}