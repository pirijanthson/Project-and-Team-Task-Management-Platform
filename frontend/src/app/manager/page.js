"use client";


import DashboardLayout from "@/components/common/DashboardLayout";


export default function ManagerDashboard(){


return (

<DashboardLayout>


<div className="container-fluid">


<h1>

Project Manager Dashboard

</h1>



<div className="row mt-4">


<div className="col-md-4">


<div className="card shadow p-3">

<h5>
My Projects
</h5>


<h2>0</h2>


</div>


</div>



<div className="col-md-4">


<div className="card shadow p-3">


<h5>
Team Members
</h5>


<h2>0</h2>


</div>


</div>




<div className="col-md-4">


<div className="card shadow p-3">


<h5>
Task Progress
</h5>


<h2>0%</h2>


</div>


</div>



</div>


</div>


</DashboardLayout>

);


}