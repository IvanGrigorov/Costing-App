const connectivityModule = require("tns-core-modules/connectivity");


function isThereConnection() {
    // result is ConnectionType enumeration (none, wifi or mobile)
    const myConnectionType = connectivityModule.getConnectionType();

    switch (myConnectionType) {
        case connectivityModule.connectionType.wifi:
        case connectivityModule.connectionType.mobile:
        case connectivityModule.connectionType.ethernet:
            return true;
        case connectivityModule.connectionType.none:
        case connectivityModule.connectionType.bluetooth:
            return false;
        default:
            return false;
    }
}


module.exports = {
    isThereConnection: isThereConnection
}