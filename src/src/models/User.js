import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import validPassword from '../utils/valid-password.js';
import toJSON from './plugins/toJSON-plugin.js';
import paginate from './plugins/paginate-plugin.js';

const userSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid email');
                }
            }
        },
        password: {
            type: String,
            required: true,
            minlength: 15,
            validate(value) {
                if (!validPassword.test(value))
                    throw new Error(
                        'Password must meet the criteria: at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
                    );
            },
            private: true // used by the toJSON plugin
        },
        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role',
            default: 'user'
        }
    },
    { timestamps: true }
);

// add plugin that converts mongoose to json and the paginate plugin
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }

    next();
});

// Use specified database
const db = mongoose.connection.useDb('databaseName');

/**
 * @typedef User
 */
const User = db.model('User', userSchema, 'collectionName');

export default User;
