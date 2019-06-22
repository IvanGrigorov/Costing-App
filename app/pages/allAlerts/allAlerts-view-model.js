const { Observable } = require("tns-core-modules/data/observable");

class AllAlertsViewModel extends Observable{

    constructor() {
        super();
        this._alerts = [];
    }

    get alerts() {
        return this._alerts;
    }

    set alerts(value) {
        this._alerts = value;
    }

    removeAlert(id) {
        this._alerts = this._alerts.filter((alert) => {
            if (alert.id != id) {
                return true;
            }
            return false;
        });
        super.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: "alerts", value: this._alerts });
    }

}

module.exports = AllAlertsViewModel;
