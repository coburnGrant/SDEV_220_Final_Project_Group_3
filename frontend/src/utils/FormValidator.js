const MIN_USERNAME_LENGTH = 3;
const MIN_PASSWORD_LENGTH = 8;
const MIN_FIRST_NAME_LENGTH = 2;
const MIN_LAST_NAME_LENGTH = 2;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validates the register form by checking if all fields are filled in
function validateRegisterForm(username, password, firstName, lastName, email) {
    // Check if all fields are filled
    if (!username || !password || !firstName || !lastName || !email) {
      throw new Error("Please fill in all fields");
    }
  
    // Username validation
    if (username.length < MIN_USERNAME_LENGTH) {
      throw new Error("Username must be at least 3 characters long");
    }
  
    // Password validation
    if (password.length < MIN_PASSWORD_LENGTH) {
      throw new Error("Password must be at least 8 characters long");
    }
  
    // Email validation
    if (!EMAIL_REGEX.test(email)) {
      throw new Error("Please enter a valid email address");
    }
  
    // Name validation
    if (firstName.length < MIN_FIRST_NAME_LENGTH) {
      throw new Error("First name must be at least 2 characters long");
    }
  
    if (lastName.length < MIN_LAST_NAME_LENGTH) {
      throw new Error("Last name must be at least 2 characters long");
    }
  
    return true;
}
  
// Validates the login form by checking if the username and password are filled in
function validateLoginForm(username, password) {
    if (!username || !password) {
      throw new Error("Please fill in all fields");
    }
}

export { validateRegisterForm, validateLoginForm };