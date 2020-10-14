import fieldValidator from './field-validators'
import requiredParam from '../helpers/required-param'
import bcrypt from "bcrypt";
const saltRounds = 10;

export default function superuserValidator(
  userInfo = requiredParam("userInfo")
) {
  if (Object.entries(userInfo).length === 0)
    userInfo = requiredParam("userInfo");

  const validUser = validate(userInfo);
  return Object.freeze(validUser);

  function validate({
    firstname = requiredParam("firstname"),
    lastname = requiredParam("lastname"),
    username = requiredParam("username"),
    password = requiredParam("password"),
    email = requiredParam("email"),
    gender = requiredParam("gender"),
    idCompany = requiredParam("idCompany"),
    ...otherInfo
  } = {}) {
    fieldValidator.name(2, "firstname", firstname)
    fieldValidator.name(2, "lastname", lastname)
    fieldValidator.username(4, username)
    fieldValidator.password(password)
    fieldValidator.email(email)
    fieldValidator.nameWithNumbers(2, "idCompany", idCompany)
    return {
      firstname,
      lastname,
      username,
      password: bcrypt.hashSync(password, saltRounds),
      email,
      gender,
      idCompany,
      ...otherInfo,
    };
  }

}
