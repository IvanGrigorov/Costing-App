/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

const HomeViewModel = require("./home-view-model");
const DbManager = require("../../db/DbManager");
const { CREATE_SPENDINGS_TABLE, CREATE_LABEL_TABLE, CREATE_LABEL_TO_SPENDING_TABLE, CREATE_ALERTS_TABLE, CREATE_NOTIFICATIONS_TABLE } = require("../../db/DbInitialScripts");
const { isThereConnection } = require("./../../connectivity/connetctivity");
const { getBGNCourse } = require("./../../http/getCurrencyCoureses");
const { shouldWeUseCache } = require("./../../sharedSettings/settings");
const appSettings = require("application-settings");
const dialogs = require("tns-core-modules/ui/dialogs");
const { getRepeatedAlerts, insertPredefinedAlerts } = require("./../../res/AlertsManager");
const application = require("tns-core-modules/application");
const { convertEurosAndDollarsToLevas, convertCurrenciesToSelected, findShortNameByLongName } = require("./../../res/Currencies");



function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new HomeViewModel();
    initApp();
}

function addAplicationEvents() {
    application.on(application.suspendEvent, (args) => {
        appSettings.remove("isLaunched");
    });

    application.on(application.exitEvent, (args) => {
        appSettings.remove("isLaunched");
    });
}

function initApp() {
    const DbManagerInstance = new DbManager(); 
    
    if (!appSettings.getString('currency')) {
        appSettings.setString('currency', 'Bulgarian lev');
    }

    if (!shouldWeUseCache()) {
        if (!isThereConnection()) {
            dialogs.alert("No connection! Build in rates will be used !").then(() => {
                console.log("Build in rates will be used");
            })
            return;
        }
        else {
            const promissesForCurrencies = [
                getBGNCourse('AUD'),
                getBGNCourse('BGN'),
                getBGNCourse('BRL'),
                getBGNCourse('CAD'),
                getBGNCourse('CHF'),
                getBGNCourse('USD'),
                getBGNCourse('EUR')
            ];
            Promise.all(promissesForCurrencies).then((currencies) => {
                const currentCurrency = (appSettings.getString('currency')) ? findShortNameByLongName(appSettings.getString('currency')) : 'BGN';
                currencies[6].rates.EUR = 1.0;
                appSettings.setNumber("AUD", currencies[0].rates[currentCurrency]);
                appSettings.setNumber("BGN", currencies[1].rates[currentCurrency]);
                appSettings.setNumber("BRL", currencies[2].rates[currentCurrency]);
                appSettings.setNumber("CAD", currencies[3].rates[currentCurrency]);
                appSettings.setNumber("CHF", currencies[4].rates[currentCurrency]);
                appSettings.setNumber("USD", currencies[5].rates[currentCurrency]);
                appSettings.setNumber("EUR", currencies[6].rates[currentCurrency]);
                appSettings.setString("dateUpdated", new Date().toString());

            },
            (error) => {
                appSettings.remove("EUR");
                appSettings.remove("USD");
                dialogs.alert("No connection! Build in rates will be used !").then(() => {
                    console.log("Build in rates will be used");
                })
            })
        }
    }
    
    addAplicationEvents();
    if (appSettings.getBoolean("isLaunched")) {
        return
    }
    appSettings.setBoolean("isLaunched", true);

    DbManagerInstance.getDbConnection().then(db => {
        const dbPromisesArray = [
            DbManagerInstance.executeQuery(db, CREATE_SPENDINGS_TABLE),
            DbManagerInstance.executeQuery(db, CREATE_LABEL_TABLE),
            DbManagerInstance.executeQuery(db, CREATE_ALERTS_TABLE),
            DbManagerInstance.executeQuery(db, CREATE_NOTIFICATIONS_TABLE),
            getRepeatedAlerts()

        ]
        Promise.all(dbPromisesArray).then((data) => {
            const alerts = data[4];
            if (alerts.length) {
                const alertsToInsert = insertPredefinedAlerts(alerts);
                Promise.all(alertsToInsert).then(() => {
                    console.log("Database created");
                    console.log("Repeated alerts");
                })
            }
            else {
                console.log("Database created");
                console.log("No repeated alerts");
            }
        })
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

function onAlertsTap(args) {
    const button = args.object;
    const page = button.page;
    page.frame.navigate("pages/alerts/alerts-page");
}

function onAllAlertsTap(args) {
    const button = args.object;
    const page = button.page;
    page.frame.navigate("pages/allAlerts/allAlerts-page");
}

function onNotificationsTap(args) {
    const button = args.object;
    const page = button.page;
    page.frame.navigate("pages/notifications/notifications-page");
}

function onCreditsTap(args) {
    const button = args.object;
    const page = button.page;
    page.frame.navigate("pages/credits/credits-page");
}

function onCurrenciesTap(args) {
    const button = args.object;
    const page = button.page;
    page.frame.navigate("pages/currency/currency-page");
}


function onGraphsTap(args) {
    const button = args.object;
    const page = button.page;
    page.frame.navigate("pages/graphs/graphs-page");
}

module.exports = {
    onNavigatingTo: onNavigatingTo,
    onNewSpendingTap: onNewSpendingTap,
    onStatisticsTap: onStatisticsTap,
    onNewLabelsTap: onNewLabelsTap,
    onDeletesTap: onDeletesTap,
    onAlertsTap: onAlertsTap,
    onAllAlertsTap: onAllAlertsTap,
    onNotificationsTap: onNotificationsTap,
    onCreditsTap: onCreditsTap,
    onCurrenciesTap: onCurrenciesTap,
    onGraphsTap: onGraphsTap
}
