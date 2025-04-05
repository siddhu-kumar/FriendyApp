

export const isLoggedIn = () => {
    let data = localStorage.getItem("data")
    if(data===null) {
        return false;
    } else {
        return true;
    }
}

export const doLogin = (data) => {
    localStorage.setItem("data",JSON.stringify(data));
}

export const doLogout = () => {
    localStorage.removeItem("data");
}

export const getUserData = () => {
    if(isLoggedIn) {
        const data = localStorage.getItem('data');
        const parsedData = JSON.parse(data)
        // console.log(data.token)
        if(parsedData) {
            return parsedData.data
        } else {
            return ;
        }
    } else {
        return ;
    }
}

export const getToken = () => {
    if(isLoggedIn()) {
      return JSON.parse(localStorage.getItem("data"))
    } else {
      return null
    }
}

export const editStorage = (user) => {
    if(isLoggedIn()) {
        const data = JSON.parse(localStorage.getItem("data"))
        // console.log(data)
        data.data.name = user.name;
        data.data.email = user.email;
        data.data.contact = user.contact;
        data.data.address = user.address;  
        localStorage.setItem("data",JSON.stringify(data));
        console.log('stored',data.data)
    }
}