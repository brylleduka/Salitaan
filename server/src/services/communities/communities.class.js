const { Service } = require("feathers-mongoose");
const mongoose = require("mongoose");
exports.Communities = class Communities extends Service {
    setup(app) {
        this.app = app;
    }
    async patch(id, data, params) {
        const { r } = params.query;
        const community = await this.app.service("communities").get(id);
        let result = {};

        if (data.members) {
            if (!community.members) {
                result = data;
            } else {
                if (r) {
                    const comm = await community.members.filter(
                        (member) => member._id.toString() !== data.members._id
                    );

                    result = { ...community, members: comm };
                } else {
                    const existingMember = await community.members.find(
                        (member) => member._id.equals(data.members._id)
                    );
                    if (existingMember) throw new Error("Exist");
                    await community.members.push({
                        _id: mongoose.Types.ObjectId(data.members._id),
                    });

                    result = community;
                }
            }
        } else {
            result = { ...data };
        }

        return await super.patch(id, result);
    }
};
