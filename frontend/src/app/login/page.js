"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";

import {loginUser} from "@/services/authService";

import {toast,ToastContainer}
from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

export default function LoginPage(){

const router = useRouter();

const [form,setForm]=useState({

    email:"",
    password:""

});

const [loading,setLoading]=useState(false);

const handleChange=(e)=>{

setForm({

...form,

[e.target.name]:e.target.value

});


};

const validate=()=>{


if(!form.email){

toast.error("Email is required");

return false;

}


if(!form.password){

toast.error("Password is required");

return false;

}


if(form.password.length < 6){

toast.error("Password minimum 6 characters");

return false;

}


return true;


};





const handleSubmit=async(e)=>{


e.preventDefault();


if(!validate()) return;



try{


setLoading(true);



const response =
await loginUser(form);



localStorage.setItem(

"token",

response.token

);



localStorage.setItem(

"user",

JSON.stringify(response.user)

);



toast.success("Login successful");



const role=response.user.role;



setTimeout(()=>{


if(role==="ADMIN"){

router.push("/admin");

}


else if(role==="PROJECT_MANAGER"){

router.push("/manager");

}


else if(role==="TEAM_MEMBER"){

router.push("/team-member");

}


else{

router.push("/unauthorized");

}


},1000);



}

catch(error){


toast.error(

error.response?.data?.message ||

"Login failed"

);


}

finally{


setLoading(false);


}


};




return (

<div className="container">


<ToastContainer/>


<div className="row justify-content-center mt-5">


<div className="col-md-5">


<div className="card shadow p-4">


<h2 className="text-center mb-4">

Project Management Login

</h2>



<form onSubmit={handleSubmit}>


<div className="mb-3">


<label>Email</label>


<input

type="email"

name="email"

className="form-control"

value={form.email}

onChange={handleChange}

placeholder="Enter email"

/>


</div>




<div className="mb-3">


<label>Password</label>


<input

type="password"

name="password"

className="form-control"

value={form.password}

onChange={handleChange}

placeholder="Enter password"

/>


</div>



<button

className="btn btn-primary w-100"

disabled={loading}

>


{

loading ?

"Logging..."

:

"Login"

}


</button>


</form>



</div>


</div>


</div>


</div>


);


}