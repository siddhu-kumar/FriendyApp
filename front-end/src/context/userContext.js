import {
    createContext,
    useEffect,
    useState
} from "react";
import {
    getUserData,
    isLoggedIn
} from "../auth";
import {
    getAllUser
} from "../services/user-service";
import {
    doLogout
} from "../auth";
import {
    redirect
} from "react-router-dom";
export const UserContext = createContext(null)

const DataProvider = ({children}) => {
    
    const [auth, setAuth] = useState(isLoggedIn);
    const [userDetails, setUserDetails] = useState(getUserData)
    const [userList, setUserList] = useState('');
    const [reg, setReg] = useState(false);

    useEffect(() => {
        if (auth) {
            getAllUser().then(data => {
                setUserList(data)
            }).catch(error => {
                if (error.response.data.expire) {
                    doLogout();
                    setUserList('');
                    setUserDetails('');
                    setAuth(isLoggedIn);
                }
                console.log(error.response.data)
                console.log(localStorage.clear("data"))
                window.location.href = "/login"
            })
        } else {
            redirect("/login")
        }
    }, [])

    return (<UserContext.Provider value={
        {
            auth,
            setAuth,
            userDetails,
            setUserDetails,
            userList,
            setUserList,
            reg,
            setReg
        }
    } > {
            children
        } </UserContext.Provider>
    )
}

export default DataProvider