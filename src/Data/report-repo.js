export default function reportRepo(reportModel) {
    return Object.freeze({
        add,
        exist,
        findAll,
        remove,
        modify,
    });


    async function add(entryUser) {
        return await reportModel(entryUser).save()
    }

    async function exist(id) {
        return await reportModel.findOne({
            _id: id,
        })
    }

    async function findAll(filter = {}, sorted = {}) {
        return await reportModel
            .find(filter)
            .sort(sorted)
    }

    async function remove(id) {
        return await reportModel.deleteOne({
            _id: id,
        })
    }

    async function modify(id, newData) {
        return await reportModel.findOneAndUpdate(
            {_id: id},
            {$set: newData},
            {new: true}
        )
    }

}