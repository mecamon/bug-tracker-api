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

    async function findAll(filter = {}) {
        return await userModel.find(filter)
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
