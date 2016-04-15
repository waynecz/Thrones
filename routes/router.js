
module.exports = function(app){

    app.use('/',require('./index'));
    app.use('/user',require('./user'));
}