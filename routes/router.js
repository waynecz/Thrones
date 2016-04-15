
module.exports = function(app){

    app.use(function(req,res,next){
        console.log("xxxxx");
    });

    app.use('/',require('./index'));
    app.use('/user',require('./user'));
}