const { Observable } = require("tns-core-modules/data/observable");

class NewLabelViewModel extends Observable{

    constructor() {
        super();
        this._label = 'Label : ';
        this._labelValue = '';
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
}

module.exports = NewLabelViewModel;
