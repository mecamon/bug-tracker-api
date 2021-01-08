export default function makeCompanyRepo(companyModel) {
  return Object.freeze({
    add,
    exist,
    findAll,
    remove,
    modify,
    push,
    pull,
  });

  async function add(entryUser) {
    return await companyModel(entryUser).save();
  }

  async function exist(id) {
    return await companyModel.findOne({
      _id: id,
    });
  }

  async function findAll(queryParams, filter = {}, sorted = {}) {
    const { page = 1, limit = 17 } = queryParams;

    const companies = await companyModel
      .find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sorted);

    const count = await companyModel.countDocuments(filter);

    return {
      totalOfPages: Math.ceil(count / limit),
      currentPage: page,
      companies,
    };
  }

  async function remove(id) {
    return await companyModel.deleteOne({
      _id: id,
    });
  }

  async function modify(id, newData) {
    return await companyModel.findOneAndUpdate(
      { _id: id },
      { $set: newData },
      { new: true }
    );
  }

  async function push(id, newData) {
    return await companyModel.findOneAndUpdate(
      { _id: id },
      { $push: newData },
      { new: true }
    );
  }

  async function pull(id, dataToPull) {
    return await companyModel.findOneAndUpdate(
      { _id: id },
      { $pull: dataToPull },
      { new: true }
    );
  }
}
