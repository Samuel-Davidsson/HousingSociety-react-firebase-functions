
const IsEmpty = (string) => {
    if(string.trim() === "") return true;
    else return false;
}
  
  const IsEmail = (email) => {
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(emailRegEx)) return true;
    else return false;
}

  exports.validateSignupData = (data) => {
    let errors = {};
    if(IsEmpty(data.email)) {
      errors.email = "Email can´t be empty";
    }
    else if(!IsEmail(data.email)) {
      errors.email = "Must be a valid email address";
    }

    if(IsEmpty(data.password)) errors.password = "Must not be empty";
    if(data.password !== data.confirmpassword) errors.confirmpassword = "Passwords must match";
    if(IsEmpty(data.handle)) errors.handle = "Must not be empty";

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false 
    }
}

  exports.validateLoginData = (data) => {
    if(IsEmpty(user.email)) errors.email = "Must not be empty";
    if(IsEmpty(user.password)) errors.password = "Must not be empty";
  
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false 
    }
}