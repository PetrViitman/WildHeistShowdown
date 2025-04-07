import {
	RANDOM_REELS_SYMBOLS_IDS,
	REELS_COUNT,
	REELS_LENGTHS,
	REGULAR_SYMBOLS_IDS,
} from "./Constants"

export function getRandomSymbolId(reelIndex) {
	const randomSymbolsIds = RANDOM_REELS_SYMBOLS_IDS[reelIndex]

	return randomSymbolsIds[
		Math.trunc(Math.random() * randomSymbolsIds.length)
	]
}

export function generateMatrix(width = REELS_COUNT) {
	return new Array(width).fill(0).map((_, x) => new Array(REELS_LENGTHS[x]).fill(0))
}

export function formatMoney({value, currencyCode, isLTRTextDirection = true}) {
	let formattedValue = value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').split(",").join(" ")

	if(currencyCode) {
		if (isLTRTextDirection) {
			formattedValue = formattedValue + ' ' + currencyCode
		} else {
			formattedValue = currencyCode + ' ' + formattedValue
		}
	}

	return formattedValue
}

/**
 * random symbols, no win combinations
 */
export function getRandomLoseReels() {
	const reels = new Array(REELS_COUNT).fill(0).map(_ => [])

	let availableSymbols = [...REGULAR_SYMBOLS_IDS]
	for (let x = 0; x < reels.length; x++) {
		for (let y = 0; y < REELS_LENGTHS[x]; y++) {
			if (!availableSymbols.length)
				availableSymbols = [...REGULAR_SYMBOLS_IDS]
			
			const randomSymbolIndex = Math.trunc(Math.random() * availableSymbols.length)
			reels[x][y] = availableSymbols[randomSymbolIndex]
			availableSymbols.splice(randomSymbolIndex, 1)
		}
	}

	return reels
}


export function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
export function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

export function isIos() {
    return /iPhone|iPad|iPod/.test(navigator.userAgent) || 
           (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

export function setViewport(metaContent) {
    let meta = document.querySelector('meta[name="viewport"]');
    
    if (meta) {
        meta.setAttribute("content", metaContent);
    } else {
        meta = document.createElement("meta");
        meta.name = "viewport";
        meta.content = metaContent;
        document.head.appendChild(meta);
    }
}
