const appSettings = require("application-settings");

const worldCurrencies = [
    {"cc":"AUD","symbol":"$","name":"Australian dollar"},
    {"cc":"BGN","symbol":"BGN","name":"Bulgarian lev"},
    {"cc":"BRL","symbol":"R$","name":"Brazilian real"},
    {"cc":"CAD","symbol":"$","name":"Canadian dollar"},
    {"cc":"CHF","symbol":"Fr.","name":"Swiss franc"},
    {"cc":"USD","symbol":"US$","name":"United States dollar"},
    {"cc":"EUR","symbol":"\u20ac","name":"European Euro"},

];

const worldCurrenciesNames = [
    "Australian dollar",
    "Bulgarian lev",
    "Brazilian real",
    "Canadian dollar",
    "Swiss franc",
    "United States dollar",
    "European Euro"
];

const COURSES = {
    BGN: {
        AUD: { 
            course: 1.20
        },
        BGN: { 
            course: 1.00
        },
        BRL: { 
            course: 0.44
        },
        CAD: { 
            course: 1.31
        },
        CHF: { 
            course: 1.76
        },
        USD: { 
            course: 1.71
        },
        EUR: { 
            course: 1.95
        }
    },

    AUD: {
        AUD: { 
            course: 1
        },
        BGN: { 
            course: 0.83
        },
        BRL: { 
            course: 0.37
        },
        CAD: { 
            course: 1.09
        },
        CHF: { 
            course: 1.46
        },
        USD: { 
            course: 1.42
        },
        EUR: { 
            course: 1.62
        }
    },

    BRL: {
        AUD: { 
            course: 2.67
        },
        BGN: { 
            course: 2.22
        },
        BRL: { 
            course: 1
        },
        CAD: { 
            course: 2.92
        },
        CHF: { 
            course: 3.91
        },
        USD: { 
            course: 3.82
        },
        EUR: { 
            course: 4.35
        }
    },

    CAD: {
        AUD: { 
            course: 0.91
        },
        BGN: { 
            course: 0.76
        },
        BRL: { 
            course: 0.34
        },
        CAD: { 
            course: 1
        },
        CHF: { 
            course: 1.34
        },
        USD: { 
            course: 1.30
        },
        EUR: { 
            course: 1.48
        }
    },

    CHF: {
        AUD: { 
            course: 0.68
        },
        BGN: { 
            course: 0.56
        },
        BRL: { 
            course: 0.25
        },
        CAD: { 
            course: 0.74
        },
        CHF: { 
            course: 1
        },
        USD: { 
            course: 0.97
        },
        EUR: { 
            course: 1.11
        }
    },

    USD: {
        AUD: { 
            course: 0.70
        },
        BGN: { 
            course: 0.58
        },
        BRL: { 
            course: 0.26
        },
        CAD: { 
            course: 0.76
        },
        CHF: { 
            course: 1.02
        },
        USD: { 
            course: 1
        },
        EUR: { 
            course: 1.13
        }
    },

    EUR: {
        AUD: { 
            course: 0.61
        },
        BGN: { 
            course: 0.51
        },
        BRL: { 
            course: 0.22
        },
        CAD: { 
            course: 0.67
        },
        CHF: { 
            course: 0.90
        },
        USD: { 
            course: 0.87
        },
        EUR: { 
            course: 1
        }
    }

}

function convertEurosAndDollarsToLevas(eurosParam, dollarsParam, levasAsParam) {
    const euros = eurosParam || 0;
    const dollars = dollarsParam || 0;
    const levasParam = levasAsParam || 0;
    let levas = 0;
    const euroCourse = (appSettings.getNumber('EUR')) ? appSettings.getNumber('EUR') : COURSES.euros.course;
    const dollarsourse = (appSettings.getNumber('USD')) ? appSettings.getNumber('USD') : COURSES.dollars.course;
    levas += + (euros * euroCourse);
    levas += + (dollars * dollarsourse);
    levas += levasParam;
    return levas;

}

function convertCurrenciesToSelected(arrayInOtherCurrencies, currency, isAlrets) {
    const currentCurrency = (currency) ? currency : appSettings.getString("currency");
    const currentCurrencyShortName = findShortNameByLongName(currentCurrency);
    const isItForAlerts = isAlrets || false;
    let sum = 0;
    for (let i = 0; i < arrayInOtherCurrencies.length; i++) {
        const currencyShortName = findShortNameByLongName(arrayInOtherCurrencies[i].currency);
        const course = (appSettings.getNumber(currencyShortName) && !isItForAlerts) ? appSettings.getNumber(currencyShortName) : COURSES[currentCurrencyShortName][currencyShortName].course; 
        sum += + (arrayInOtherCurrencies[i].sum * course);

    }
    return sum;
}

function findShortNameByLongName(longname) {
    for (let i = 0; i < worldCurrencies.length; i++) {
        if (longname == worldCurrencies[i].name){
            return worldCurrencies[i].cc;
        }
    }
}

module.exports = {
    COURSES: COURSES,
    convertEurosAndDollarsToLevas: convertEurosAndDollarsToLevas,
    convertCurrenciesToSelected: convertCurrenciesToSelected,
    worldCurrenciesNames: worldCurrenciesNames,
    findShortNameByLongName: findShortNameByLongName
}