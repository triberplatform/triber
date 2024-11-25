"use client"
import Navbar from "@/app/components/common/Navbar";
import LoginForm from "@/app/components/dashboard/LoginForm";


export default function page() {
   
    
    
  return (
    <>
      <Navbar />
      <div className="text-center flex flex-col items-center justify-center">
        <p className="font-semibold text-3xl font-serif">Welcome Back</p>
        <p className="font-serif">Log In to get started</p>
       <LoginForm/>
      </div>
    </>
  );
}
