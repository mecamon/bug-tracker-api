import requiredParam from "../helpers/required-param";
import fieldValidator from "./field-validators";

export default function reportValidator(
  reportInfo = requiredParam("reportInfo")
) {
  const validReport = validate(reportInfo);
  return validReport

  function validate({
    app = requiredParam("app"),
    department = requiredParam("department"),
    details = requiredParam("details"),
    ...otherInfo
  } = {}) {
    fieldValidator.name(2, "App", app);
    fieldValidator.name(2, "Department", department);
    fieldValidator.nameNotEmpty("Details", details);
    return { app, department, details, ...otherInfo };
  }
}
