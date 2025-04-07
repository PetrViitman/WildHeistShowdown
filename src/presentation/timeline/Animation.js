/**
 * [>>][>>][>] - EASE
 *
 * [>][>>][>>>] - IN
 *
 * [>>>][>][>] - OUT
 *
 * [>][>>>][>>] - IN_OUT
 */
export const EASING = Object.freeze({
    EASE: 0,
    IN: 1,
    OUT: 2,
    IN_OUT: 3,
})

function getCubicBezier(progress, x0, x1, x2, x3) {
    const reversedProgress = 1 - progress

    return (
        reversedProgress ** 3 * x0
        + 3 * reversedProgress ** 2 * progress * x1
        + 3 * reversedProgress * progress ** 2 * x2
        + progress ** 3 * x3)
}

/**
 * Custom easing
 * @param {number} easingId EASING ID
 * @param {number} progress percentage of completion (0.1 = 10%)
 * @returns {number} eased percentage of completion (0.1 = 10%)
 */
function getEasingMultiplier(easingId, progress) {
    switch (easingId) {
        case EASING.EASE:
            return getCubicBezier(progress, 0, 0.75, 0.9, 1)
        case EASING.EASE_IN:
            return getCubicBezier(progress, 0, 0, 0.58, 1)
        case EASING.EASE_OUT:
            return getCubicBezier(progress, 0, 0.42, 1, 1)
        case EASING.EASE_IN_OUT:
            return getCubicBezier(progress, 0, 0.1, 1, 1)
    }

    return progress
}
/**
 * Single animation 
 */
export class Animation {
    /** object of animation */
    target

    /** name of the field that is to be animated */
    key

    /** initial value of given key */
    initialValue

    /** final value of given key */
    finalValue

    /** duration of the animation in milliseconds */
    duration

    /** delay in milliseconds before animation progress */
    delay

    /** id of an ease function, that is to be applied */
    easing

    /** progress of animation (0.1 = 10%) */
    progress = 0

    /** real progress of animation (excluding delay part) 0.1 = 10% */
    realProgress = 0

    /** callback on start, or if the animation is winded through the 0% mark */
    onStart

    /**
     * callback on any update or winding
     * @param {number} progress progress of this animation (including delay)
     */
    onUpdate

    /**
     * callback that is executed while delay
     * @param {number} progress progress of delay (0.1 = 10%)
     */
    onDelay

    /**
     * callback on delay finish
     */
    onDelayFinish

    /**
     * callback on every change of real progress (excluding delay)
     * @param {number} progress real progress, excluding delay (0.1 = 10%)
     */
    onProgress

    /** callback that fires when real progress hits 100% or when winded through 100% */
    onFinish

    /** 
     * Callbacks attached to timestamps in milliseconds,
     * will be executed if the animation is winded through
     * breakpoint corresponding to the time code.
     * Specified in the format:
     * {
     *  1000: () => {},
     *  2500: () => {},
     *  3000: () => {},
     * }
     */
    callbacks = {}
    elapsedMilliseconds = 0

    constructor(descriptor) {
        descriptor && this.setup(descriptor)
    }

    /**
     * @param {object} target object of animation
     * @param {string} key name of the field that is to be animated
     * @param {number} initialValue initial value of given key
     * @param {number} finalValue final value of given key
     * @param {number} duration duration of the animation in milliseconds
     * @param {number} delay delay in milliseconds before animation progress
     * @param {number} easing callback that fires when real progress hits 100% or when winded through 100%
     * @param {function} onStart callback on start, or if the animation is winded through the 0% mark
     * @param {function} onDelay callback that is executed while delay
     * @param {function} onDelayFinish callback on delay finish
     * @param {function} onProgress callback on every change of real progress (excluding delay)
     * @param {function} onUpdate callback on any update or winding
     * @param {function} onFinish callback that fires when real progress hits 100% or when winded through 100%
     * @param {object} callbacks
     * Callbacks attached to timestamps in milliseconds,
     * will be executed if the animation is winded through
     * breakpoint corresponding to the time code.
     * Specified in the format:
     * {
     *  1000: () => {},
     *  2500: () => {},
     *  3000: () => {},
     * }
     * @returns {Animation}
     */
    setup({
        target,
        key,
        initialValue = target?.[key],
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
        this.key = key
        this.initialValue = initialValue
        this.finalValue = finalValue
        this.duration = duration
        this.delay = delay
        this.easing = easing
        this.target = target
        this.onStart = onStart
        this.onUpdate = onUpdate
        this.onDelay = onDelay
        this.onDelayFinish = onDelayFinish
        this.onProgress = onProgress
        this.onFinish = onFinish
        this.callbacks = callbacks

        return this
    }

    /**
     * Winds animation to give progress
     * @param {number} progress progress (0.1 = 10%)
     * @param {boolean} isResponsive if touched callbacks should be called
     * @returns {Animation}
     */
    wind(progress, isResponsive = true) {
        const {
            target,
            key,
            initialValue,
            finalValue,
            duration,
            delay,
            easing,
            onStart,
            onUpdate,
            onDelay,
            onDelayFinish,
            onProgress,
            onFinish,
            callbacks,
        } = this

        // if (!target) return

        const totalTime = delay + duration

        // percentage of delay relative to total duration
        const delayProgressOffset = delay / totalTime
        // percentage of animation (excluding delay) relative to total duration (which includes delay)
        const progressOffset = 1 - delayProgressOffset
        // real progress will be considered zero while delay
        const realProgress = progress >= delayProgressOffset
            ? (progress - delayProgressOffset) / progressOffset
            : 0

        // callbacks check...
        if (isResponsive) {
            if (this.progress === 0 && progress > 0)
                onStart?.()

            /*
                firing time codes callbacks if progress goes through them
                (that includes delay period)
            */
            callbacks
            && Object.entries(callbacks).forEach(([timeBreakPoint, callback]) => {
                const callProgressMoment = timeBreakPoint / totalTime

                if (
                    (// callback time code is inside progress delta
                        this.progress < callProgressMoment
                        && progress > callProgressMoment
                    )
                    || (// same as onFinish
                        progress === 1
                        && callProgressMoment === 1
                        && this.progress < 1
                    )
                    || (// same as onStart
                        progress > 0
                        && callProgressMoment === 0
                        && this.progress === 0
                    )
                ) {
                    callback()
                }
            })

            // callback receives common progress of animation + its delay
            onUpdate?.(progress)

            if (progress < delayProgressOffset) {
                // callback receives progress of delay (excluding animation itself)
                onDelay?.(progress / delayProgressOffset)
            }

            if (delayProgressOffset && this.realProgress === 0 && realProgress > 0) {
                // fires ones delay is over
                onDelayFinish?.()
            }

            if (this.realProgress !== realProgress) {
                // on real progress of animation (excluding delay)
                onProgress?.(realProgress)
            }

            if (progress === 1 && this.progress < 1) {
                // fires ones real progress hits 100%
                onFinish?.()
            }
        }

        // updating value of target object, of there is any
        if(target) {
            if (typeof target[key] === 'number') {
                // delta is only the case for scalable values
                const valueDelta = finalValue - initialValue

                target[key] = initialValue + valueDelta * getEasingMultiplier(easing, realProgress)
            } else {
                // for non scalable values only of two possible values is switched
                target[key] = progress === 1 ? finalValue : initialValue
            }
        }

        this.realProgress = realProgress
        this.progress = progress

        return this
    }

    /**
     * Winds animation to the given time in milliseconds
     * or to the end bounds of the animation, if given time exceeds limits
     * @param {number} milliseconds time in milliseconds
     * @param {boolean} isResponsive if touched callbacks should fire
     * @returns {Animation}
     */
    windToTime(milliseconds, isResponsive = true) {
        const {duration, delay} = this
        const progress = Math.max(0, Math.min(1, milliseconds / (duration + delay)))

        this.wind(progress, isResponsive)

        return this
    }
}
