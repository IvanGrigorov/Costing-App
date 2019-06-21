const observableModule = require("tns-core-modules/data/observable");

function HomeViewModel() {
    const viewModel = observableModule.fromObject({
        /* Add your view model properties here */
        newSpending: 'Create new spending',
        statistics: 'Statistics',
        alerts: 'Alerts',
        labels: 'Labels',
        delete: 'Delete',
        credits: 'Credits'
    });

    return viewModel;
}

module.exports = HomeViewModel;
