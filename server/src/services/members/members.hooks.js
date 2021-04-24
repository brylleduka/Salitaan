const { authenticate } = require("@feathersjs/authentication").hooks;
const populateCommunity = require("../../hooks/populate-community");
const populateCommunityUser = require("../../hooks/populate-community-user");
module.exports = {
    before: {
        all: [authenticate("jwt")],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: [],
    },

    after: {
        all: [populateCommunity(), populateCommunityUser()],
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
