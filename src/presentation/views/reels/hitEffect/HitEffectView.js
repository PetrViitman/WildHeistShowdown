import { Container, Sprite } from "pixi.js";

const COLOR_MAP = {
    1: 0x00FF00, // ♣️ CLUBS
    2: 0xFF00FF, // ♥️ HEARTS
    3: 0xFF55FF, // ♦️ DIAMONDS
    4: 0x00FFFF, // ♠️ SPADES
	5: 0x00FFFF, // RUM
	6: 0x00FFFF, // HAT
	7: 0xFFFFFF, // PISTOL
	8: 0xFFFF00, // WATCHES
	9: 0x88FF00, // WILD
	10: 0xFFFF00, // SCATTER
}

export class HitEffectView extends Container {
    bodyView

    constructor(assets) {
        super()
        this.initBody(assets)
        this.initSparkles(assets)
    }



    initBody(assets) {
        const sprite = new Sprite(assets.hit_effect)
        sprite.anchor.set(0.5, 1)

        this.bodyView = this.addChild(sprite)
    }

    initSparkles(assets) {

    }

    present(progress) {
        const {bodyView} = this


        bodyView.scale.set(
            0.35 + 0.35 * Math.abs(Math.sin(Math.PI * 2 * progress)),
            5 * Math.abs(Math.sin(Math.PI * 2 * progress) * (1 - progress))
        )
        // bodyView.alpha = Math.min(1 , Math.sin(Math.PI * progress) * 3)
        bodyView.y = 50 * progress// 50 + -50 * Math.sin(Math.PI * 2 * progress)
    }

    setSkin(symbolId) {
        const color = COLOR_MAP[Math.abs(symbolId)] ?? 0xFFFFFF

        this.bodyView.tint = color
    }
}