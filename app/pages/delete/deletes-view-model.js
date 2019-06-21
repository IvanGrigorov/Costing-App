const { Observable } = require("tns-core-modules/data/observable");
const { CATEGORIES, CURRENCIES } = require("./../../res/Arrays");


class DeletesViewModel extends Observable{

    constructor() {
        super();
        this._labels = [];
        this._labelsValue = ''
        this._dates = ['Today', 'This month', 'This Year']
        this._datesValue = 'Today';
    } 

    get dates() {
        return this._dates;
    }

    get datesValue() {
        return this._datesValue;
    }

    set datesValue(value) {
        this._datesValue = value;
    }

    get labels() {
        return this._labels;
    }

    set labels(value) {
        this._labels = value;
    }

    get labelsValue() {
        return this._labelsValue;
    }

    set labelsValue(value) {
        this._labelsValue = value;
    }
}

module.exports = DeletesViewModel;
