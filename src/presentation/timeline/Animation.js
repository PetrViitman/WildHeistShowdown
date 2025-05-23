export const EASING = {
    easeInSine: x =>  1 - Math.cos((x * Math.PI) / 2),
    easeOutSine: x => Math.sin((x * Math.PI) / 2),
    easeInOutSine: x => -(Math.cos(Math.PI * x) - 1) / 2,

    easeInQuad: x => x * x,
    easeOutQuad: x => 1 - (1 - x) * (1 - x),
    easeInOutQuad: x => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2,

    easeInCubic: x => x * x * x,
    easeOutCubic: x => 1 - Math.pow(1 - x, 3),
    easeInOutCubic: x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,

    easeInQuart: x => x * x * x * x,
    easeOutQuart: x => 1 - Math.pow(1 - x, 4),
    easeInOutQuart: x => x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2,

    easeInQuint: x => x * x * x * x * x,
    easeOutQuint: x => 1 - Math.pow(1 - x, 5),
    easeInOutQuint: x => x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2,

    easeInExpo: x => x === 0 ? 0 : Math.pow(2, 10 * x - 10),
    easeOutExpo: x => x === 1 ? 1 : 1 - Math.pow(2, -10 * x),
    easeInOutExpo: x => x === 0
        ? 0
        : x === 1
        ? 1
        : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2
        : (2 - Math.pow(2, -20 * x + 10)) / 2,


    easeInCirc: x => 1 - Math.sqrt(1 - Math.pow(x, 2)),
    easeOutCirc: x => Math.sqrt(1 - Math.pow(x - 1, 2)),
    easeInOutCirc: x => x < 0.5
        ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
        : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2,
    
    easeInBack: x => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        
        return c3 * x * x * x - c1 * x * x;
    },
    easeOutBack: x => {
        const c1 = 1.70158;
        const c3 = c1 + 1;

        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    },
    easeInOutBack: x => {
        const c1 = 1.70158;
        const c2 = c1 * 1.525;

        return x < 0.5
            ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
            : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
    },

    easeInElastic: x => {
        const c4 = (2 * Math.PI) / 3;
        
        return x === 0
          ? 0
          : x === 1
          ? 1
          : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4);
    },
    easeOutElastic: x => {
        const c4 = (2 * Math.PI) / 3;
        
        return x === 0
          ? 0
          : x === 1
          ? 1
          : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
    },
    easeInOutElastic: x=> {
        const c5 = (2 * Math.PI) / 4.5;
        
        return x === 0
          ? 0
          : x === 1
          ? 1
          : x < 0.5
          ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
          : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
    },

    easeOutBounce: x => {
        const n1 = 7.5625;
        const d1 = 2.75;
        
        if (x < 1 / d1) {
            return n1 * x * x;
        } else if (x < 2 / d1) {
            return n1 * (x -= 1.5 / d1) * x + 0.75;
        } else if (x < 2.5 / d1) {
            return n1 * (x -= 2.25 / d1) * x + 0.9375;
        } else {
            return n1 * (x -= 2.625 / d1) * x + 0.984375;
        }
    },
    easeInBounce: x =>  1 - EASING.easeOutBounce(1 - x),
    easeInOutBounce: x =>  x < 0.5
        ? (1 - EASING.easeOutBounce(1 - 2 * x)) / 2
        : (1 + EASING.easeOutBounce(2 * x - 1)) / 2,
}

/**
 * Ease function call by name, linear if not found
 * @param {string} easingName easing function name
 * @param {number} progress percentage of completion (0.1 = 10%)
 * @returns {number} eased percentage of completion (0.1 = 10%)
 */
function getEasingMultiplier(easingName, progress) {
    if(!EASING[easingName]) return progress

    return EASING[easingName](progress)
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
     * @param {string} easing easing function name (will return progress as is, if not found)
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

        const totalTime = delay + duration

        // percentage of delay relative to total duration
        const delayProgressOffset = delay / totalTime
        // percentage of animation (excluding delay) relative to total duration (which includes delay)
        const progressOffset = 1 - delayProgressOffset
        // real progress will be considered zero while delay
        const realProgress = getEasingMultiplier(
            easing,
            progress >= delayProgressOffset
                ? (progress - delayProgressOffset) / progressOffset
                : 0)

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

                target[key] = initialValue + valueDelta * realProgress
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
