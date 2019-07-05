const { Observable } = require("tns-core-modules/data/observable");
const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;

class NewGraphsModel extends Observable{

    constructor() {
        super();
        this._fromDate = new Date();
        this._toDate = new Date();
        this._isChartVisible =  'visible';
        this._generationData =  new ObservableArray();
    }

    get fromDate() {
        return this._fromDate;
    }

    set fromDate(value) {
        this._fromDate = value;
    }

    get toDate() {
        return this._toDate;
    }

    set toDate(value) {
        this._toDate = value;
    }

    get isChartVisible() {
        return this._isChartVisible;
    }

    set isChartVisible(value) {
        this._isChartVisible = value;
    }

    get generationData() {
        return this._generationData;
    }

    set generationData(value) {
        this._generationData = value;
    }
}

module.exports = NewGraphsModel;
