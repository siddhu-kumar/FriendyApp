export const validation = (input) => {
    const message = []

    const checkpassword = {
        lowercase: /[a-z]/.test(input.password),
        uppercase: /[A-Z]/.test(input.password),
        digitcase: /\d/.test(input.password),
        specialchar: /[!@#$%^&*]/.test(input.password),
        length: input.password.length >= 4
    }

    if (input.name.trim() === "" || input.email.trim() === "" || input.contact.trim() === "" || input.password.trim() === "") {
        return message.push('Please enter valid user credential.');
    }
    if (input.name.length < 4) {
        message.push('User name must be atleast 4 letter.');
    }

    if(!(input.contact.length<=10)) {
        message.push('Invalid user contacts.')
    }

    if ((input.email.trim()).length !== 0) {
        const pattern = /^([a-zA-Z\d._-])+@[a-zA-Z\d]+\.[a-zA-Z]{2,}$/
        if (!pattern.test(input.email)) {
            message.push('Email is not looking valid.')
        }
    }

    // if (input.password) {

    //     if (!checkpassword.lowercase) {
    //         message.push('Password must contain lowercase letter.')
    //     }
    //     if (!checkpassword.uppercase) {
    //         message.push('Password must contain uppercase letter.')
    //     }
    //     if (!checkpassword.digitcase) {
    //         message.push('Password must contain digit letter.')
    //     }
    //     if (!checkpassword.specialchar) {
    //         message.push('Password must contain special character.')
    //     }
    //     if (!checkpassword.length) {
    //         message.push('Password must be atleast 8 characters long.')
    //     }
    // }

   return message;

}