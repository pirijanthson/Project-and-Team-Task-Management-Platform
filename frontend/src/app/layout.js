import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

import {AuthProvider} from "@/context/AuthContext";

export const metadata = {

 title:"Project Management Platform",

 description:"Team Task Management System"

};



export default function RootLayout({children}) {


      return (

      <html lang="en">

      <body>


      <AuthProvider>

      {children}

      </AuthProvider>


      </body>

      </html>

      );

}