import {Container, Graphics, Application} from 'pixi.js'

const MINIMAL_SCREEN_SIDE_SIZE = 50

const STICK_MODE = {
	TOP: 0,
	MIDDLE: 1,
	BOTTOM: 2,
	LEFT: 3,
	CENTER: 4,
	RIGHT: 5,
	STRETCH: 6,
}

/**
 * A simple tool based on pixi container, that allows to implement
 * adaptive design.
 * 
 * It brakes adaptivity into two entities
 * - Source area { width , height } in pixels
 * - Target area { x, y, width, height } as percent of canvas size
 * 
 * Container transforms itself (and its content) in the way to be projected
 * to the given target area, maintaining the proportion, so that source area
 * will always be fitted into the frame of projection.
 * 
 * The projection can be modified with following settings:
 * 
 * - STICK_MODE.TOP - will stick projected source area to the top of any remaining space
 * - STICK_MODE.MIDDLE - will stick projected source area to the middle of any remaining space (vertically)
 * - STICK_MODE.BOTTOM - will stick projected source area to the bottom of any remaining space
 * - STICK_MODE.LEFT - will stick projected source area to the left of any remaining space
 * - STICK_MODE.CENTER - will stick projected source area to the center of any remaining space (horizontally)
 * - STICK_MODE.RIGHT - will stick projected source area to the right of any remaining space
 * - STICK_MODE.STRETCH - will ignore proportion and fit all space with source area (vertically or horizontally)
 * 
 * Both vertical and horizontal settings can be applied simultaneously
 */
export class AdaptiveContainer extends Container {
	static isFullScreenMode

	/**
	 * Width of canvas in pixels (at the moment of last resize)
	 */
	static width

	/**
	 * Height of canvas in pixels (at the moment of last resize)
	 */
	static height

	/**
	 * Pixi application, to which adaptive container lib is to be installed to
	 */
	static pixiApplications = []

	/**
	 * Installation of library into pixi application
	 * @param {Application} pixiApplications - Pixi application
	 * @param {boolean} autoResize - if resize should happen automatically on any window resize
	 */
	static install(pixiApplications, autoResize = true) {
		AdaptiveContainer.pixiApplications = pixiApplications
		if (autoResize) {
			pixiApplications.forEach(application => {
				application.view.style.width = '100%'
				application.view.style.height = '100%'
			})

			window.addEventListener('resize', AdaptiveContainer.onResize)
		}

		AdaptiveContainer.onResize()
	}

	/**
	 * deinstallation
	 */
	static uninstall() {
		window.removeEventListener('resize', AdaptiveContainer.onResize)
	}

	/**
	 * Global recursive resize of every adaptive container (and it's sub containers)
	 * inside Pixi application' stage. Fires automatically if auto subscription
	 * flag was not cancelled on installation
	 */
	static onResize() {
		const {isFullScreenMode} = AdaptiveContainer
		const application = AdaptiveContainer.pixiApplications[0]
		const clientWidth = isFullScreenMode ? window.screen.width : application.view.clientWidth
		const clientHeight = isFullScreenMode ? window.screen.height : application.view.clientHeight

		AdaptiveContainer.width = Math.max(MINIMAL_SCREEN_SIDE_SIZE, clientWidth)
		AdaptiveContainer.height = Math.max(MINIMAL_SCREEN_SIDE_SIZE, clientHeight)

		AdaptiveContainer.pixiApplications.forEach(({
			view: {style},
			renderer,
			stage: {children}
		}) => {
			children.forEach(child => {
				child.onResize?.()
			})

			if(isFullScreenMode) {
				style.width = clientWidth + 'px'
				style.height = clientHeight + 'px'
			}

			renderer.resize(clientWidth, clientHeight)
		})
	}

	/**
	 * Graphics that is used to highlight source area
	*/
	graphics

	/**
	 * Source area of container, that will be projected to target area
	 * @param { number } width - width in pixels
	 * @param { number } height - height in pixels
	*/
	sourceArea

	/**
	 * Target area that describes projection sourceArea to canvas
	 * it's metrics is set in percentages of canvas size, e.g. 0.1 = 10%
	 * @param { number } x - horizontal position of projection as percent of canvas width
	 * @param { number } y - vertical position of projection as percent of canvas height
	 * @param { number } width - width of projection as percent of canvas width
	 * @param { number } height - height of projection as percent of canvas height
	*/
	targetArea

	/**
	 * horizontal stick mode of source area projected to target area of canvas
	 */
	horizontalStickModeId = STICK_MODE.CENTER

	/**
	 * vertical stick mode of source area projected to target area of canvas
	 */
	verticalStickModeId = STICK_MODE.MIDDLE

	/**
	 * Sets size of source area
	 * @param { number } width - width in pixels
	 * @param { number } height - height in pixels
	*/
	setSourceArea({ width = 123, height = 123 }) {
		this.sourceArea = {
			width,
			height,
		}

		return this.adjustToTargetArea()
	}

	/**
	 * Sets metrics of target area in percents of canvas size (0.1 = 10%)
	 * @param { number } x - horizontal position of projection as percent of canvas width
	 * @param { number } y - vertical position of projection as percent of canvas height
	 * @param { number } width - width of projection as percent of canvas width
	 * @param { number } height - height of projection as percent of canvas height
	 * @returns { AdaptiveContainer }
	*/
	setTargetArea({
		x = 0,
		y = 0,
		width = 1,
		height = 1,
	}) {
		this.targetArea = {
			x, y, width, height,
		}

		return this.adjustToTargetArea()
	}

	/**
	 * Highlights the sourceArea
	 * @param { number } color - color
	 * @param { number } alpha - alpha
	 * @returns { AdaptiveContainer }
	*/
	highlight(color = 0x0000FF, alpha = 0.5) {
		if (!this.sourceArea) return this 

		const {width, height} = this.sourceArea

		this.graphics = this.graphics ?? this.addChild(new Graphics)
		this.graphics
			.clear()
			.beginFill(color, alpha)
			.drawRect(0, 0, width, height)
			.endFill()

		return this.adjustToTargetArea()
	}

	/**
	 * Sticks projected source area to the top border of remaining space 
	 * @returns { AdaptiveContainer }
	 */
	stickTop() {
		this.verticalStickModeId = STICK_MODE.TOP

		return this.adjustToTargetArea()
	}

	/**
	 * Sticks projected source area to the middle of remaining space (vertically) 
	 * @returns { AdaptiveContainer }
	 */
	stickMiddle() {
		this.verticalStickModeId = STICK_MODE.MIDDLE

		return this.adjustToTargetArea()
	}

	/**
	 * Sticks projected source area to the bottom border of remaining space 
	 * @returns { AdaptiveContainer }
	 */
	stickBottom() {
		this.verticalStickModeId = STICK_MODE.BOTTOM

		return this.adjustToTargetArea()
	}

	/**
	 * Sticks projected source area to the left border of remaining space 
	 * @returns { AdaptiveContainer }
	 */
	stickLeft() {
		this.horizontalStickModeId = STICK_MODE.LEFT

		return this.adjustToTargetArea()
	}

	/**
	 * Sticks projected source area to the center of remaining space (horizontally) 
	 * @returns { AdaptiveContainer }
	 */
	stickCenter() {
		this.horizontalStickModeId = STICK_MODE.CENTER

		return this.adjustToTargetArea()
	}

	/**
	 * Sticks projected source area to the right border of remaining space
	 * @returns { AdaptiveContainer }
	 */
	stickRight() {
		this.horizontalStickModeId = STICK_MODE.RIGHT

		return this.adjustToTargetArea()
	}

	/**
	 * Stretches source area to the whole width of target area
	 * @returns { AdaptiveContainer }
	 */
	stretchHorizontally() {
		this.horizontalStickModeId = STICK_MODE.STRETCH

		return this.adjustToTargetArea()
	}

	/**
	 * Stretches source area to the whole height of target area
	 * @returns { AdaptiveContainer }
	 */
	stretchVertically() {
		this.verticalStickModeId = STICK_MODE.STRETCH

		return this.adjustToTargetArea()
	}

	/**
	 * On resize callback of a container
	 * 1) calls overridable callback in which source and target areas can be modified
	 * 2) projects source area to target area
	 * 3) calls overridable callback on after projection
	 * 4) calls onResize of all child adaptive containers 
	 */
	onResize() {
		const {width, height} = AdaptiveContainer
		const sidesRatio = width / height
		this.updateTargetArea(sidesRatio)
		this.adjustToTargetArea()
		this.onAdjustedToTargetArea(sidesRatio)

		for (const child of this.children)
			child.onResize?.()
	}

	/**
	 * Overridable callback that fires on before projection
	 * of source area to target area, in which target and source
	 * areas can be modified based on given ratio of canvas width to height
	 * @param { number } sidesRatio - width to height ratio of canvas
	 */
	updateTargetArea(sidesRatio) {
		//
	}

	/**
	 * Projection of source area to target area
	 * @returns { AdaptiveContainer }
	 */
	adjustToTargetArea() {
		const {
			horizontalStickModeId,
			verticalStickModeId,
			sourceArea,
			targetArea,
			scale,
			position,
			children,
		} = this

		if (sourceArea && targetArea) {
			const {width, height} = AdaptiveContainer
			const targetWidthInPixels = width * targetArea.width
			const targetHeightInPixels = height * targetArea.height
			const scaleX = targetWidthInPixels / sourceArea.width
			const scaleY = targetHeightInPixels / sourceArea.height
			const commonScale = Math.min(scaleX, scaleY)

			const offsetX = Math.max(
				0,
				targetWidthInPixels - sourceArea.width * commonScale,
			)
			const offsetY = Math.max(
				0,
				targetHeightInPixels - sourceArea.height * commonScale,
			)

			position.x = targetArea.x * width
			position.y = targetArea.y * height

			switch (horizontalStickModeId) {
				case STICK_MODE.LEFT:
					scale.x = commonScale
					break
				case STICK_MODE.CENTER:
					scale.x = commonScale
					position.x += offsetX * 0.5
					break
				case STICK_MODE.RIGHT:
					scale.x = commonScale
					position.x += offsetX
					break
				case STICK_MODE.STRETCH:
					scale.x = scaleX
					break
			}

			switch (verticalStickModeId) {
				case STICK_MODE.TOP:
					scale.y = commonScale
					break
				case STICK_MODE.MIDDLE:
					scale.y = commonScale
					position.y += offsetY * 0.5
					break
				case STICK_MODE.BOTTOM:
					scale.y = commonScale
					position.y += offsetY
					break
				case STICK_MODE.STRETCH:
					scale.y = scaleY
					break
			}
		}

		for (const child of children)
			child.adjustToTargetArea?.()

		return this
	}

	/**
	 * Overridable callback on after projection of source area
	 * to target area
	 * @param { number } sidesRatio - width to height ratio of canvas
	 */
	onAdjustedToTargetArea(sidesRatio) {
		//
	}
}
