import { CoinView } from "../../particles/collapseEffects/coins/CoinView";

export class ChipView extends CoinView {
    initFaces(prefix = 'coin') {
        super.initFaces('chip')
    }
}