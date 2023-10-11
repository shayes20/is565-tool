import httpStatus from 'http-status';
import pick from '../utils/pick.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catch-async.js';
import {
    createUserService,
    queryUsersService,
    getUserByIdService,
    updateUserByIdService,
    deleteUserByIdService
} from '../services/user-service.js';

export const createUserController = catchAsync(async (req, res) => {
    const user = await createUserService(req.body);
    res.status(httpStatus.CREATED).send(user);
});

export const getUsersController = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['firstName', 'lastName', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await queryUsersService(filter, options);
    res.send(result);
});

export const getUserController = catchAsync(async (req, res) => {
    const user = await getUserByIdService(req.params.userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.send(user);
});

export const updateUserController = catchAsync(async (req, res) => {
    const user = await updateUserByIdService(req.params.userId, req.body);
    res.send(user);
});

export const deleteUserController = catchAsync(async (req, res) => {
    await deleteUserByIdService(req.params.userId);
    res.status(httpStatus.NO_CONTENT).send();
});
