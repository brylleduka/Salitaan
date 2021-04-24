/* eslint-disable require-atomic-updates */
module.exports = function (options = {}) {
    // eslint-disable-line no-unused-vars
    return async (context) => {
        // Get `app`, `method`, `params` and `result` from the hook context
        const { app, method, result, params } = context;
        // Function that adds the user to a single message object
        const addCommunity = async (comm) => {
            // Get the user based on their id, pass the `params` along so
            // that we get a safe version of the user data
            // let arrayUsers = [];
            const community = await app
                .service("communities")
                .get(comm.communityId);

            // await comm.users.map((user) => {
            //     const u = app.service("users").get(user);
            //     arrayUsers.push(u);
            // });

            // Merge the message content to include the `user` object
            return {
                ...comm,
                community,
            };
        };

        // In a find method we need to process the entire page
        if (method === "find") {
            // Map all data to include the `user` information
            context.result.data = await Promise.all(
                result.data.map(addCommunity)
            );
        } else {
            // Otherwise just update the single result
            context.result = await addCommunity(result);
        }
        // console.log(context);
        return context;
    };
};
