import { InvalidPropertyError } from '../helpers/errors'

//To validate names with only letters in it
function name(minLength, label, field) {
  if (field.length < parseInt(minLength)) {
    throw new InvalidPropertyError(
      `${label} needs to be at least ${minLength} characters long`
    );
  } else if (/[^a-zA-Z ]/.test(field)) {
    throw new InvalidPropertyError(
      `${label} can only contains character from A-Z or a-z`
    );
  }
}

//To validate names with numbers and periods in it
function nameWithNumbers(minLength, label, field) {
	if (field.length < parseInt(minLength)) {
		throw new InvalidPropertyError(
			`${label} field needs to be at least ${minLength} characters long`
		);
	} else if (/[^a-zA-Z0-9\. ]/.test(field)) {
		throw new InvalidPropertyError(
			`${label} field can only contains character from A-Z, a-z, 0-9 and .`
		);
	}
}

function username(minLength, field) {
  if (field.length < parseInt(minLength)) {
    throw new InvalidPropertyError(
      `Username needs to be at least ${minLength} characters long`
    );
  } else if (/[^a-zA-Z0-9]/.test(field)) {
    throw new InvalidPropertyError(
      `Username can only contains character from A-Z, a-z or 0-9`
    );
  }
}

function password(field) {
  if (field.length < 6) {
    throw new InvalidPropertyError(
      `Password needs to be at least 6 characters long`
    );
  } else if (
    !/[a-z]/.test(field) ||
    !/[A-Z]/.test(field) ||
    !/[0-9]/.test(field)
  ) {
    throw new InvalidPropertyError(
      `Password needs to have at least on of these a-z, A-Z, 0-9`
    );
  }
}

//To validate that the field is filled with only numbers
function number(maxLength, label, field) {
	if (/[^0-9]/.test(field)) {
		throw new InvalidPropertyError(
			`${label} field can only contain numbers`
		)
	}
	else if (field.length > parseInt(maxLength)) {
		throw new InvalidPropertyError(
			`${label} max length is ${maxLength}`
		)
	}
}

function email(field) {
  if (!/[@]/.test(field) || !/[\.]/.test(field)) {
    throw new InvalidPropertyError(`Email address is invalid email`);
  } else if (field.indexOf("@") < 2 || field.indexOf(".") < 2) {
    throw new InvalidPropertyError(`Email address is invalid email`);
  }
}

function gender(field) {
  if (/[^fmc]/.test(field)) {
    throw new InvalidPropertyError(`Gender entry is invalid`);
  }
}

function nameNotEmpty(label, field) {
	if (field === "") {
		throw new InvalidPropertyError(`${label} cannot be empty`);
	}
}

export default Object.freeze({
	name,
	username,
	password,
	email,
	gender,
	nameNotEmpty,
	nameWithNumbers,
	number
});
