import React from "react";
import ClientLoginForm from "@/pages/auth/ClientRegisterForm";
import ClientRegisterForm from "@/pages/auth/ClientRegisterForm";
export default function Signup() {
    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold my-6">Sign Up Page </h1>
            <div>
                <ClientRegisterForm />
            </div>
        </div>
    );
}
