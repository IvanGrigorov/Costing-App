const { Observable } = require("tns-core-modules/data/observable");
const { CATEGORIES, CURRENCIES } = require("./../../res/Arrays");
const { convertDate } = require("./../../res/helpfulFunctions")


class NewSpendingViewModel extends Observable{

    constructor() {
        super();
        this._for = 'For : ';
        this._category = 'Category: ';
        this._sum = 'Sum: ';
        this._currency = 'Currency: ';
        this._when = 'When: ';
        this._label = 'Label: ';
        this._labelValue = '',
        this._forValue = '';
        this._categoryValue = '';
        this._sumValue = '';
        this._currencyValue = '';
        this._whenValue = convertDate(new Date());
        this._labels = [];
        this._index = 0;
        this._isLabelOptionVisible = false;

    }

    get isLabelOptionVisible() {
        if (this._isLabelOptionVisible) {
            return "visible";
        }
        return "collapse";
    }

    set isLabelOptionVisible(value) {
        this._isLabelOptionVisible = value;
    }

    get labels() {
        return this._labels;
    }

    set labels(value) {
        this._labels = value;
    }

    get label() {
        return this._label;
    }

    set label(value) {
        this._label = value;
    }

    get labelValue() {
        return this._labelValue;
    }

    set labelValue(value) {
        this._labelValue = value;
    }

    get for() {
        return this._for;
    }

    get category() {
        return this._category;
    }

    get sum() {
        return this._sum;
    }

    get currency() {
        return this._currency;
    }

    get when() {
        return this._when;
    }

    get forValue() {
        return this._forValue;
    }

    get categoryValue() {
        return this._categoryValue;
    }

    get sumValue() {
        return this._sumValue;
    }

    get currencyValue() {
        return this._currencyValue;
    }
    
    get whenValue() {
        return this._whenValue;
    }

    get categories() {
        return CATEGORIES;
    }

    get currencies() {
        return CURRENCIES;
    }

    set forValue(value) {
        this._forValue = value;
    }

    set categoryValue(value) {
        this._categoryValue = value;
    }

    set sumValue(value) {
        this._sumValue = value;
    }

    set currencyValue(value) {
        this._currencyValue = value;
    }
    
    set whenValue(value) {
        this._whenValue = value;
    }
}

module.exports = NewSpendingViewModel;
