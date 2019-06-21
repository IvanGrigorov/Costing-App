/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

const DeletesViewModel = require("./deletes-view-model");
const DbManager = require("../../db/DbManager");
const dialogs = require("tns-core-modules/ui/dialogs");


function onNavigatingTo(args) {
    const page = args.object;
    let bindingContext = new DeletesViewModel();

    const SQL = "SELECT `label` FROM labels";
    const DbManagerInstance = new DbManager();
    DbManagerInstance.getDbConnection().then(db => {
        DbManagerInstance.allQuery(db, SQL, []).then((labels) => {
            let labelsToAdd = [];
            for (let i = 0; i < labels.length; i++) {
                labelsToAdd.push(labels[i][0]);
            }
            bindingContext.labels = labelsToAdd;
            bindingContext.labelsValue = (labels && labels[0] && labels[0][0]) ? (labels[0][0]) : "";
            //if (labelsToAdd.length) {
            //    bindingContext.isLabelOptionVisible = true
            //}
            page.bindingContext = bindingContext;
        });
    });
    
}

function convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat);
    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
}

function onDeleteByDateItemTap(args) {
    const page = args.object;
    const whereClause = getWhereClauseForDate(page.bindingContext.datesValue);
    if (!whereClause) {
        return;
    }
    const SQL = "DELETE FROM spending WHERE " + whereClause;

    const DbManagerInstance = new DbManager();
    DbManagerInstance.getDbConnection().then(db => {
        DbManagerInstance.executeQuery(db, SQL).then(() => {
            dialogs.alert("Delete successfull !").then(() => {
                console.log("SUCCESSFULL DELETE");
            })
        })
    });
}

function getWhereClauseForDate(dateValue) {
    let whereClause = '';
    const date = new Date();
    let firstDay = '';
    switch (dateValue) {
        case 'Today':
            whereClause = "`when` = " + "'" + convertDate(new Date()) + "'";
            break;
        case 'This month':
            firstDay = convertDate(new Date(date.getFullYear(), date.getMonth(), 1));
            whereClause = "`when` > " + "'" + firstDay + "'";
            break;
        case 'This year':
            firstDay = convertDate(new Date(date.getFullYear(), 0, 1));
            whereClause = "`when` > " + "'" + firstDay + "'";
            break;
    }
    return whereClause;
}

function onDeleteByLabelItemTap(args) {
    const page = args.object;
    const label = page.bindingContext.labelsValue;

    const SQL = "DELETE FROM spending WHERE `label` = " + "'" + label + "'";

    const DbManagerInstance = new DbManager();
    DbManagerInstance.getDbConnection().then(db => {
        DbManagerInstance.executeQuery(db, SQL).then(() => {
            dialogs.alert("Delete successfull !").then(() => {
                console.log("SUCCESSFULL DELETE");
            })
        })
    });
}

function onDeleteByBothItemTap(args) {
    const page = args.object;
    const whereClause = getWhereClauseForDate(page.bindingContext.datesValue);
    const label = page.bindingContext.labelsValue;

    const SQL = "DELETE FROM spending WHERE " + whereClause + " AND `label` = " + "'" + label + "'";

    const DbManagerInstance = new DbManager();
    DbManagerInstance.getDbConnection().then(db => {
        DbManagerInstance.executeQuery(db, SQL).then(() => {
            dialogs.alert("Delete successfull !").then(() => {
                console.log("SUCCESSFULL DELETE");
            })
        })
    });

}


module.exports = {
    onDeleteByDateItemTap: onDeleteByDateItemTap,
    onDeleteByLabelItemTap: onDeleteByLabelItemTap,
    onDeleteByBothItemTap: onDeleteByBothItemTap,
    onNavigatingTo: onNavigatingTo
}
