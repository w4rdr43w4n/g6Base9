interface Form {
  username?: string;
  password?: string;
  passwordC?: string;
  email?: string;
}

const validate = (formValues: Form) => {
  // errors object
  let errors = {
    username: "",
    password: "",
    email: "",
  };
  // password patterns
  const pwdRegexPatterns = {
    minLength: /^.{8,}$/,
    upperCase: /[A-Z]/,
    lowerCase: /[a-z]/,
    number: /[0-9]/,
    specialCharacter: /[!@#$%^&*(),.?|<>{}":';]/,
  };
  // parsing parameters
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const username = formValues.username?.toString();
  const email = formValues.email?.toString();
  const password = formValues.password?.toString();
  const passwordC = formValues.passwordC?.toString();

  // validating username
  if (!username || username === "") {
    errors.username = "Username is required";
  } else if (username.length < 4) {
    errors.username = "Username should be minimum 4 characters";
  }

  // validating email
  if (!email) {
    errors.email = "Email is required";
  } else if (!emailPattern.test(email.toLowerCase())) {
    errors.email = "Email is invalid";
  }

  // validating password
  if (password !== passwordC) {
    errors.password = "Passwords didn't match";
  } else if (!password) {
    errors.password = "Password is required";
  } else {
    let pwd_message = "";
    for (const [pattern, regex] of Object.entries(pwdRegexPatterns)) {
      if (!regex.test(password)) {
        switch (pattern) {
          case "minLength":
            pwd_message = "Password must be 8 characters minimum.";
            break;
          case "upperCase":
            pwd_message = "Password must contain at least 1 uppercase letter.";
            break;
          case "lowerCase":
            pwd_message = "Password must contain at least 1 lowercase letter.";
            break;
          case "specialCharacter":
            pwd_message = "Password must contain at least 1 special character.";
            break;
          case "number":
            pwd_message = "Password must contain at least 1 number.";
            break;
        }
        break;
      }
    }
    errors.password = pwd_message;
  }
  return errors;
};

export default validate;

export function validateAuthors(authors: string) {
  const regex = /(\w+\s+\w+,\s*\w+\s+\w+|\w+\s+\w+[^,]$)/g;

  return regex.test(authors) ? true : false;
}
