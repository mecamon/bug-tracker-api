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

    async function findAll(queryParams, filter = {}, sorted = {}) {

        const { page = 1, limit = 17 } = queryParams

        const reports = await reportModel.find(filter)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort(sorted)

        const count = await reportModel.countDocuments(filter)

        return { 
            totalOfPages: Math.ceil(count / limit),
            currentPage: page,
            reports
        }
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