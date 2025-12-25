import React from "react";
import ClientLoginForm from "@/components/ClientComponent/ClientRegisterForm";
import ClientRegisterForm from "@/components/ClientComponent/ClientRegisterForm";
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
