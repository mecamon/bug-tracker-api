import { RequiredParamError } from "./errors";

export default function requiredParam(param) {
  throw new RequiredParamError(param);
}
