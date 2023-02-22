const v1Routes = require('../../v1/router');
const v1DeserializeUser = require('../../v1/middlewares/deserializeUser');

module.exports = function (app) {
    app.use('/api/v1', v1DeserializeUser);
    app.use('/api/v1', v1Routes);
};
