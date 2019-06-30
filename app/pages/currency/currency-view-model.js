const { Observable } = require("tns-core-modules/data/observable");
const { CATEGORIES, CURRENCIES } = require("./../../res/Arrays");

class CurrenciesViewModel extends Observable{

    constructor() {
        super();
        this._label = 'Currency: ';
        this._currencyValue = '';
        this._currencies = CURRENCIES;
    }

    get currencies() {
        return this._currencies;
    }

    set currencies(value) {
        this._currencies = value;
    }

    get label() {
        return this._label;
    }

    set label(value) {
        this._label = value;
    }

    get currencyValue() {
        return this._currencyValue;
    }

    set currencyValue(value) {
        this._currencyValue= value;
    }

}

module.exports = CurrenciesViewModel;
