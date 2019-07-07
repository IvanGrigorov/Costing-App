/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/
const DbManager = require("../../db/DbManager")
const NotificationViewModel = require("./notifications-view-model");
const dialogs = require("tns-core-modules/ui/dialogs");
const { LocalNotifications } = require("nativescript-local-notifications");




function onNavigatingTo(args) {
    const page = args.object;
    let bindingContext = new NotificationViewModel();

    SQL = "SELECT * FROM notifications";
    const DbManagerInstance = new DbManager();
    DbManagerInstance.getDbConnection().then(db => {
        DbManagerInstance.allQuery(db, SQL, []).then((notifications) => {
            let notificationsArray = [];
            for (let i = 0; i < notifications.length; i++) {
                notificationsArray.push({
                    id: notifications[i][0],
                    title: notifications[i][1],
                    when: notifications[i][2],
                    repeat_on: notifications[i][3],
                    notification_id: notifications[i][4]
                });
            }
            bindingContext.notifications = notificationsArray;
            page.bindingContext = bindingContext;
        });
    });

}

function onSubmitItemTap(args) {
    const button = args.object;
    const page = button.page;
    let bindingContext = page.bindingContext;
    const date = new Date();
    date.setHours(bindingContext.time.getHours(), bindingContext.time.getMinutes(), bindingContext.time.getSeconds());
    bindingContext.time = date;
    bindingContext.notification_id = (bindingContext.notifications.length) ? bindingContext.notifications[bindingContext.notifications.length - 1].notification_id + 1 : 0
    const DbManagerInstance = new DbManager();
    const SQL = "INSERT INTO notifications(`title`, `when`, `repeat_on`, `notification_id`) VALUES (:title, :when, :repeat_on, :notification_id)";
    const PARAMS_ARRAY = [
        {
            key: ':title',
            value: bindingContext.title
        },
        {
            key: ':when',
            value: bindingContext.time
        },
        {
            key: ':repeat_on',
            value: bindingContext.repeatValue
        },
        {
            key: ':notification_id',
            value: bindingContext.notification_id
        }
    ]
    DbManagerInstance.getDbConnection().then(db => {
        DbManagerInstance.executeParamQuery(db, SQL, PARAMS_ARRAY).then(() => {
                dialogs.alert("New notification added !").then(() => {
                    scheduleNotification(bindingContext).then(() => {
                        page.frame.navigate("pages/home/home-page");
                        //console.log("SUCCESSFULL INSERT");    
                    })
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
    dialogs.confirm("Delete notification ?").then(function (result) {
        if (result) {
            deleteNotification(data, listViewBindingContext, listView);
        }
        //console.log("Dialog result: " + result);
    });
}

function deleteNotification(data, listViewBindingContext, listView) {
    const SQL = "DELETE FROM notifications WHERE `id` = " + "'" + data.id + "'";

    const DbManagerInstance = new DbManager();
    DbManagerInstance.getDbConnection().then(db => {
        DbManagerInstance.executeQuery(db, SQL).then(() => {
            dialogs.alert("Delete successfull !").then(() => {
                //console.log("SUCCESSFULL DELETE");
            })
        })
    });
    cancelNotification(data).then(() => {
        listViewBindingContext.removeNotification(data.id);
        listView.refresh();
    })
}

function scheduleNotification(data) {
    return LocalNotifications.schedule([{
        id: data.notification_id,
        title: data.title,
        body: 'Remember to pay it :)',
        badge: 1,
        groupSummary:"Payment notifications", //android only
        ongoing: true, // makes the notification ongoing (Android only)
        icon: 'res://notification',
        thumbnail: true,
        interval: data.repeatValue,
        sound: "customsound-ios.wav", // falls back to the default sound on Android
        at: data.time // 10 seconds from now
        //at: new Date(new Date().getTime() + (10 * 1000))
      }]);
}

function cancelNotification(data) {
    return LocalNotifications.cancel(data.notification_id);
}

module.exports = {
    onNavigatingTo: onNavigatingTo,
    onSwipeCellStarted: onSwipeCellStarted,
    onSubmitItemTap: onSubmitItemTap
}