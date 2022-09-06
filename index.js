const express = require("express");
const app = express();
const session = require("express-session");

app.set("view engine", "ejs");

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);

app.get("/", function (req, res) {
  res.render("pages/auth");
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log("App listening on port " + port));

const passport = require("passport");
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

app.get("/success", (req, res) => res.send(userProfile));
app.get("/error", (req, res) => res.send("error logging in"));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});
//-------------Facebook-----------

const facebookStrategy = require("passport-facebook").Strategy;

passport.use(
  new facebookStrategy(
    {
      clientID: "8065015853540979",
      clientSecret: "1095833d329fa17a8d4a375b072cbaa8",
      callbackURL:
        "https://social-login-ynn5f.ondigitalocean.app/auth/facebook/callback",
      profileFields: [
        "id",
        "displayName",
        "name",
        "gender",
        "picture.type(large)",
        "email",
      ],
    },
    function (accessToken, refreshToken, profile, done) {
      userProfile = profile;
      return done(null, userProfile);
    }
  )
);

app.get(
  "auth/facebook",
  passport.authenticate("facebook", { scope: "email,user_photos" })
);
app.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/profile",
    failureRedirect: "/",
  })
);
//------------Google Login-----------
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const GOOGLE_CLIENT_ID =
  "949255951485-ducdu81p9uqlnttq9paulh10b0tceioj.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL:
        "https://social-login-ynn5f.ondigitalocean.app/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      userProfile = profile;
      return done(null, userProfile);
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/error" }),
  function (req, res) {
    // Successful authentication, redirect success.
    res.redirect("/success");
  }
);
