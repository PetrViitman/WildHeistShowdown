import { PopupSelectorView } from "./PopupSelectorView";

export class AutoplaySelectorView extends PopupSelectorView {

    initTexts(dictionary) {
        super.initTexts(dictionary,)
        this.headerView.setText(dictionary.set_your_autoplay)
        this.hintView.setText(dictionary.slide_to_select)
    }

    initReelSelector(assets) {
        super.initReelSelector(assets, false)

        this.reelSelectorView.formatOptions = (options) => {
            return options.map(value => value === Infinity ? '∞' : value )
        }

        this.reelSelectorView.scale.set(3)

        this.reelSelectorView.setEditable = () => {}
    }
}