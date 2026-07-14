import api from "./api";


// Get Admin Dashboard Summary

export const getAdminSummary = async()=>{

    const response = await api.get(
        "/admin/dashboard/summary"
    );

    return response.data;

};



// Get All Users

export const getAllUsers = async()=>{

    const response = await api.get(
        "/admin/users"
    );

    return response.data;

};