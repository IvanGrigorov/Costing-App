const { Observable } = require("tns-core-modules/data/observable");

class NotificationViewModel extends Observable{


    constructor() {
        super();
        this._notifications = [];
        this._title = "";
        this._time = new Date();
        this._repeats = ["day", "week", "month", "year"];
        this._repeatValue = "day";
    }

    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
    }


    get time() {
        return this._time;
    }

    set time(value) {
        this._time = value;
    }

    get repeats() {
        return this._repeats;
    }

    set repeats(value) {
        this._repeats = value;
    }

    get repeatValue() {
        return this._repeatValue;
    }

    set repeatValue(value) {
        this._repeatValue = value;
    }

    get notifications() {
        return this._notifications;
    }

    set notifications(value) {
        this._notifications = value;
    }

    removeNotification(id) {
        this._notifications = this._notifications.filter((notification) => {
            if (notification.id != id) {
                return true;
            }
            return false;
        });
        super.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: "notifications", value: this._notifications });
    }
}

module.exports = NotificationViewModel;
