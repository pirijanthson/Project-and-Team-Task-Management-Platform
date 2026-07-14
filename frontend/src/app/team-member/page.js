"use client";


import DashboardLayout from "@/components/common/DashboardLayout";


export default function TeamMemberDashboard(){


return (

<DashboardLayout>


<div className="container-fluid">


<h1>

Team Member Dashboard

</h1>



<div className="row mt-4">


<div className="col-md-4">


<div className="card shadow p-3">


<h5>
Assigned Tasks
</h5>


<h2>
0
</h2>


</div>


</div>



<div className="col-md-4">


<div className="card shadow p-3">


<h5>
Completed Tasks
</h5>


<h2>
0
</h2>


</div>


</div>




<div className="col-md-4">


<div className="card shadow p-3">


<h5>
Pending Reports
</h5>


<h2>
0
</h2>


</div>


</div>



</div>


</div>


</DashboardLayout>

);


}