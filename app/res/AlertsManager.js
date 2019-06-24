const DbManager = require("../db/DbManager")
const {convertEurosAndDollarsToLevas} = require("../res/Currencies")
const { convertDate } = require("./helpfulFunctions")


function getAllAlerts() {
    return new Promise((resolve, reject) => {
        SQL = "SELECT * FROM alerts";
        const DbManagerInstance = new DbManager();
        DbManagerInstance.getDbConnection().then(db => {
            DbManagerInstance.allQuery(db, SQL, []).then((alerts) => {
                resolve(alerts);
            });
        });
    })   
}

function getRepeatedAlerts() {
    return new Promise((resolve, reject) => {
        SQL = "SELECT `label`, `sum`, `interval_as_text` FROM alerts WHERE `repeat` = 1";
        const DbManagerInstance = new DbManager();
        DbManagerInstance.getDbConnection().then(db => {
            DbManagerInstance.allQuery(db, SQL, []).then((alerts) => {
                resolve(alerts);
            });
        });
    })   
}

function insertPredefinedAlerts(alerts) {
    let promissesArray = [];
    for(let i = 0; i < alerts.length; i++) {
        let alertData = {};
        const dateRange = returnDateRangeForPredefinedAlert(alerts[i][2]);
        alertData.fromDate = dateRange.from;
        alertData.toDate = dateRange.to;
        alertData.sumValue = alerts[i][1];
        alertData.labelsValue = alerts[i][0];
        promissesArray.push(
            new Promise((resolve, reject) => {
                const DbManagerInstance = new DbManager();
                const SQL = "INSERT INTO alerts( `from`, `to`, `label`, `sum`, `interval_as_text`, `repeat`) VALUES (:from, :to, :label, :sum, :interval_as_text, :repeat)";
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
                        key: ':interval_as_text',
                        value: "None"
                    },
                    {
                        key: ':repeat',
                        value: 0
                    }
                ]
                DbManagerInstance.getDbConnection().then(db => {
                    SQL_Select = "SELECT * FROM alerts WHERE `from` = '" + PARAMS_ARRAY[0].value + "' AND `to` = '" + PARAMS_ARRAY[1].value + "' AND `label` = '" + PARAMS_ARRAY[2].value + "'";

                    DbManagerInstance.allQuery(db, SQL_Select, []).then((alerts) => {
                        if (!alerts.length) {
                            DbManagerInstance.executeParamQuery(db, SQL, PARAMS_ARRAY).then(() => {
                                resolve()
                            },
                            error => {
                                reject(error);
                            });
                        }
                    });
                });
            })
        )
    }
    return promissesArray;

}

function getAlertsByDate(date) {
    return new Promise((resolve, reject) => {
        SQL = "SELECT `from`, `to`, `label`, `sum` FROM alerts WHERE `from` <= '" + date + "' AND `to` >= '" + date + "'";
        const DbManagerInstance = new DbManager();
        DbManagerInstance.getDbConnection().then(db => {
            DbManagerInstance.allQuery(db, SQL, []).then((alerts) => {
                resolve(alerts);
            });
        });
    })
    
}

function shouldShowAlert(alerts, spendingData) {
    let me = this;
    me.spendingData = spendingData;
    let arrayOfPromisses = [];
    for (let i = 0; i < alerts.length; i++) {
        let SQL = "SELECT `sum`, `currency` FROM spending WHERE `when` >= '" + alerts[i][0] + "' AND `when` <= '" + alerts[i][1]  + "'";
        if (alerts[i][2] != "None") {
            SQL += " AND WHERE `label` = '" + alerts[i][2] + "'"; 
        }
        arrayOfPromisses.push(
            new Promise((resolve, reject) => {
                const DbManagerInstance = new DbManager();
                DbManagerInstance.getDbConnection().then(db => {
                    DbManagerInstance.allQuery(db, SQL, []).then((spendings) => {
                        let sum = 0;
                        this.Euros = 0;  
                        this.Dollars = 0
                        this.Levas = 0;
                        for (let j = 0; j < spendings.length; j++) {
                            if (!this[spendings[j][1]]) {
                                this[spendings[j][1]] = 0;
                            } 
                            this[spendings[j][1]] += + spendings[j][0];
                        }
                        this[me.spendingData.currencyValue] +=  + me.spendingData.sumValue;
                        sum += + convertEurosAndDollarsToLevas(this.Euros, this.Dollars, this.Levas);

                        if (alerts[i][3] < sum) {
                            reject(alerts[i])
                        }
                        resolve();
                    });
                });
            }) 
        )
    }
    return Promise.all(arrayOfPromisses);
}

function returnDateRangeForPredefinedAlert(alertType) {
    let date;
    let firstDay;
    let lastDay;
    switch (alertType) {
        case "Today": 
            return {
                from: new Date(),
                to: new Date()
            }
        case "This month": 
            date = new Date();
            firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            return {
                from: firstDay,
                to: lastDay
            }
        case "This year": 
            date = new Date();
            firstDay = new Date(date.getFullYear(), 0, 1)
            lastDay = new Date(date.getFullYear(), 11, 31)
            return {
                from: firstDay,
                to: lastDay
            }    
    }
    return false;
}

module.exports = {
    getRepeatedAlerts: getRepeatedAlerts,
    getAlertsByDate: getAlertsByDate,
    shouldShowAlert: shouldShowAlert,
    returnDateRangeForPredefinedAlert: returnDateRangeForPredefinedAlert,
    insertPredefinedAlerts: insertPredefinedAlerts,
    getAllAlerts: getAllAlerts
}