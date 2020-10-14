import fieldValidator from './field-validators'
import requiredParam from '../helpers/required-param'

export default function companyValidator(
  companyInfo = requiredParam("companyInfo")
) {
	const validCompany = validate(companyInfo)
	return Object.freeze(validCompany)

	function validate({
		name = requiredParam('name'),
		rnc = requiredParam('rnc'),
		email = requiredParam('email'),
		telephone = requiredParam('telephone'),
		usersPaid = requiredParam('usersPaid'),
		...otherInfo

	}) {
		fieldValidator.nameWithNumbers(2, "name", name)
		fieldValidator.number(9, "RNC", rnc)
		fieldValidator.number(12, "Telephone", telephone)
		fieldValidator.email(email)
		fieldValidator.number(3, "usersPaid", usersPaid)
		return {
			name, 
			rnc: parseInt(rnc), 
			email, 
			telephone: parseInt(telephone), 
			usersPaid: parseInt(usersPaid), 
			...otherInfo 
		}
	}

}
