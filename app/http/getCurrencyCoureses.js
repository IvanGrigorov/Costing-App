const httpModule = require("http");

function getBGNCourse(base) {
    const constUrl = 'https://api.exchangeratesapi.io/latest?base=' + base;
    return httpModule.getJSON(constUrl);
}

module.exports = {
    getBGNCourse: getBGNCourse
}