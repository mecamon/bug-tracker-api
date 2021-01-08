import makeSuperuserModel from "../models/superuser-model";
import makeCompanyModel from "../models/company-model";
import makeUserModel from "../models/user-model";
import makeReportModel from "../models/report-model";

import makeSuperuserRepo from "../Data/superuser-repo";
import makeCompanyRepo from "../Data/company-repo";
import makeUserRepo from "../Data/user-repo";
import makeReportRepo from "../Data/report-repo";

//MODELS
const reportModel = makeReportModel();
const userModel = makeUserModel();
const superuserModel = makeSuperuserModel();
const companyModel = makeCompanyModel();

//REPOS
const reportRepo = makeReportRepo(reportModel);
const userRepo = makeUserRepo(userModel);
const superuserRepo = makeSuperuserRepo(superuserModel);
const companyRepo = makeCompanyRepo(companyModel);

export default Object.freeze({
  reportRepo,
  userRepo,
  superuserRepo,
  companyRepo,
});
