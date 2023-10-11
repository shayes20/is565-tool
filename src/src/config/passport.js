import passportJwt from 'passport-jwt';
import config from './config.js';
import User from '../models/User.js';
import tokenTypes from './tokens.js';

const JwtStrategy = passportJwt.Strategy;
const { ExtractJwt } = passportJwt;

const jwtOptions = {
    secretOrKey: config.jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

const jwtVerify = async (payload, done) => {
    try {
        if (payload.type !== tokenTypes.ACCESS)
            throw new Error('Invalid token type');

        const user = await User.findById(payload.id);

        if (!user) return done(null, false);

        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export default jwtStrategy;
