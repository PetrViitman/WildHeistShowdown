import { Container } from "pixi.js";
import { SparkleView } from "./SparkleView";
const OFFSET_X = 300
const LIFT_HEIGHT = 200
const FALL_HEIGHT = 800

const COLOR_MAP = {
    1: 0x00FF00, // ♣️ CLUBS
    2: 0xFF99FF, // ♥️ HEARTS
    3: 0xFF99FF, // ♦️ DIAMONDS
    4: 0x00FFFF, // ♠️ SPADES
	5: 0x00FFFF, // RUM
	6: 0x00FFFF, // HAT
	7: 0xFFFFFF, // PISTOL
	8: 0xFFFF00, // WATCHES
	9: 0x88FF00, // WILD
	10: 0xFFFF00, // SCATTER
}

export class SparklesPoolView extends Container {
    sparklesViews
    descriptors = []
    fallHeight
    sparklesCount
    
    constructor({
        assets,
        fallHeight = FALL_HEIGHT,
        vfxLevel = 1
    }) {
        super()

        this.sparklesCount = 5 + Math.trunc(5 * Math.min(1, vfxLevel / 0.45))

        this.fallHeight = fallHeight
        this.randomize()
        this.initSparkles(assets)
        this.setSkin(1)
        this.presentFallout(0)
    }

    randomize() {
        for(let i = 0; i < this.sparklesCount; i++) {
            this.descriptors[i] = {
                offsetX: -OFFSET_X + Math.random() * OFFSET_X * 2,
                lightHeight: LIFT_HEIGHT * Math.random(),
                fallHeight: this.fallHeight,
            }
        }
    }

    initSparkles(assets) {
        this.sparklesViews = this.descriptors.map(_ => {
                const view = new SparkleView(assets)

                return this.addChild(view)
            })
    }


    presentFallout(progress) {
        const { sparklesViews } = this
        const shiftStep = 0.02

        this.descriptors.forEach(({
            offsetX,
            lightHeight,
            fallHeight,
        }, i) => {
            const progressOffset = i * shiftStep
            const progressOffset2 = (sparklesViews.length - i) * shiftStep
            const remainingProgress = (1 - progressOffset2) - progressOffset

            const subProgress = Math.max(0, Math.min(1, (progress - progressOffset) / remainingProgress) )
            const view  = sparklesViews[i]

            view.presentFallout(
                subProgress,
                offsetX,
                lightHeight,
                fallHeight,
            )
        })
    }

    setSkin(symbolId) {
        const color = COLOR_MAP[Math.abs(symbolId)]

        this.sparklesViews.forEach(view => {
            view.setColor(color)
        })
    }
}