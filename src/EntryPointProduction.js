const urlParameters = new URLSearchParams(document.location.search)
const languageCode = urlParameters.get("lang") ?? 'en'
const customVFXLevel = urlParameters.get("vfx")
const customUIOption = urlParameters.get("view")
const sessionId = urlParameters.get("sessionId")

import './polyfills'
import { GameLogic } from './busynessLogic/GameLogic'
import { Presentation } from './presentation/Presentation'

const protocol = window.location.protocol
const hostname = window.location.hostname
const port = 5004

const presentation = new Presentation()
    .setup({
        customVFXLevel,
        customUIOption,
        languageCode,
        wrapperHTMLElementId: 'projectWrapper'
    })

const webAPI = {
    url: document.serviceURL ?? protocol + '//' + hostname + ':' + port + '/',
    get: (route) => fetch(webAPI.url + route, {
        method: "GET",
        credentials: 'include',
        headers: {
            'sessionid': sessionId
        },
    })
        .then(response => response.json())
        .then(data => data)
        .catch(_ => {return {errorCode: -1}}),
    post: (route, data = {}) =>{
        return fetch(
            webAPI.url + route, {
                method: "POST",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'sessionid': sessionId
                },
                body: JSON.stringify(data)
            })
        .then(response => response.json())
        .then(data => {
            console.log('RESPONSE: ', data ) 
            return data
        })
        .catch(_ => {return {errorCode: -1}})
    },
    gameDescription: (data) => webAPI.post('wildHeistShowdown/gameDescription', data),
    makeBet: (data) => webAPI.post('wildHeistShowdown/makeBet', data),
    switchAccount: (data) => {errorCode: 'не реализовано'},
    getGameBonuses: (data) => {return []},
}

new GameLogic({
    webAPI,
    presentation
}).init()
