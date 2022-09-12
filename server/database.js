const user = require('./database/user');
const access = require('./database/access');
const course = require('./database/course');
const record = require('./database/record');

module.exports = {
    user,
    access,
    course,
    record
};
