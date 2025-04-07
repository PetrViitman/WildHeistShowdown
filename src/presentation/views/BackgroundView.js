import { Container, Sprite } from "pixi.js";
import { AdaptiveContainer } from "./adaptiveDesign/AdaptiveContainer";

export class BackgroundView extends AdaptiveContainer {
	seaContainer
	seaView
	shipView
	freeSpinsModeView

    constructor(assets) {
        super()

        //this.initSea(assets)
        //this.initShip(assets)
    }
	

    initSea(assets) {
        this.seaContainer = this
			.addChild(new AdaptiveContainer)

		this.seaContainer.contentContainer = this
			.seaContainer
			.addChild(new Container)

        this.seaView = this
			.seaContainer
			.contentContainer
			.addChild(new Sprite(assets.sea))

        this.seaView.anchor.set(0.5, 1)
    }

	initShip(assets) {
        this.shipView = this
			.addChild(new AdaptiveContainer)
			.setSourceArea({width: 960, height: 416})
			.setTargetArea({x: 0, y: 0, width: 1, height: 1})
			.stickBottom()

		const container = this.shipView.addChild(new Container)

        const leftHalfView = container
			.addChild(new Sprite(assets.ship))

		const rightHalfView = container
			.addChild(new Sprite(assets.ship))
		
		rightHalfView.scale.x = -1
		rightHalfView.x = 959
		rightHalfView.y = -416


		leftHalfView.y = -416

		// container.x = -480

		this.shipView.contentContainer = container
    }

	setFreeSpinsMode(isFreeSpinsMode = true) {
		// this.seaView.tint = isFreeSpinsMode ? 0x0099FF : 0xFFFFFF
	}

    updateTargetArea(sidesRatio) {
		return
		const { seaContainer, shipView } = this

        if (sidesRatio > 2.8235) {
			seaContainer.contentContainer.position.set(480, 170)

			seaContainer
				.setSourceArea({width: 960, height: 1})
				.setTargetArea({x: 0, y: 0, width: 1, height: 1})
		} else {
			seaContainer.contentContainer.position.set(0, 340)

			seaContainer
				.setSourceArea({width: 1, height: 340})
				.setTargetArea({x: 0, y: 0, width: 1, height: 1})
		}


		if (sidesRatio > 2.307) {
			this.shipView.contentContainer.position.set(0, 100)
			this.shipView
				.setSourceArea({width: 960, height: 1})
				.setTargetArea({x: 0, y: 0, width: 1, height: 1})
		} else {
			this.shipView.contentContainer.position.set(-480, 550)
			this.shipView
				.setSourceArea({width: 1, height: 416})
				.setTargetArea({x: 0, y: 0, width: 1, height: 1})
		}
    }
}