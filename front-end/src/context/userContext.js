import { createContext, useEffect, useState } from "react";
import { getUserData, isLoggedIn } from "../auth";
import { getAllUser } from "../services/user-service";

export const UserContext = createContext(null)

const DataProvider =  ({children}) => {
    const [auth,setAuth] = useState(isLoggedIn);
    const [userDetails,setUserDetails] = useState(getUserData)
    // const [userList, setUserList] = useState('');
    // useEffect(()=> {
    //     const fetchData = async () => {
    //         const user = await getAllUser()
    //         setUserList(user)
    //     }
    //     fetchData()
    // },[])
   
    // console.log(userDetails.token)
    return (
        <UserContext.Provider value={{auth, setAuth, userDetails, setUserDetails}}>
            {children}
        </UserContext.Provider>
    )
}

export default DataProvider