export default function makeSuperuserRepo(superuserModel) {
    return Object.freeze({
        add,
        exist,
        findAll,
        findById,
        remove,
        modify,
    });


    async function add(entryUser) {
        return await superuserModel(entryUser).save()
    }

    async function exist(id) {
        return await superuserModel.findOne({
            $or: [{ email: id }, { username: id }] 
        })
    }

    async function findById(id) {
        return await superuserModel.findOne({ _id: id })
    }

    async function findAll() {
        return await superuserModel.find()
    }

    async function remove(id) {
        return await superuserModel.deleteOne({
            _id: id,
        })
    }

    async function modify(id, newData) {
        return await superuserModel.findOneAndUpdate(
            {_id: id},
            {$set: newData},
            {new: true}
        )
    }

}