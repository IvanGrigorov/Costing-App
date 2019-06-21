/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

const HomeViewModel = require("./home-view-model");
const DbManager = require("../../db/DbManager");
const { CREATE_SPENDINGS_TABLE, CREATE_LABEL_TABLE, CREATE_LABEL_TO_SPENDING_TABLE } = require("../../db/DbInitialScripts");
const { isThereConnection } = require("./../../connectivity/connetctivity");
const { getBGNCourse } = require("./../../http/getCurrencyCoureses");
const { shouldWeUseCache } = require("./../../sharedSettings/settings");
const appSettings = require("application-settings");
const dialogs = require("tns-core-modules/ui/dialogs");

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new HomeViewModel();

    const DbManagerInstance = new DbManager(); 
    
    if (!shouldWeUseCache()) {
        if (isThereConnection()) {
            getBGNCourse('USD').then((r) => {
                appSettings.setNumber("USD", r.rates.BGN);
                getBGNCourse('EUR').then((r) => {
                    appSettings.setNumber("EUR", r.rates.BGN);
                    appSettings.setString("dateUpdated", new Date().toString());

                },
                (e) => {
                    appSettings.remove("EUR");
                    appSettings.remove("USD");
                    dialogs.alert("No connection! Build in rates will be used !").then(() => {
                        console.log("Build in rates will be used");
                    })
                });
            }
            , (e) => {
                appSettings.remove("EUR");
                appSettings.remove("USD");
                dialogs.alert("No connection! Build in rates will be used !").then(() => {
                    console.log("Build in rates will be used");
                })
            });
        }
        else {
            dialogs.alert("No connection! Build in rates will be used !").then(() => {
                console.log("Build in rates will be used");
            })
        }
    }

    DbManagerInstance.getDbConnection().then(db => {
        DbManagerInstance.executeQuery(db, CREATE_SPENDINGS_TABLE).then(() => {
                console.log("DB Spendings Created")
            },
            error => {
                console.log("CREATE TABLE ERROR", error);
            }
        );
        DbManagerInstance.executeQuery(db, CREATE_LABEL_TABLE).then(() => {
                console.log("DB Label Created")
            },
            error => {
                console.log("CREATE TABLE ERROR", error);
            }
        );
        DbManagerInstance.executeQuery(db, CREATE_LABEL_TO_SPENDING_TABLE).then(() => {
                console.log("DB Label To Spending Created")
            },
            error => {
                console.log("CREATE TABLE ERROR", error);
            }
        );
    });
}

function onNewSpendingTap(args) {
    const button = args.object;
    const page = button.page;
    page.frame.navigate("pages/newSpending/new-spending-page");
    
}

function onStatisticsTap(args) {
    const button = args.object;
    const page = button.page;
    page.frame.navigate("pages/statistics/statistics-page");
}

function onNewLabelsTap(args) {
    const button = args.object;
    const page = button.page;
    page.frame.navigate("pages/labels/labels-page");
}

function onDeletesTap(args) {
    const button = args.object;
    const page = button.page;
    page.frame.navigate("pages/delete/deletes-page");
}

module.exports = {
    onNavigatingTo: onNavigatingTo,
    onNewSpendingTap: onNewSpendingTap,
    onStatisticsTap: onStatisticsTap,
    onNewLabelsTap: onNewLabelsTap,
    onDeletesTap: onDeletesTap
}
