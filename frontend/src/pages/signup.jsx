import React from "react";
import ClientRegisterForm from "@/pages/auth/ClientRegisterForm";

export default function Signup() {
    return (
        <div className="form-container">
            <h1 className="text-3xl font-bold my-6">Sign Up Page</h1>
            <div>
                <ClientRegisterForm />
            </div>
        </div>
    );
}
