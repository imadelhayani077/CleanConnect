import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, DollarSign, CheckCircle2, Shield } from "lucide-react";
import { useApplyForSweepstar } from "@/Hooks/useSweepstar";
import BecomeProForm from "./components/BecomeProForm";

export default function SweepstarApply() {
    const navigate = useNavigate();
    const { mutateAsync: applyMutation, isPending } = useApplyForSweepstar();

    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(null);

    const handleSubmit = async (values) => {
        setSubmitError(null);
        setSubmitSuccess(null);

        try {
            await applyMutation(values);
            setSubmitSuccess(
                "We will review your profile and get back to you shortly."
            );
            setTimeout(() => {
                navigate("/dashboard");
            }, 2000);
        } catch (error) {
            console.error("Application Error:", error);
            setSubmitError(
                error?.response?.data?.message ||
                    "Something went wrong. Please try again."
            );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-6 flex justify-center">
            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div
                    className="absolute -bottom-8 left-20 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
                    style={{ animationDelay: "2s" }}
                ></div>
            </div>

            <div className="w-full max-w-2xl relative z-10">
                {/* Header Section */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mb-4 shadow-lg">
                        <Sparkles className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">
                        Join as a Sweepstar
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-md mx-auto">
                        Turn your cleaning expertise into a thriving income
                        stream
                    </p>
                </div>

                {/* Benefits Preview */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                    {[
                        { icon: Sparkles, label: "Flexible Work" },
                        { icon: DollarSign, label: "Earn More" },
                        { icon: CheckCircle2, label: "Be Your Boss" },
                    ].map((benefit, idx) => (
                        <div
                            key={idx}
                            className="bg-card border border-border rounded-lg p-4 text-center hover:shadow-md transition-all duration-200 hover:border-primary"
                        >
                            <benefit.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                            <p className="text-sm font-medium text-foreground">
                                {benefit.label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Form Card */}
                <BecomeProForm
                    onSubmit={handleSubmit}
                    isSubmitting={isPending}
                    submitError={submitError}
                    submitSuccess={submitSuccess}
                />

                {/* Footer Trust Signal */}
                <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" />
                        <span>Secure</span>
                    </div>
                    <div className="w-1 h-1 bg-border rounded-full"></div>
                    <span>Fast Processing</span>
                    <div className="w-1 h-1 bg-border rounded-full"></div>
                    <span>No Hidden Fees</span>
                </div>
            </div>
        </div>
    );
}
