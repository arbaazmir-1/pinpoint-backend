const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs');
const User = require('../models/userModel')

const secret = process.env.JWT_SECRET;

passport.use('user', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email});
        if (!user) {
            
            return done(null, false, { message: 'no-user' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
         
            return done(null, false, { message: 'incorrect-password' });
        }
        if(!user.emailVerified){
            return done(null,false,{message:"not-verified"})
        }
        user.password = undefined;
        user.emailVerificationCode = undefined;
        user.emailCodeExpiry= undefined

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}
));
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
};


passport.use('jwt-verify', new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
     
        const user = await User.findById(payload.id);
        if (!user) {
            return done(null, false);
        }
        if(!user.emailVerified){
            return done(null,false,{message:"not-verified"})
        }
        user.password = undefined;
        user.emailVerified = undefined
        user.emailVerificationCode= undefined
        user.emailCodeExpiry= undefined

        done(null, user);
    } catch (error) {
        
        done(error);
    }
}
));
module.exports = passport;