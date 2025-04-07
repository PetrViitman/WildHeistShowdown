import { Animation } from './Animation'
export { EASING } from './Animation'

/**
 * Timeline of animations
 * Unlike twins, it supports rewinding at the desired percentage or millisecond.
 * It also supports timestamp-based callbacks, and it is always ready for safe reuse.
 * The final value of ease functions are available for any exact point of timeline without
 * iteration through previous frames like it is done in twins.
 * Playback is simulated by rewinding, which excludes any desynchronization
 */
export class Timeline {
	/** All instances of time line in the game */
	static instances = []

	/** V-sync time stamp in milliseconds which is recorded in previous frame*/
	static previousUpdateTimeStamp

	/**
	 * Updates all instances for a delta time since the previous frame.
	 * Call it on redraw
	 */
	static update() {
		const currentTime = Date.now()
		const timeDelta = currentTime - (Timeline.previousUpdateTimeStamp ?? Date.now())

		Timeline.instances.forEach((timeline) => {
			timeline.update(timeDelta)
		})

		Timeline.previousUpdateTimeStamp = currentTime
	}

	static drop() {
		Timeline.instances = []
	}

	/** All animations inside of a single timeline */
	animations = []

	/**
	 * Actual count of animations 
	 * (some may be kept to be reused)
	 */
	animationsCount = 0
	timeScaleFactors = {}
	commonScaleFactor = 1
	isLoopMode = false
	duration
	resolve
	isPlaying
	totalElapsedMilliseconds = 0

	constructor(isTracked = true) {
		isTracked && Timeline.instances.push(this)
	}

	getNextAnimation() {
		if (this.animations.length > this.animationsCount) {
			return this.animations[this.animationsCount]
		}
		const animation = new Animation({})

		this.animations.push(animation)

		return animation
	}

	/**
	 * @param {object} target object of animation
	 * @param {string} key the field that is to be animated
	 * @param {number} initialValue initial value of given key
	 * @param {number} finalValue final value of given key
	 * @param {number} duration duration of the animation in milliseconds
	 * @param {number} delay delay in milliseconds before animation progress
	 * @param {number} easing id of an ease function, that is to be applied
	 * @param {function} onStart callback on start, or if the animation is winded through the 0% mark
	 * @param {function} onDelay callback that is executed while delay
	 * @param {function} onDelayFinish callback on delay finish
	 * @param {function} onProgress callback on every change of real progress (exluding delay)
	 * @param {function} onUpdate callback on any update or winding
	 * @param {function} onFinish callback that fires when real progress hits 100% or when winded through 100%
	 * @param {object} callbacks
	 * Callbacks attached to timestamps in milliseconds,
	 * will be called if the animation is winded through
	 * breakpoint corresponding to the time code.
	 * Specified in the format:
	 * {
	 *  1000: () => {},
	 *  2500: () => {},
	 *  3000: () => {},
	 * }
	 * @returns {Timeline}
	 */
	addAnimation({
		target,
		key,
		initialValue = undefined,
		finalValue = undefined,
		duration = 1,
		delay = 0,
		easing = undefined,
		onStart,
		onUpdate,
		onDelay,
		onDelayFinish,
		onProgress,
		onFinish,
		callbacks,
	}) {
		const {animations} = this
		const animation = this.getNextAnimation()

		animation.target = target
		animation.key = key
		animation.initialValue = initialValue
		animation.finalValue = finalValue
		animation.duration = duration
		animation.delay = delay
		animation.easing = easing
		animation.onStart = onStart
		animation.onUpdate = onUpdate
		animation.onDelay = onDelay
		animation.onDelayFinish = onDelayFinish
		animation.onProgress = onProgress
		animation.onFinish = onFinish
		animation.callbacks = callbacks
		animation.progress = 0
		animation.realProgress = 0

		this.animationsCount++

		// immediately sync with all other animations
		animation.wind(animations[0].progress)
		animations[0].isPlaying && animation.play()

		return this.validateDuration()
	}

	validateDuration() {
		let maximalDuration = 0
		for (let i = 0; i < this.animationsCount; i++) {
			const animation = this.animations[i]
			const totalDuration = (animation?.duration ?? 0) + (animation?.delay ?? 0)

			if (totalDuration > maximalDuration)
				maximalDuration = totalDuration
		}

		this.duration = maximalDuration

		return this
	}

	/**
	 * Deletes all animations
	 * @returns {Timeline}
	 */
	deleteAllAnimations() {
		//this.animations = []
		//this.animationsCount = 0

		return this.dropAllAnimations()
	}

	/**
	 * Drops, but does not delete all animations
	 * so they can be reused without memory allocation
	 * @returns {Timeline}
	 */
	dropAllAnimations() {
		this.duration = 0
		this.animationsCount = 0
		this.validateDuration()
		this.totalElapsedMilliseconds = 0
		this.isLoopMode = false

		return this
	}

	/**
	 * Returns the last animation in the list
	 * @returns {Timeline}
	 */
	getLastAnimation() {
		return this.animations[this.animationsCount - 1]
	}

	/**
	 * Returns animation that finishes last
	 * @returns {Timeline}
	 */
	getLatestAnimation() {
		const {animations} = this
		let index = 0

		for (let i = 0; i < this.animationsCount; i++) {
			const animation = this.animations[i]

			if (animation.delay + animation.duration > animations[index].delay + animations[index].duration)
				index = i
		}

		return animations[index]
	}


	/**
	 * Winds the all animations to the given progress
	 * @param {number} progress total progress of the whole timeline (0.1 is 10%)
	 * @param {boolean} isResponsive will also fire callbacks if delta progress touches them
	 * @returns {Timeline}
	 */
	wind(progress, isResponsive = true) {
		const milliseconds = progress * this.duration
		if(this.totalElapsedMilliseconds === milliseconds) return this

		this.totalElapsedMilliseconds = milliseconds
		for (let i = 0; i < this.animationsCount; i++)
			this.animations[i].windToTime(milliseconds, isResponsive)

		return this
	}

	/**
	 * Winds the all animations to the given time in milliseconds
	 * or to the end bounds of the timeline, if given time exceeds limits
	 * @param {number} milliseconds time in milliseconds
	 * @returns {Timeline}
	 */
	windToTime(milliseconds = this.totalElapsedMilliseconds) {
		this.totalElapsedMilliseconds = Math.min(this.duration, milliseconds)
		for (let i = 0; i < this.animationsCount; i++)
			this.animations[i].windToTime(milliseconds)

		return this
	}

	/**
	 * Winds the all animations to the given time in milliseconds.
	 * Offset values of given time are considered as loop 
	 * @param {number} milliseconds
	 * @returns {Timeline}
	 */
	windToTimeLoop(milliseconds) {
		const finalMilliseconds = milliseconds % this.duration

		if(finalMilliseconds < this.totalElapsedMilliseconds) {
			this.wind(1)

			// loop mode may be toggled on elapsed callbacks
			if (this.isLoopMode && finalMilliseconds) this.wind(0)
		}

		// loop mode may be toggled on elapsed callbacks
		this.windToTime(this.isLoopMode ? finalMilliseconds : 0)

		return this
	}

	/**
	 * Updates all animations inside the timeline.
	 * @param {number} timeDelta Time in milliseconds
	 * @returns {Timeline}
	 */
	update(timeDelta) {
		if(!this.isPlaying) return this
		const finalTimeDelta = timeDelta * this.commonScaleFactor
		const totalElapsedMilliseconds = this.totalElapsedMilliseconds + finalTimeDelta
	
		if (this.isLoopMode) {
			this.windToTimeLoop(totalElapsedMilliseconds)
		} else {
			this.windToTime(totalElapsedMilliseconds)
		}

		if(totalElapsedMilliseconds >= this.duration) {
			if (this.isLoopMode) {
				this.play(false)
			} else {
				this.resolve?.()
				this.resolve = null
				this.isPlaying = false
			}
		}

		return this
	}

	/**
	 * will resolve on finish
	 * @param {Promise} isPromiseUpdateRequired
	 * @returns {Timeline}
	 */
	play(isPromiseUpdateRequired = true) {
		this.isPlaying = true

		if(isPromiseUpdateRequired)
			return new Promise(resolve => this.resolve = resolve)
	}

	/**
	 * Sets loop
	 * @param {boolean} isLoopMode
	 * @returns {Timeline}
	 */
	setLoopMode(isLoopMode = true) {
		this.isLoopMode = isLoopMode

		return this
	}

	/**
	 * Pauses the timeline
	 * @returns {Timeline}
	 */
	pause() {
		this.isPlaying = false

		return this
	}

	/**
	 * Sets elapsed delta time multiplier, the greater - the faster
	 * @param {String} name key
	 * @param {Number} value scale value
	 * @returns {Timeline}
	 */
	setTimeScaleFactor({name, value}) {
		const { timeScaleFactors } = this
		timeScaleFactors[name] = value

		this.commonScaleFactor = 1
		Object
			.values(timeScaleFactors)
			.forEach(factor => this.commonScaleFactor *= factor )

		return this
	}

	/**
	 * Removes this timeline from the global list 
	 * and nulls all references inside of this
	 * timeline to release memory
	 * @returns {Timeline}
	 */
	destroy() {
		const {instances} = Timeline

		this.animations = null

		instances.splice(instances.indexOf(this), 1)
	}
}
