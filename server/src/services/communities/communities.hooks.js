const { authenticate } = require("@feathersjs/authentication").hooks;
const { setField } = require("feathers-authentication-hooks");

const setOwnerId = setField({
    from: "params.user._id",
    as: "data.ownerId",
});

const limitToOwner = setField({
    from: "params.user._id",
    as: "params.query.ownerId",
});

module.exports = {
    before: {
        all: [authenticate("jwt")],
        find: [],
        get: [],
        create: [setOwnerId],
        update: [limitToOwner],
        patch: [limitToOwner],
        remove: [limitToOwner],
    },

    after: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: [],
    },

    error: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: [],
    },
};
