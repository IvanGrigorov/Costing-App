/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/
const DbManager = require("../../db/DbManager")
const NewLabelViewModel = require("./labels-view-model");
const dialogs = require("tns-core-modules/ui/dialogs");


function onNavigatingTo(args) {
    const page = args.object;
    let bindingContext = new NewLabelViewModel();

    SQL = "SELECT `id`,`label` FROM labels WHERE `is_deleted` = 0";
    const DbManagerInstance = new DbManager();
    DbManagerInstance.getDbConnection().then(db => {
        DbManagerInstance.allQuery(db, SQL, []).then((labels) => {
            let labelsArray = [];
            for (let i = 0; i < labels.length; i++) {
                labelsArray.push({
                    id: labels[i][0],
                    label: labels[i][1]
                });
            }
            bindingContext.labels = labelsArray;
            page.bindingContext = bindingContext;
        });
    });
}

function onSubmitItemTap(args) {
    const button = args.object;
    const page = button.page;
    const bindingContect = page.bindingContext;
    const DbManagerInstance = new DbManager();
    const SQL = "INSERT INTO labels(`label`, `is_deleted`) VALUES (:label, :is_deleted)";
    const PARAMS_ARRAY = [
        {
            key: ':label',
            value: bindingContect.labelValue
        },
        {
            key: ':is_deleted',
            value: 0
        }
    ]
    DbManagerInstance.getDbConnection().then(db => {
        DbManagerInstance.executeParamQuery(db, SQL, PARAMS_ARRAY).then(() => {
                dialogs.alert("New label added !").then(() => {
                    page.frame.navigate("pages/home/home-page");
                    //console.log("SUCCESSFULL INSERT");
                })
            },
            error => {
                dialogs.alert("There was a problem !").then(() => {
                    //console.log("SOME ERROR", error);
                })
            }
        );
    });
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
    dialogs.confirm("Delete Label ?").then(function (result) {
        if (result) {
            deleteLabel(data, listViewBindingContext, listView).then(() => {
                dialogs.confirm("Delete spendings with this label?").then(function (result) {
                    if (result) {
                        deleteSpendingsWithLabel(data);
                    }
                });
            });
        }
        //console.log("Dialog result: " + result);
    });
}

function deleteSpendingsWithLabel(data) {
    const SQL = "DELETE FROM spending WHERE `label` = " + "'" + data.label + "'";

    const DbManagerInstance = new DbManager();
    DbManagerInstance.getDbConnection().then(db => {
        DbManagerInstance.executeQuery(db, SQL).then(
            () => {
                dialogs.alert("Delete successfull !").then(() => {
                    //console.log("SUCCESSFULL DELETE");
                })
            },
            error => {
                //console.log(error);
            }
        )
    });
}

function deleteLabel(data, listViewBindingContext, listView) {
    return new Promise((resolve, reject) => {
        const SQL = "UPDATE labels SET is_deleted = 1 WHERE `id` = " + "'" + data.id + "'";

        const DbManagerInstance = new DbManager();
        DbManagerInstance.getDbConnection().then(db => {
            DbManagerInstance.executeQuery(db, SQL).then(
                () => {
                    dialogs.alert("Delete successfull !").then(() => {
                        resolve();
                        //console.log("SUCCESSFULL DELETE");
                    });
                },
                error => {
                    resolve();
                    //console.log(error);
                }
            )
        });
        listViewBindingContext.removeLabel(data.id);
        listView.refresh();
    })
}

module.exports = {
    onNavigatingTo: onNavigatingTo,
    onSubmitItemTap: onSubmitItemTap,
    onSwipeCellStarted: onSwipeCellStarted
}
