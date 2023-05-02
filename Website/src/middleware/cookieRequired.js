module.exports = function(req, res , next) {
    if(req.headers !== undefined) {
        if(req.headers.authorization !== undefined){
            next()
        } else if(req.cookies.jwt !== undefined){
            req.headers.authorization = `Bearer ${req.cookies.jwt}`
            next();
        } else {
            res.redirect('/login');
        }
    } else {
        return res.redirect('/login');
    }
}