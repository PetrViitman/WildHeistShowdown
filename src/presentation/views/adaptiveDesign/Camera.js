import { Graphics } from "pixi.js"
import { AdaptiveContainer } from "./AdaptiveContainer"


function getGlobalScale(view, scale = 1) {
    const parent = view.parent
    const updatedScale = scale * view.scale.x
    if(parent) return getGlobalScale(parent, updatedScale)

    return updatedScale
}

export class Camera {
    zoom = 1
    stage
    rotation = 0
    x = 0
    y = 0

    constructor(stage) {
        this.stage = stage
    }
    
    setX(x) {
        this.x = x
        this.stage.x = x
        this.stage.pivot.x = x

        return this
    }

    setY(y) {
        this.y = y
        this.stage.y = y
        this.stage.pivot.y = y

        return this
    }

    focus({view, offsetX = 0, offsetY = 0}) {
        const globalScale = getGlobalScale(view)
        const { x, y } = view.getGlobalPosition()
        this.setX(x + offsetX * globalScale)
            .setY(y + offsetY * globalScale)

        return this
    }

    setZoom(zoom = 1) {
        this.zoom = zoom
        this.stage.scale.set(zoom)

        return this
    }

    setAngle(angle) {
        this.stage.rotation = -angle

        return this
    }

    shake(y) {
        // this.stage.y = 0
    }
}