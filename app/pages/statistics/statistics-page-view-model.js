const { Observable } = require("tns-core-modules/data/observable");
const { convertEurosAndDollarsToLevas } = require("./../../res/Currencies");
const { convertDate } = require("./../../res/helpfulFunctions")



class StatisticsViewModel extends Observable{

    constructor() {
        super();
        this._spendings = [];
        this._maxSum;
        this._maxSumEuros;
        this._maxSumDollars;
        this.maxSumLevas;
        this._labels = ["All"];
        this._labelsValue = 'All';
        this._dates = ['None', 'Today', 'This month', 'This Year']
        this._datesValue = 'None';
        this._datefilteringFunc = undefined;
        this._labelfilteringFunc = undefined;

        this._filteringFunc = undefined;

    }


    get datefilteringFunc() {
        return this._datefilteringFunc;
    }

    set datefilteringFunc(value) {
        return this._datefilteringFunc = value;
    }

    get labelfilteringFunc() {
        return this._labelfilteringFunc;
    }

    set labelfilteringFunc(value) {
        this._labelfilteringFunc = value;
    }





    get label() {
        return "Label: ";
    }

    get date() {
        return "Date: ";
    }

    get labels() {
        return this._labels;
    }

    set labels(value) {
        return this._labels.push(value);
    }
    get dates() {
        return this._dates;
    }

    get datesValue() {
        return this._datesValue;
    }

    set datesValue(value) {
        this.tmpDatesValue = value;
        this.clearSums();
        this._datesValue = value;
        this.filteringFunc = this.myfilteringFunc;
        super.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: "filteringFunc", value: this._filteringFunc });

    }


    clearSums() {
        this.maxSum = 0;
        this.maxSumLevas = 0;
        this.maxSumEuros = 0;
        this.maxSumDollars = 0;
    }
    
    get labelsValue() {
        return this._labelsValue;
    }

    set labelsValue(value) {
        this.tmpLabelsValue = value;
        this.clearSums();
        this._labelsValue = value;
        this.filteringFunc = this.myfilteringFunc;
        super.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: "filteringFunc", value: this._filteringFunc });
    }

    get spendings() {
        return this._spendings;
    }

    set spendings(value) {
        this._spendings = value;
    }

    
    get maxSum() {
        return this._maxSum;
    }

    set maxSum(value) {
        this._maxSum = value;
        //super.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: "maxSum", value: this._maxSum });
    }

    get maxSumEuros() {
        return this._maxSumEuros;
    }

    set maxSumEuros(value) {
        this._maxSumEuros = value;
        //super.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: "maxSum", value: this._maxSum });
    }

    get maxSumDollars() {
        return this._maxSumDollars;
    }

    set maxSumDollars(value) {
        this._maxSumDollars = value;
        //super.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: "maxSum", value: this._maxSum });
    }

    get maxSumText() {
        return "Total amount: " + this.maxSum;
    }

    labelFilteringFunc(value) {
        const me = this;
        if (value.label == me.tmpLabelsValue || me.tmpLabelsValue == "All") {
            return true;
        }
        else if (!me.tmpLabelsValue) {
            return true;
        }
        return false;
        
    }

    dateFilteringFunc(value) {
        const me = this;
        switch (me.tmpDatesValue) {
            case 'Today': {
                const formattedDate = this.convertDate(new Date());
                if (value.when == formattedDate) {
                    return true;
                }
                return false;
            }
            case 'This month': {
                const date = new Date();
                const firstDay = this.convertDate(new Date(date.getFullYear(), date.getMonth(), 1));
                return me.filterByDate(me, firstDay, value);

            }
            case 'This year': {
                const date = new Date();
                const firstDay = this.convertDate(new Date(date.getFullYear(), 0, 1));
                return me.filterByDate(me, firstDay, value);

            }
            case 'None': {
                return true;
            }
            default: {
                return true;
            }
        }
    }

    filterByDate(scope, dateAfter, record) {
        if (record.when > dateAfter) {
            return true;
        }
        return false;
    }

    removeItem(id) {
        this.clearSums();
        this._spendings = this._spendings.filter((spending) => {
            if (spending.id != id) {
                this.updateMoney(spending);
                return true;
            }
            return false;
        });
        super.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: "spendings", value: this._spendings });

    }

    get myfilteringFunc() {
        const me = this;
        return (value) => {
            if (me.dateFilteringFunc(value) && me.labelFilteringFunc(value)) {
                this.updateMoney(value);
                return true;
            }
            return false; 
        };
    }

    updateMoney(record) {
        const currency = record.currency;
        const varName = 'maxSum' + currency;
        this[varName] += + record.sum
        const maxSum = convertEurosAndDollarsToLevas(this.maxSumEuros, this.maxSumDollars, this.maxSumLevas);
        this.maxSum = maxSum;
        super.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: "maxSum", value: this._maxSum });
        super.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: "maxSumEuros", value: this._maxSumEuros });
        super.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: "maxSumDollars", value: this._maxSumDollars });
    }

    get filteringFunc() {
        this._filteringFunc;
    }

    set filteringFunc(value) {
        this.maxSum = 0;
        this.maxSumDollars = 0;
        this.maxSumEuros = 0;
        this._filteringFunc = value;
        super.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: "filteringFunc", value: this._filteringFunc });
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

module.exports = {
    StatisticsViewModel: StatisticsViewModel 
}