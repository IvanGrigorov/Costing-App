/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/
const DbManager = require("../../db/DbManager")
const NewSpendingViewModel = require("./new-spending-view-model");
const {getAlertsByDate, shouldShowAlert} = require("./../../res/AlertsManager");
const dialogs = require("tns-core-modules/ui/dialogs");


function onNavigatingTo(args) {
    const page = args.object;
    let bindingContext = new NewSpendingViewModel();
    const SQL = "SELECT `label` FROM labels WHERE `is_deleted` = 0";
    const DbManagerInstance = new DbManager();
    DbManagerInstance.getDbConnection().then(db => {
        DbManagerInstance.allQuery(db, SQL, []).then((labels) => {
            let labelsToAdd = [];
            for (let i = 0; i < labels.length; i++) {
                labelsToAdd.push(labels[i][0]);
            }
            bindingContext.labels = labelsToAdd;
            if (labelsToAdd.length) {
                bindingContext.isLabelOptionVisible = true;
                bindingContext.labels.push("None");
            }
            page.bindingContext = bindingContext;
        });
    });
}

function showDateAlert(msg) {
    dialogs.alert(msg).then(() => {
        console.log("VALIDATION TEST");
    });
}

function checkIfFieldsAreEmpty(bindingContext) {
    if ((!bindingContext.labelValue && bindingContext.isLabelOptionVisible != "collapse")||
        !bindingContext.forValue ||
        !bindingContext.categoryValue ||
        !bindingContext.sumValue ||
        !bindingContext.currencyValue ||
        !bindingContext.whenValue ) {
            return true;
        }
        return false;
}

function onSubmitItemTap(args) {
    const button = args.object;
    const page = button.page;
    const bindingContect = page.bindingContext;
    var regex = RegExp('\\d{2}\/\\d{2}\/\\d{4}', 'g');
    if (!regex.test(bindingContect.whenValue)) {
        showDateAlert("Wrong date format ! Please use dd/mm/yyyy");
        return;
    }
    if (checkIfFieldsAreEmpty(bindingContect)) {
        showDateAlert("Fields cannot be empty");
        return;
    }
    getAlertsByDate(bindingContect.whenValue).then((alerts) => {
        shouldShowAlert(alerts, bindingContect).then(() => {
            const DbManagerInstance = new DbManager();
            const SQL = "INSERT INTO spending(`for`, `category`, `sum`, `currency`, `when`, `label`) VALUES (:for, :category, :sum, :currency, :when, :label)";
            const PARAMS_ARRAY = [
                {
                    key: ':for',
                    value: bindingContect.forValue
                },
                {
                    key: ':category',
                    value: bindingContect.categoryValue
                },
                {
                    key: ':sum',
                    value: bindingContect.sumValue
                },
                {
                    key: ':currency',
                    value: bindingContect.currencyValue
                },
                {
                    key: ':when',
                    value: bindingContect.whenValue
                },
                {
                    key: ':label',
                    value: bindingContect.labelValue
                }
            ]
            DbManagerInstance.getDbConnection().then(db => {
                DbManagerInstance.executeParamQuery(db, SQL, PARAMS_ARRAY).then(() => {
                    dialogs.alert("New spending added !").then(() => {
                        console.log("SUCCESSFULL INSERT");
                    })},
                    error => {
                        dialogs.alert("New spending not added !").then(() => {
                            console.log("SOME ERROR", error);
                        }) 
                    }
                );
            });
        }).catch((alert) => {
            let msg = "You exceed maximum amount of " + alert[3] + " " + alert[4] + " for the period of " + alert[0] + " - " + alert[1];
            if (alert[2] != "None") {
                msg += " and label " + alert[2];
            } 
            msg += " !";
            dialogs.alert(msg).then(() => {
                console.log("SOME ALERT", error);
            });
        });
    })
}

module.exports = {
    onNavigatingTo: onNavigatingTo,
    onSubmitItemTap: onSubmitItemTap
}
