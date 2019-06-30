const { Observable } = require("tns-core-modules/data/observable");
const { CATEGORIES, CURRENCIES } = require("./../../res/Arrays");


class AlertsViewModel extends Observable{

    constructor() {
        super();
        this._switch = false;
        this._fromDate = new Date();
        this._toDate = new Date();
        this._isDateRangeVisible = "collapse";
        this._isPredefinedVisible = "visible";
        this._labelsValue = "None";
        this._labels = ["None"];
        this._currencyValue = "None";
        this._currencies = CURRENCIES;
        this._dates = ['None', 'Today', 'This month', 'This Year']
        this._datesValue = 'None';
        this._repeated = false;
        this._sumValue = 0;
    }

    get currencies() {
        return this._currencies;
    }

    get currencyValue() {
        return this._currencyValue;
    }

    set currencyValue(value) {
        this._currencyValue = value;
    }

    get switch() {
        return this._switch;
    }

    set switch(value) {
        this._switch = value;
        this.isPredefinedVisible = value;
        this.isDateRangeVisible = value;

    }

    get sumValue() {
        return this._sumValue;
    }

    set sumValue(value) {
        this._sumValue = value;
    }

    get repeated() {
        return this._repeated;
    }

    set repeated(value) {
        this._repeated = value;
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


    get fromDate() {
        return this._fromDate;
    }

    set fromDate(value) {
        this._fromDate = value;
    }

    get labels() {
        return this._labels;
    }

    set labels(value) {
        return this._labels.push(value);
    }

    get labelsValue() {
        return this._labelsValue;
    }

    set labelsValue(value) {
        this.tmpLabelsValue = value;
    }

    get toDate() {
        return this._toDate;
    }

    set toDate(value) {
        this._toDate = value;
    }

    set isDateRangeVisible(value) {
        if (!this._switch) {
            this._isDateRangeVisible = "visible";
        }
        else {
            this._isDateRangeVisible = "collapse";
        }
        super.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: "isDateRangeVisible", value: this._isDateRangeVisible });

    }

    set isPredefinedVisible(value) {
        if (this._switch) {
            this._isPredefinedVisible = "visible";
        }
        else {
            this._isPredefinedVisible = "collapse";
        }
        super.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: "isPredefinedVisible", value: this.isPredefinedVisible });

    }

    get isDateRangeVisible() {
        if (!this._switch) {
            return "visible";
        }
        return "collapse";
    }

    get isPredefinedVisible() {
        if (this._switch) {
            return "visible";
        }
        return "collapse";
    }

}

module.exports = AlertsViewModel;
