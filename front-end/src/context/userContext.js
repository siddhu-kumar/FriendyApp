import { createContext, useEffect, useState } from "react";
import { getUserData, isLoggedIn } from "../auth";
import { getAllUser } from "../services/user-service";

export const UserContext = createContext(null)

const DataProvider =  ({children}) => {
    const [auth,setAuth] = useState(isLoggedIn);
    const [userDetails,setUserDetails] = useState(getUserData)
    const [userList, setUserList] = useState('');
    useEffect(()=> {
        getAllUser().then(data=> {
            setUserList(data)
        }).catch(error => {
            console.log(error)
        })
    },[])
    

   useEffect(()=> {},[userList])
    // console.log(userDetails.token)
    return (
        <UserContext.Provider value={{auth, setAuth, userDetails, setUserDetails, userList, setUserList}}>
            {children}
        </UserContext.Provider>
    )
}

export default DataProvider