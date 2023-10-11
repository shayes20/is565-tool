import passport from 'passport';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError.js';
import { getAllRolesService } from '../services/role-service.js';

const getRolesRights = async () => {
    const allRoles = await getAllRolesService();

    // In the following lines, I am taking the array of role elements and creating a map, with keys as the name of the role and the values as the array of permissions
    const roleRights = new Map();

    allRoles.reduce((map, role) => {
        const { name, permissions } = role;

        map.set(name, permissions);

        return map;
    }, roleRights);

    return roleRights;
};

const verifyCallback =
    (req, resolve, reject, requiredRights) => async (err, user, info) => {
        if (err || info || !user) {
            return reject(
                new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate')
            );
        }
        req.user = user;

        const roleRights = await getRolesRights();

        if (requiredRights.length) {
            const userRights = roleRights.get(user.role);
            const hasRequiredRights = requiredRights.every((requiredRight) =>
                userRights.includes(requiredRight)
            );
            if (!hasRequiredRights && req.params.userId !== user.id) {
                return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
            }
        }

        resolve();
    };

const auth =
    (...requiredRights) =>
    async (req, res, next) => {
        return new Promise((resolve, reject) => {
            passport.authenticate(
                'jwt',
                { session: false },
                verifyCallback(req, resolve, reject, requiredRights)
            )(req, res, next);
        })
            .then(() => next())
            .catch((err) => next(err));
    };

export default auth;
