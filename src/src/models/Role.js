import mongoose from 'mongoose';
import toJSON from './plugins/toJSON-plugin.js';
import paginate from './plugins/paginate-plugin.js';

const roleSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        description: {
            type: String,
            required: true
        },
        permissions: {
            type: [String],
            default: []
        }
    },
    { timestamps: true }
);

// add plugin that converts mongoose to json and the paginate plugin
roleSchema.plugin(toJSON);
roleSchema.plugin(paginate);

// Use specified database
const db = mongoose.connection.useDb('databaseName');

/**
 * @typedef Role
 */
const Role = db.model('Role', roleSchema, 'collectionName');

export default Role;
