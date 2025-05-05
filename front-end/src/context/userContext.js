import { createContext, useEffect, useState } from "react";
import { getUserData, isLoggedIn } from "../auth";
import { getAllUser } from "../services/user-service";
import { doLogout } from "../auth";
import { useNavigate } from "react-router-dom";
export const UserContext = createContext(null)

const DataProvider =  ({children}) => {
    const [auth,setAuth] = useState(isLoggedIn);
    const [userDetails,setUserDetails] = useState(getUserData)
    const [userList, setUserList] = useState('');
    const [reg, setReg] = useState(false);
<<<<<<< HEAD

    useEffect(()=> {
        if(auth) {
            getAllUser().then(data=> {
=======
    const [sentRequestList, setSentRequestList] = useState("");
    
    useEffect(() => {
        if (auth) {
            getAllUser().then(data => {
>>>>>>> d5ab7c9 (features(pagination/home) - pagination implemented to retrieve user data from db)
                setUserList(data)
            }).catch(error => {
                if(error.response.data.expire) {    
                    doLogout(); 
                    setUserList('');
                    setUserDetails('');
                    setAuth(isLoggedIn); 
                }
                console.log(error.response.data)
                console.log(localStorage.clear("data"))
                window.location.href = "/"
            })
        }
    },[])
    

<<<<<<< HEAD
   useEffect(()=> {},[userList])
    // console.log(userDetails.token)
    return (
        <UserContext.Provider value={{auth, setAuth, userDetails, setUserDetails, userList, setUserList, reg, setReg}}>
            {children}
        </UserContext.Provider>
=======
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
            setSentRequestList
        }
    } > {
            children
        } </UserContext.Provider>
>>>>>>> d5ab7c9 (features(pagination/home) - pagination implemented to retrieve user data from db)
    )
}

export default DataProvider