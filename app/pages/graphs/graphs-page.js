/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

const DbManager = require("../../db/DbManager")
const { convertDate } = require("./../../res/helpfulFunctions")
const NewGraphsModel = require("./graphs-view-model");
const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;



function onNavigatingTo(args) {
    const page = args.object;
    let bindingContext = new NewGraphsModel();
    page.bindingContext = bindingContext;

}

function onGenerateTap(args) {
    const button = args.object;
    const page = button.page;
    const bindingContext = page.bindingContext;
    bindingContext.isChartVisible = 'visible';
    const from = convertDate(bindingContext.fromDate);
    const to = convertDate(bindingContext.toDate);
    getSpendingsFromDateToDate(from, to, bindingContext, page);
}

function getSpendingsFromDateToDate(from, to, bindingContext, page) {
    const DbManagerInstance = new DbManager();
    const SQL_Spending = "SELECT `category` FROM spending WHERE `when` >= '" + from + "' AND `when` <= '" + to + "'";
    DbManagerInstance.getDbConnection().then(db => {

        DbManagerInstance.allQuery(db, SQL_Spending, []).then((spendings) => {
            var graph = page.getViewById('graph');

            bindingContext.generationData.splice(0);

            if (!spendings.length) {
                graph.visibility = 'hidden';
            }
            else { 
                graph.visibility = 'visible';
            }
            
            var preparedData = prepareDataForChart(spendings);
            var preparedDataAsArray = [];
            for (var property in preparedData) {
                if (preparedData.hasOwnProperty(property)) {
                    preparedDataAsArray.push({
                        category: property,
                        amount: preparedData[property]
                    })
                }
            }
            bindingContext.generationData.push(preparedDataAsArray);
            graph.updateChart();
        })
    });
}

function prepareDataForChart(arrayData) {
    let preparedData = {};
    for (let i = 0; i < arrayData.length; i++) {
        if (!preparedData[arrayData[i][0]]) {
            preparedData[arrayData[i][0]] = 1;
        }
        else {
            preparedData[arrayData[i][0]]++;
        }
    }
    return preparedData;
}

module.exports = {
    onNavigatingTo: onNavigatingTo,
    onGenerateTap: onGenerateTap
}
