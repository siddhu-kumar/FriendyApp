import {
    createContext,
    useEffect,
    useState
} from "react";
import {
    getUserData,
    isLoggedIn,
    doLogout
} from "../auth";
import {
    getAllUser,
    getAllUserImages
} from "../services/user-service";
import {
    redirect
} from "react-router-dom";
export const UserContext = createContext(null)

const DataProvider = ({children}) => {
    
    const [auth, setAuth] = useState(isLoggedIn);
    const [userDetails, setUserDetails] = useState(getUserData)
    const [userList, setUserList] = useState('');
    const [reg, setReg] = useState(false);
    const [sentRequestList, setSentRequestList] = useState("");
    const [receivedRequestList, setReceivedRequestList] = useState("");

    
    useEffect(() => {
        if (auth) {
            getAllUser().then(data => {
                setUserList(data);
            }).catch(error => {
                console.log(error);
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
            setReg,
            sentRequestList,
            setSentRequestList,
            receivedRequestList,
            setReceivedRequestList,
        }
    } > {
            children
        } </UserContext.Provider>
    )
}

export default DataProvider