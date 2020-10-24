export default function userRepo(userModel) {
    return Object.freeze({
        add,
        exist,
        findById,
        findAll,
        remove,
        removeMany,
        modify,
    });


    async function add(entryUser) {
        return await userModel(entryUser).save()
    }

    async function findById(id) {
        return await userModel.findOne({_id: id})
    }

    async function exist(id) {

        return await userModel.findOne({
            $or: [{ email: id }, { username: id }] 
        })
    }

    async function findAll(queryParams, filter = {}, sorted = {}) {

        const { page = 1, limit = 17 } = queryParams

        const reports = await userModel.find(filter)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort(sorted)

        const count = await userModel.countDocuments(filter)

        return { 
            totalOfPages: Math.ceil(count / limit),
            currentPage: page,
            reports
        }
    }

    async function remove(id) {
        return await userModel.deleteOne({
            _id: id,
        })
    }

    async function removeMany(id) {
        return await userModel.deleteMany({
            idCompany: id,
        })
    }

    async function modify(id, newData) {
        return await userModel.findOneAndUpdate(
            {_id: id},
            {$set: newData},
            {new: true}
        )
    }

}
