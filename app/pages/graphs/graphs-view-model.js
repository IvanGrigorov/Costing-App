const { Observable } = require("tns-core-modules/data/observable");
const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;

class NewGraphsModel extends Observable{

    constructor() {
        super();
        this._fromDate = new Date();
        this._toDate = new Date();
        this._isChartVisible =  'visible';
        this._generationData =  new ObservableArray();
        this._spendings = [];
    }

    get spendings() {
        return this._spendings;
    }

    set spendings(value) {
        this._spendings = value;
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

    pushspending(value) {
        const img = this.getImageLink(value[1]);
        this._spendings.push({
            for: value[0],
            category: value[1],
            sum: value[2],
            currency: value[3],
            when: value[4],
            img: img,
            label: value[5],
            id: value[6]
        })
    }

    getImageLink(category) {
        if (!category) {
            return "res://money";
        }
        const categoryToLower = category.toLowerCase();
        return "res://" + categoryToLower;
    }
}

module.exports = NewGraphsModel;
