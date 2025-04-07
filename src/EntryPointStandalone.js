const parametersFromURL = new URLSearchParams(document.location.search)
const languageCode = parametersFromURL.get("lang") ?? 'en'
const customVFXLevel = parametersFromURL.get("vfx")
const customUIOption = parametersFromURL.get("view")

import './polyfills'
import { GameLogic } from './busynessLogic/GameLogic'
import { Presentation } from './presentation/Presentation'
import { webAPI } from './busynessLogic/standaloneService/WebAPI'

const presentation = new Presentation()
	.setup({
		wrapperHTMLElementId: 'projectWrapper',
		customVFXLevel,
		customUIOption,
		languageCode,
	})

new GameLogic({
	webAPI,
	presentation
}).init()
