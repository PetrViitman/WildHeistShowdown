import { AdaptiveContainer } from './AdaptiveContainer'

/**
 * Adaptive container empowered with ability to attach HTML elements to it.
 * Attached HTML elements follow the same adaptive transformations as child pixi
 * display objects, and they also keep whatever reactivity is going on inside
 * of them by any framework, such as VUE or React
 */
export class AdaptiveProxyHTMLContainer extends AdaptiveContainer {
	descriptors = []

	/**
	 * Attaches HTML element to container
	 * @param { HTMLElement } element - attachable HTML element
	 * @param { String } name - name of attachable HTML element for further access
	 * @param { Number } offsetX - horizontal offset in pixels
	 * @param { Number } offsetY - vertical offset in pixels
	 * @param { Number } scaleFactor - attachable Html element will be rescaled by this multiplier if needed
	 */
	attach({
		element,
		name = 'element',
		offsetX = 0,
		offsetY = 0,
		scaleFactor = 1,
	}) {
		if (!element) return this

		// call will be ignored if given HTML element is already attached
		for (const descriptor of this.descriptors)
			if (descriptor.element === element)
				return this

		const {style} = element

		// setting up style properties to control transformations
		style.removeProperty('right')
		style.removeProperty('bottom')
		style.removeProperty('transform')
		style.position = 'absolute'
		style.setProperty('transform-origin', 'top left')

		// attached elements are all kept in the list
		this.descriptors.push({
			element,
			name,
			offsetX,
			offsetY,
			scaleFactor,
		})

		// attached HTML element should be immediately projected to target area
		this.adjustToTargetArea()

		return this
	}

	/**
	 * Deletes attached HTML element and its descriptor by given name
	 */
	deleteItem(name = 'element') {
		const element = this.getDescriptor(name)?.element
		if (!element) return

		this.detach(element)
		element?.remove()
	}

	/**
	 * Detaches attached HTML element and deletes its descriptor by given name
	 */
	detach(element) {
		for (let i = 0; i < this.descriptors.length; i++)
			if (this.descriptors[i].element === element) {
				this.descriptors.splice(i, 1)

				break
			}

		return this
	}

	/**
	 * Base method extension, that does the same
	 * transformations with attached HTML elements
	 * by modifying their CSS styles
	 */
	adjustToTargetArea() {
		super.adjustToTargetArea()

		this.descriptors.forEach(({
			element,
			offsetX,
			offsetY,
			scaleFactor,
		}) => {
			const {style} = element

			style.transform = `
				scaleX(${this.scale.x * scaleFactor})
				scaleY(${this.scale.y * scaleFactor})
				translateX(${offsetX}px)
				translateY(${offsetY}px)`

			style.left = this.x + 'px'
			style.top = this.y + 'px'
		})

		return this
	}

	/**
	 * will search for descriptor with given name
	 */
	getDescriptor(name = 'element') {
		for (const descriptor of this.descriptors)
			if (descriptor.name === name)
				return descriptor
		
		return null
	}

	/**
	 * will search for an HTML element of
	 * a descriptor with given name
	 */
	getHTMLElement(name = 'element') {
		return this.getDescriptor(name)?.element
	}

	setElementVisible(name = 'element', isVisible = true) {
		const element = this.getHTMLElement(name)
		if (!element) return this

		element.style.display = isVisible ? 'block' : 'none'

		return this
	}

	/**
	 * Translates HTML element inside source area
	 * if able to find a descriptor with corresponding
	 * name
	 */
	translateElement({ name, x, y }) {
		const descriptor = this.getDescriptor(name)

		if (descriptor) {
			descriptor.offsetX = x ?? descriptor.offsetX
			descriptor.offsetY = y ?? descriptor.offsetY
		}

		return this
	}

	scaleElement({name, scaleFactor = 1}) {
		const descriptor = this.getDescriptor(name)

		if (descriptor) {
			descriptor.scaleFactor = scaleFactor
		}

		return this.adjustToTargetArea()
	}
}
