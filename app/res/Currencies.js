const appSettings = require("application-settings");

const COURSES = {
    euros: {
        course: 1.95
    },
    dollars: {
        course: 1.73
    },
}

function convertEurosAndDollarsToLevas(euros, dollars, levasParam) {
    let levas = 0;
    const euroCourse = (appSettings.getNumber('EUR')) ? appSettings.getNumber('EUR') : COURSES.euros.course;
    const dollarsourse = (appSettings.getNumber('USD')) ? appSettings.getNumber('USD') : COURSES.dollars.course;
    levas += + (euros * euroCourse);
    levas += + (dollars * dollarsourse);
    levas += levasParam;
    return levas;

}

module.exports = {
    COURSES: COURSES,
    convertEurosAndDollarsToLevas: convertEurosAndDollarsToLevas
}