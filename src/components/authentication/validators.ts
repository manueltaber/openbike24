export function validateEmail(email: string): Array<string> {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(String(email).toLowerCase())) {
    return ["Not a valid Email address!"];
  }
  return [];
}

export function validatePassword(password: string): Array<string> {
  if (password.length < 8) {
    return ["The password should contain at least 8 characters!"];
  }
  return [];
}

export const enum PasswordStrength {
  Short,
  Common,
  Weak,
  Ok,
  Strong
}

export function calculatePasswordStrength(password: string): PasswordStrength {
  let numberOfElements = 0;
  // Lowercase letters
  numberOfElements = /.*[a-z].*/.test(password)
    ? ++numberOfElements
    : numberOfElements;
  // Uppercase letters
  numberOfElements = /.*[A-Z].*/.test(password)
    ? ++numberOfElements
    : numberOfElements;
  // Numbers
  numberOfElements = /.*[0-9].*/.test(password)
    ? ++numberOfElements
    : numberOfElements;
  // Special characters (inc. space)
  numberOfElements = /[^a-zA-Z0-9]/.test(password)
    ? ++numberOfElements
    : numberOfElements;

  // Regex to check for a common password string - all based on 5+ length passwords
  const commonPasswordPatterns = /passw.*|12345.*|09876.*|qwert.*|asdfg.*|zxcvb.*|footb.*|baseb.*|drago.*/;

  // Assume we have a poor password already
  let currentPasswordStrength = PasswordStrength.Short;

  // Check then strenth of this password using some simple rules
  if (password === null || password.length < 5) {
    currentPasswordStrength = PasswordStrength.Short;
  } else if (commonPasswordPatterns.test(password) === true) {
    currentPasswordStrength = PasswordStrength.Common;
  } else if (
    numberOfElements === 0 ||
    numberOfElements === 1 ||
    numberOfElements === 2
  ) {
    currentPasswordStrength = PasswordStrength.Weak;
  } else if (numberOfElements === 3) {
    currentPasswordStrength = PasswordStrength.Ok;
  } else {
    currentPasswordStrength = PasswordStrength.Strong;
  }

  // Return the strength of this password
  return currentPasswordStrength;
}
