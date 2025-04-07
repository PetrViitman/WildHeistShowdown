import { Container } from "pixi.js";
import { CoinView } from "../../particles/collapseEffects/coins/CoinView";
import { ChipView } from "./ChipView";

const DESCRIPTORS = [
    {
        distance: 1050,
        zAngle: Math.PI * 0.475,
        yAngle: -Math.PI / 1.25,
        progressOffset: 0,
        flipOffset: 0.25,
        spinOffset: 0,
    },
    {
        distance: 750,
        zAngle: Math.PI * 0.85,
        yAngle: -Math.PI / 2.5,
        progressOffset: 0.25,
        flipOffset: 0.1,
        spinOffset: 0,
    },

    {
        distance: 750,
        zAngle: Math.PI * 0.15,
        yAngle: -Math.PI / 2.5,
        progressOffset: 0.5,
        flipOffset: 0.25,
        spinOffset: 0,
    },

    {
        distance: 750,
        zAngle: Math.PI * 0.75,
        yAngle: -Math.PI / 1,
        progressOffset: 0,
        flipOffset: 0,
        spinOffset: 0,
    },

    {
        distance: 750,
        zAngle: Math.PI * 0.25,
        yAngle: -Math.PI / 1,
        progressOffset: 0,
        flipOffset: 0.25,
        spinOffset: 0,
    },

    {
        distance: 1000,
        zAngle: Math.PI * 0.55,
        yAngle: -Math.PI / 1.5,
        progressOffset: 0,
        flipOffset: 0.35,
        spinOffset: 0,
    },

    {
        distance: 750,
        zAngle: Math.PI * 0.325,
        yAngle: -Math.PI / 1.5,
        progressOffset: 0,
        flipOffset: 0,
        spinOffset: 0,
    },
]

export class AwardCoinsPoolView extends Container {
    itemsViews

    constructor(assets) {
        super()

        this.initCoins(assets)
        this.initChips(assets)
        this.setChipsMode(false)
    }

    initCoins(assets) {
        this.coinsViews = DESCRIPTORS.map(() => {
            const view = new CoinView(assets)
            return this.addChild(view)
        })
    }

    initChips(assets) {
        this.chipsViews = DESCRIPTORS.map(() => {
            const view = new ChipView(assets)
            return this.addChild(view)
        })
    }

    setChipsMode(isChipsMode = true) {
        this.itemsViews = isChipsMode
            ? this.chipsViews
            : this.coinsViews

        this.coinsViews.forEach(view => view.visible = !isChipsMode)
        this.chipsViews.forEach(view => view.visible = isChipsMode)
    }

    present(progress) {

        const finalProgressDelta = 0.85
        const finalProgressGap = 1 - finalProgressDelta

        DESCRIPTORS.forEach(({
            distance = 750,
            zAngle = Math.PI * 0.75,
            yAngle = -Math.PI / 3.5,
            flipOffset = 0,
            spinOffset = 0,
            scaleFactor = 5,
        }, i) => {
            const shiftedProgress = Math.max(
                0,
                Math.min(finalProgressDelta, progress - finalProgressGap * (i * 0.25))
            ) / finalProgressDelta

            const view = this.itemsViews[i]

            const cos = Math.cos(zAngle)
            const sin = Math.sin(yAngle + shiftedProgress * Math.PI)
            const finalDistance = distance * shiftedProgress

            view.setFlip((shiftedProgress * 2 + flipOffset) % 1)
            view.setSpin((shiftedProgress * 2 + spinOffset) % 1)
            view.scale.set((0.2 + 0.15 * shiftedProgress) * scaleFactor)
            view.alpha = Math.min(1, Math.sin(Math.PI * shiftedProgress) * 1)

            view.position.set(
                finalDistance * cos * 0.5,
                finalDistance * sin
            )
        })
    }
}