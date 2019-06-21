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
    page.bindingContext = new NewLabelViewModel();
}

function onSubmitItemTap(args) {
    const button = args.object;
    const page = button.page;
    const bindingContect = page.bindingContext;
    const DbManagerInstance = new DbManager();
    const SQL = "INSERT INTO labels(`label`) VALUES (:label)";
    const PARAMS_ARRAY = [
        {
            key: ':label',
            value: bindingContect.labelValue
        }
    ]
    DbManagerInstance.getDbConnection().then(db => {
        DbManagerInstance.executeParamQuery(db, SQL, PARAMS_ARRAY).then(() => {
                dialogs.alert("New label added !").then(() => {
                    console.log("SUCCESSFULL INSERT");
                })
            },
            error => {
                dialogs.alert("There was a problem !").then(() => {
                    console.log("SOME ERROR", error);
                })
            }
        );
    });
}

module.exports = {
    onNavigatingTo: onNavigatingTo,
    onSubmitItemTap: onSubmitItemTap
}
