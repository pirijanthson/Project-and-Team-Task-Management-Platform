"use client";


import DashboardLayout from "@/components/common/DashboardLayout";


export default function AdminDashboard(){


return (

<DashboardLayout>


<div className="container-fluid">


<h1 className="mb-4">

Admin Dashboard

</h1>



<div className="row">


<div className="col-md-4">


<div className="card shadow p-3">


<h5>Total Users</h5>

<h2>0</h2>


</div>


</div>




<div className="col-md-4">


<div className="card shadow p-3">


<h5>Total Projects</h5>

<h2>0</h2>


</div>


</div>




<div className="col-md-4">


<div className="card shadow p-3">


<h5>Active Tasks</h5>

<h2>0</h2>


</div>


</div>



</div>


</div>


</DashboardLayout>

);


}