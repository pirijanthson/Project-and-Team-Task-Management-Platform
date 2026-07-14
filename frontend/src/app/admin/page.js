"use client";


import {useEffect,useState} from "react";

import DashboardLayout from "@/components/common/DashboardLayout";

import {
    getAdminSummary
}
from "@/services/adminService";



export default function AdminDashboard(){


const [summary,setSummary]=useState({

    users:0,
    projects:0,
    tasks:0

});


const [loading,setLoading]=useState(true);



useEffect(()=>{


loadSummary();


},[]);



const loadSummary=async()=>{


try{


const data =
await getAdminSummary();



setSummary({

    users:data.users || 0,

    projects:data.projects || 0,

    tasks:data.tasks || 0

});


}
catch(error){


console.log(error);


}
finally{


setLoading(false);


}


};



return (

<DashboardLayout>


<div className="container-fluid">


<h1 className="mb-4">

Admin Dashboard

</h1>



{
loading ?

<h4>
Loading...
</h4>


:


<div className="row">


<div className="col-md-4">


<div className="card shadow p-4">


<h5>

Total Users

</h5>


<h2>

{summary.users}

</h2>


</div>


</div>




<div className="col-md-4">


<div className="card shadow p-4">


<h5>

Total Projects

</h5>


<h2>

{summary.projects}

</h2>


</div>


</div>




<div className="col-md-4">


<div className="card shadow p-4">


<h5>

Total Tasks

</h5>


<h2>

{summary.tasks}

</h2>


</div>


</div>



</div>


}



</div>


</DashboardLayout>

);


}