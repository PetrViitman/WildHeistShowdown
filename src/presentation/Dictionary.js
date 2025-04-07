import { Assets } from "pixi.js"

function getDefaultLocale() {
	if (navigator.languages != undefined) 
	  return navigator.languages[0]; 
	return navigator.language;
}

const RTL_LANGUAGE_CODES = ['ar', 'he', 'fa', 'ur', 'sd', 'ps', 'yi']
const BAD_RASTER_LANGUAGE_CODES  = ['km', 'my']
const FALLBACK_LANGUAGE_CODE = 'en'

export const RTL_EXCEPTIONS = []

async function getJsonData(path) {
    const text = await Assets.load({
		src: path,
		loadParser: 'loadTxt'
	})

    return JSON.parse(text)
}

export function flipRTLPlaceholders(dictionary) {
    const specialSymbols = ` ║'½/()`
    const endPointSymbols = '!?.,•-'
    const breakPointSymbols = '×1234567890{}ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!?:_!@#$%^&*-,.•'
    Object.entries(dictionary).forEach(([key, text]) => {
        let shouldBeSkipped = true

        for(let i = 0; i < text.length; i++) {
            if(
                !breakPointSymbols.includes(text[i])
                && !endPointSymbols.includes(text[i])
                && !specialSymbols.includes(text[i])
            ) {
                shouldBeSkipped = false
                break
            }
        }

        if (shouldBeSkipped) {
            dictionary[key] += '®'

            return
        }
        const fragments = []
        let fragment = ''
        let isBreakpointSymbol = false
        for(let i = 0; i < text.length; i++ ) {
            const symbol = text[i]
            
            if(breakPointSymbols.includes(symbol) !== isBreakpointSymbol) {
                isBreakpointSymbol = breakPointSymbols.includes(symbol)

                fragment.length && fragments.push(fragment)
                fragment = ''
            }
            fragment += symbol
        }

        fragment.length && fragments.push(fragment)

        let finalText = ''

        for(let i = fragments.length - 1; i >= 0; i--) {
            let fragment = fragments[i]
            let offset = ''
            
            for (let j = fragment.length - 1; j >= 0; j --) {
                const character = fragment[j]

                if (endPointSymbols.includes(character)) {
                    offset = character + offset
                } else {
                    break
                }
            }

            if(offset.length) {
                fragment = offset + fragment.substring(0, fragment.length - offset.length)
            }

            finalText += "\u200E" + fragment
        }
        
        dictionary[key] = finalText
    })
}

export async function getDictionary(languageCode = getDefaultLocale()) {
    let dictionary = {}
    try { dictionary = await getJsonData('./translations/' + languageCode + '.json')}
    catch (error) {
        try { dictionary = await getJsonData('./translations/' + FALLBACK_LANGUAGE_CODE + '.json')} catch (error) {}
    }

    if(isRTLTextDirection(languageCode)) {
        flipRTLPlaceholders(dictionary)
    }

	return dictionary
}

export function isBadRasterLanguage(languageCode) {
    return BAD_RASTER_LANGUAGE_CODES.includes(languageCode)
}

export function isRTLTextDirection(languageCode) {
    return RTL_LANGUAGE_CODES.includes(languageCode)
}