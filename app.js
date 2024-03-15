require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const sessions = require("express-session");
const MongoStore = require('connect-mongo');
const ExpressError = require("./utils/ExpressError.js");
const Users=require("./modules/users.js")
const listingRouter = require("./routers/listings.js");
const reviewRouter = require("./routers/reviews.js");
const userRouter = require("./routers/users.js");
const engine = require('ejs-mate');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");

app.set("view engine", "views");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
const dburl=process.env.ATLASDB_URL;
const main = async () => {
    await mongoose.connect(dburl);
}
main().then(() => {
    console.log("Connected....")
}).catch((err) => {
    console.log(err);
})

const port = 8080;
app.listen(port, () => {
    console.log("listening...");
});

app.get("/", (req, res) => {
    res.send("Connected....");
});

const store= MongoStore.create({
    mongoUrl:dburl,
    crypto: {
        secret:  'vaishnavisSuperSecret'
      },
      touchAfter:24*3600
  })

 store.on("error",(err)=>{
    console.log("ERROR IN SESSION STORE",err);
 }) 
const sessionOptions = {
    store:store,
    secret: 'vaishnavisSuperSecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24,
        maxAge: Date.now() + 1000 * 60 * 60 * 24,
        httpOnly: true
    }
}
app.use(sessions(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.use("/listing", listingRouter);
app.use("/listing/:id/review", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
    throw new ExpressError(404, "Page not found");
    next(err);
})

app.use((err, req, res, next) => {
    let { status = 501, message = "Somthing going to be wrong" } = err;
    res.render("listing/error.ejs", { message });
})

