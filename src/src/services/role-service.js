import Role from '../models/Role.js';

/**
 * Get all roles
 * @returns {Promise<QueryResult>}
 */
export const getAllRolesService = async () => {
    const roles = await Role.find();
    return roles;
};

/**
 * Get all the unique role names
 * @returns {Promise<[String]>}
 */
export const getAllRoleNamesService = async () => {
    const roleNames = await Role.distinct('name');
    return roleNames;
};

/**
 * Get all roles and permissions and transform into a map with keys as the name of the role and the values as the array of permissions
 * @returns {Promise<Map>}
 */
export const getRoleRightsMapService = async () => {
    const rolesArray = await Role.find();

    const roleRightsMap = new Map();

    rolesArray.reduce((map, role) => {
        const { name, permissions } = role;

        map.set(name, permissions);

        return map;
    }, roleRightsMap);

    return roleRightsMap;
};

/**
 * Query for roles
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
export const queryRolesService = async (filter, options) => {
    const roles = await Role.paginate(filter, options);
    return roles;
};
