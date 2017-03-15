const cfg = require('./config.json');
const passport = require('koa-passport');
const VKontakteStrategy = require('passport-vkontakte').Strategy;

console.log(global.hostUrl, `${global.hostUrl}/vk/auth/callback`);

passport.use(new VKontakteStrategy(
    {
        clientID:     cfg.client_id,
        clientSecret: cfg.client_secret,
        // callbackURL:  `https://oauth.vk.com/blank.html`,
    },
    function myVerifyCallbackFn(accessToken, refreshToken, params, profile, done) {
        console.log('VK CB', accessToken, params, profile);

        done(null, profile);
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    return done(null, {}) // temporary
    User.findById(id)
        .then(function (user) { done(null, user); })
        .catch(done);
});
