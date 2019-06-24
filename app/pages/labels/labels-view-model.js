const { Observable } = require("tns-core-modules/data/observable");

class NewLabelViewModel extends Observable{

    constructor() {
        super();
        this._label = 'Label : ';
        this._labelValue = '';
        this._labels = [];
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
        this._labelValue= value;
    }

    removeLabel(id) {
        this._labels = this._labels.filter((labels) => {
            if (labels.id != id) {
                return true;
            }
            return false;
        });
        super.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: "labels", value: this._labels });
    }
}

module.exports = NewLabelViewModel;
