/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/
const DbManager = require("../../db/DbManager")
const AlertsViewModel = require("./alerts-view-model");
const dialogs = require("tns-core-modules/ui/dialogs");
const { returnDateRangeForPredefinedAlert } = require("./../../res/AlertsManager")
const { convertDate } = require("./../../res/helpfulFunctions")

function onNavigatingTo(args) {
    const page = args.object;
    const bindingContext = new AlertsViewModel();

    SQL = "SELECT `label` FROM labels WHERE `is_deleted` = 0";
    const DbManagerInstance = new DbManager();
    DbManagerInstance.getDbConnection().then(db => {
        DbManagerInstance.allQuery(db, SQL, []).then((labels) => {
            let labelsToAdd = [];
            for (let i = 0; i < labels.length; i++) {
                bindingContext.labels.push(labels[i][0]);
            }
            //statisticsViewModel.labels = labelsToAdd;
            page.bindingContext = bindingContext;
        });
    });
}

function onSubmitItemTap(args) {
    const button = args.object;
    const page = button.page;
    const bindingContext = page.bindingContext;
    if (!bindingContext.switch) { 
        dateRangeSubmit(bindingContext);
    }
    else {
        predefinedSubmit(bindingContext);
    }

}

function dateRangeSubmit(alertData) {
    const DbManagerInstance = new DbManager();
    const SQL = "INSERT INTO alerts( `from`, `to`, `label`, `sum`, `currency`, `interval_as_text`, `repeat`) VALUES (:from, :to, :label, :sum, :currency, :interval_as_text, :repeat)";
    const PARAMS_ARRAY = [
        {
            key: ':from',
            value: convertDate(alertData.fromDate.toString())
        },
        {
            key: ':to',
            value: convertDate(alertData.toDate.toString())
        },
        {
            key: ':label',
            value: alertData.labelsValue
        },
        {
            key: ':sum',
            value: alertData.sumValue
        },
        {
            key: ':currency',
            value: alertData.currencyValue
        },
        {
            key: ':interval_as_text',
            value: "None"
        },
        {
            key: ':repeat',
            value: 0
        }
    ]
    DbManagerInstance.getDbConnection().then(db => {
        DbManagerInstance.executeParamQuery(db, SQL, PARAMS_ARRAY).then(() => {
            dialogs.alert("New alert added !").then(() => {
                //console.log("SUCCESSFULL INSERT");
            })},
            error => {
                dialogs.alert("New alert not added !").then(() => {
                    //console.log("SOME ERROR", error);
                }) 
            }
        );
    });
}

function predefinedSubmit(alertData) {
    const DbManagerInstance = new DbManager();
    const SQL = "INSERT INTO alerts( `from`, `to`, `label`, `sum`, `currency`, `interval_as_text`, `repeat`) VALUES (:from, :to, :label, :sum, :currency, :interval_as_text, :repeat)";
    const PARAMS_ARRAY = [
        {
            key: ':from',
            value: "None"
        },
        {
            key: ':to',
            value: "None"
        },
        {
            key: ':label',
            value: alertData.labelsValue
        },
        {
            key: ':sum',
            value: alertData.sumValue
        },
        {
            key: ':currency',
            value: alertData.currencyValue
        },
        {
            key: ':interval_as_text',
            value: alertData.datesValue
        },
        {
            key: ':repeat',
            value: (alertData.repeated) ? 1 : 0
        }
    ]
    DbManagerInstance.getDbConnection().then(db => {
        DbManagerInstance.executeParamQuery(db, SQL, PARAMS_ARRAY).then(() => {
            insertPredefinedAsDate(alertData);
        });
    });
}

function insertPredefinedAsDate(alertData) {
    const dateRange = returnDateRangeForPredefinedAlert(alertData.datesValue);
    alertData.fromDate = dateRange.from;
    alertData.toDate = dateRange.to;
    dateRangeSubmit(alertData)

}



module.exports = {
    onNavigatingTo: onNavigatingTo,
    onSubmitItemTap: onSubmitItemTap,
}
