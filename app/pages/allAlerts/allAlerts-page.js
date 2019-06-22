/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/
const DbManager = require("../../db/DbManager")
const { getAllAlerts } = require("./../../res/AlertsManager")
const AllAlertsViewModel = require("./allAlerts-view-model");
const dialogs = require("tns-core-modules/ui/dialogs");


function onNavigatingTo(args) {
    const page = args.object;
    let bindingContext = new AllAlertsViewModel();
    getAllAlerts().then((alerts) => {
        let alertsArray = [];
        for (let i = 0; i < alerts.length; i++) {
            alertsArray.push({
                id: alerts[i][0],
                from: alerts[i][1],
                to: alerts[i][2],
                sum: alerts[i][4],
                interval: alerts[i][5],
                label: alerts[i][3],
                repeating: alerts[i][6]
            });
        }
        bindingContext.alerts = alertsArray;
        page.bindingContext = bindingContext;

    })
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
    dialogs.confirm("Delete alert ?").then(function (result) {
        if (result) {
            deleteAlert(data, listViewBindingContext, listView);
        }
        console.log("Dialog result: " + result);
    });
}

function deleteAlert(data, listViewBindingContext, listView) {
    const SQL = "DELETE FROM alerts WHERE `id` = " + "'" + data.id + "'";

    const DbManagerInstance = new DbManager();
    DbManagerInstance.getDbConnection().then(db => {
        DbManagerInstance.executeQuery(db, SQL).then(() => {
            dialogs.alert("Delete successfull !").then(() => {
                console.log("SUCCESSFULL DELETE");
            })
        })
    });
    listViewBindingContext.removeAlert(data.id);
    listView.refresh();
}

module.exports = {
    onNavigatingTo: onNavigatingTo,
    onSwipeCellStarted: onSwipeCellStarted
}
