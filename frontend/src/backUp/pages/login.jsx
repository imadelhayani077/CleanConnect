import ClientLoginForm from "@/pages/auth/LoginForm";
import React from "react";

export default function Login() {
    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold my-6">Login</h1>
            <div>
                <ClientLoginForm />
            </div>
        </div>
    );
}
