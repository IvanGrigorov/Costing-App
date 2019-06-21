const appSettings = require("application-settings");

function shouldWeUseCache() {
    const dateUpdated = appSettings.getString("dateUpdated");
    if (!dateUpdated) {
        return false;
    }
    const previosDate = new Date(dateUpdated);
	const currentDate = new Date();
	const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const millisBetween = currentDate.getTime() - previosDate.getTime();
    const days = millisBetween / millisecondsPerDay;

    // Round down.
    const difference = Math.floor(days);
    if (difference > 6) {
        return false;
    } 
    return true;
}

module.exports = {
    shouldWeUseCache: shouldWeUseCache
}