import { Container, Sprite } from "pixi.js";

export class BaseNeckView extends Container {
    contentContainer
    baseView
    scarfView
    constructor(assets) {
        super()

        this.initContentContainer()
        this.initBase(assets)
        this.initScarf(assets)
    }

    initContentContainer() {
        this.contentContainer = this.addChild(new Container)
    }

    initBase(assets) {
        this.baseView = this
            .contentContainer
            .addChild(new Sprite(assets.neck))
        this.baseView.anchor.set(0.5)
    }

    initScarf(assets) {
        this.scarfView = this
            .contentContainer
            .addChild(new Sprite(assets.scarf))

        this.scarfView.y = 15
        this.scarfView.anchor.set(0.5)
    }

    setFlip(flipProgress) {
        this.contentContainer.x = -Math.cos(Math.PI * 2 * flipProgress) * 25
    }

    setColor(color) {
        this.scarfView.tint = color
    }
}