const Users=require("../modules/users");
module.exports.renderSigninForm= (req, res) => {
    res.render("user/signin.ejs");
}

module.exports.renderloginForm= (req, res) => {
    res.render("user/login.ejs");
}

module.exports.signin=async (req, res,next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new Users({
            email: email,
            username: username
        })
        const registeredUser = await Users.register(newUser, password);
        req.flash("success", "register successfully")
        req.login(registeredUser, (err) => {
            if (err) {
               req.flash("error",err.message);
               res.redirect("/user/signin");
            }
            res.redirect("/");
        })
    }
     catch (err) {
    req.flash("error", err.message);
    res.redirect("/user/signin");
}
}

module.exports.login=(req, res) => {
    req.flash("success", "login successfully")
    res.redirect(res.locals.redirectUrl);
}

module.exports.logout=(req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "logout successfully");
        res.redirect("/")
    })
}