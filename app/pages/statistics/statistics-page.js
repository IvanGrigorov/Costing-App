const DbManager = require("../../db/DbManager")
const { StatisticsViewModel } = require("./statistics-page-view-model");
const { convertEurosAndDollarsToLevas } = require("./../../res/Currencies");
const dialogs = require("tns-core-modules/ui/dialogs");



function onNavigatingTo(args) {
    const page = args.object;
    let statisticsViewModel = new StatisticsViewModel();
    const DbManagerInstance = new DbManager();
    DbManagerInstance.getDbConnection().then(db => {
        const SQL_Spending = "SELECT `for`, `category`, `sum`, `currency`, `when`, `label`, `id` FROM spending";
        const SQL_labels = "SELECT `label` FROM labels";

        const promissesArray = [
            DbManagerInstance.allQuery(db, SQL_Spending, []),
            DbManagerInstance.allQuery(db, SQL_labels, [])
        ]

        Promise.all(promissesArray).then((results) => {
            prepareSpendings(results[0], statisticsViewModel);
            prepareLabels(results[1], statisticsViewModel);
            page.bindingContext = statisticsViewModel;

        })
    });
}

function prepareSpendings(resultSet, statisticsViewModel) {
    let maxSum = 0;
    this.maxSumDollars = 0;
    this.maxSumEuros = 0;
    this.maxSumLevas = 0;
    for (let i = 0; i < resultSet.length; i++) {
        let test = this['maxSumEuros'];
        statisticsViewModel.pushspending(resultSet[i]);
        const parsedIntSum = parseFloat(resultSet[i][2]);
        if (parsedIntSum) {

            const currency = resultSet[i][3];
            const varName = 'maxSum' + currency;
            this[varName] += + parsedIntSum
        }
    }
    maxSum = convertEurosAndDollarsToLevas(this.maxSumEuros, this.maxSumDollars, this.maxSumLevas);
    statisticsViewModel.maxSumEuros = this.maxSumEuros;
    statisticsViewModel.maxSumDollars = this.maxSumDollars;
    statisticsViewModel.maxSum =  new Number(parseFloat(maxSum)).toFixed(2);
}

function prepareLabels(labels, statisticsViewModel) {
    let labelsToAdd = [];
    for (let i = 0; i < labels.length; i++) {
        statisticsViewModel.labels.push(labels[i][0]);
    }
}

const myFilteringFunc = (value) => {
    return value;
}

function onSwipeCellStarted(args) {
    const swipeLimits = args.data.swipeLimits;
    const listViewBindingContext = args.mainView.parent.parent.bindingContext;
    const listView = args.mainView.parent.parent;
    const data = args.mainView.bindingContext
    swipeLimits.left = 150;
    swipeLimits.threshold = 0;
    setTimeout(() => {
        args.object.notifySwipeToExecuteFinished();
    }, 500);
    dialogs.confirm("Delete spending ?").then(function (result) {
        if (result) {
            deleteItem(data, listViewBindingContext, listView);
        }
        console.log("Dialog result: " + result);
    });
}

function deleteItem(data, listViewBindingContext, listView) {
    const SQL = "DELETE FROM spending WHERE `id` = " + "'" + data.id + "'";

    const DbManagerInstance = new DbManager();
    DbManagerInstance.getDbConnection().then(db => {
        DbManagerInstance.executeQuery(db, SQL).then(() => {
            dialogs.alert("Delete successfull !").then(() => {
                console.log("SUCCESSFULL DELETE");
            })
        })
    });
    listViewBindingContext.removeItem(data.id);
    listView.refresh();
}


module.exports = {
    onNavigatingTo: onNavigatingTo,
    myFilteringFunc: myFilteringFunc,
    onSwipeCellStarted: onSwipeCellStarted,
}
