"use client";


import {
    createContext,
    useState,
    useEffect
}
from "react";


const AuthContext=createContext();



export function AuthProvider({children}){


    const [user,setUser]=useState(null);


    useEffect(()=>{


        const savedUser =
        localStorage.getItem("user");


        if(savedUser){

            setUser(JSON.parse(savedUser));

        }


    },[]);



    const logout=()=>{


        localStorage.removeItem("token");

        localStorage.removeItem("user");

        setUser(null);


    };



    return (

        <AuthContext.Provider

        value={{
            user,
            setUser,
            logout
        }}

        >

            {children}

        </AuthContext.Provider>

    );

}



export default AuthContext;