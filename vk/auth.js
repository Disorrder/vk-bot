const cfg = require('./config.json');
const passport = require('koa-passport');
const VKontakteStrategy = require('passport-vkontakte').Strategy;
const User = require('../api/user/model');

passport.use(new VKontakteStrategy(
    {
        clientID:     cfg.client_id,
        clientSecret: cfg.client_secret,
        callbackURL:  `${global.hostUrl}/vk/auth/callback`,
    },
    function myVerifyCallbackFn(access_token, refreshToken, params, profile, done) {
        console.log('VK AUTH CB', access_token, params, profile);
        User.findOne({ 'vk.id': profile.id })
            .then((user) => {
                if (user) return user;
                delete profile._raw;
                user = new User({
                    name: profile.displayName,
                    vk: profile,
                    // access_token,
                });
                // return user.save();
                return user;
            })
            .then((user) => {
                // console.log('Hey, User!', user);
                user.access_token = access_token;
                user.save();
                return done(null, user);
            })
            .catch(done);
        // done(null, {accessToken, profile, params});
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findOne({ 'vk.id': id })
        .then(function (user) { done(null, user); })
        .catch(done);
});
