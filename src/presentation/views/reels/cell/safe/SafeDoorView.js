import { Container, Sprite } from "pixi.js";
import { Base3DSymbolView } from "../symbols/Base3DSymbolView";

export class SafeDoorView extends Base3DSymbolView {
    initFaces(symbolName = 'clubs') {
        const {
			facesContainer,
			facesViews,
			distances,
			angles,
            assets,
		} = this

        let sprite = new Sprite(assets.safe_door_stretch)
		sprite.anchor.set(0.5)
		this.stretchView = facesContainer.addChild(sprite)

        sprite = new Sprite(assets.safe_door_rib)
		sprite.anchor.set(0.5)
		this.ribView = facesContainer.addChild(sprite)

		sprite = new Sprite(assets.safe_door_stretch)
		sprite.anchor.set(0.5)
		angles[0] = - Math.PI
		distances[0] = 16
		facesViews[0] = facesContainer.addChild(sprite)

        
		angles[1] = 0
		distances[1] = 16
		facesViews[1] = sprite


        let container = new Container
        sprite = container.addChild(new Sprite(assets.safe_wheel_pointer))
		sprite.anchor.set(0.5)
		sprite.y = -65

        sprite = container.addChild(new Sprite(assets.safe_wheel))
		sprite.anchor.set(0.5)
		angles[2] = 0
		distances[2] = 16
		facesViews[2] = facesContainer.addChild(container)
        this.wheelView = sprite
        this.doorFaceContainer = container


        container = new Container
        sprite = container.addChild(new Sprite(assets.safe_lock_hole))
		sprite.anchor.set(0.5)
		sprite.y = -30

        sprite = container.addChild(new Sprite(assets.safe_lock_hole))
		sprite.anchor.set(0.5)

        sprite = container.addChild(new Sprite(assets.safe_lock_hole))
		sprite.anchor.set(0.5)
        sprite.y = 30

		angles[3] = -Math.PI / 2
		distances[3] = 98
		facesViews[3] = facesContainer.addChild(container)
        this.doorLockContainer = container
    }

    setFlip(flipProgress) {
        const {facesViews, stretchView} = this

		super.setFlip(flipProgress)

        if (flipProgress > 0.25 || flipProgress < 0.75) {
            stretchView.x = -facesViews[0].x
        } else {
            stretchView.x = facesViews[0].x
        }
        facesViews[0].visible = true

        stretchView.scale.x = facesViews[0].scale.x

        this.wheelView.rotation = Math.PI * 2 * flipProgress * 5
	}

    onBrightnessUpdated(tint) {
        this.doorFaceContainer.children.forEach(view => view.tint = tint)
        this.doorLockContainer.children.forEach(view => view.tint = tint)
	}
}