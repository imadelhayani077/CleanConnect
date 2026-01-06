// src/pages/auth/ClientRegisterForm.jsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNavigate, Link } from "react-router-dom";
import {
    Loader2,
    Eye,
    EyeOff,
    User,
    Mail,
    Phone,
    Lock,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import { useRegister } from "@/Hooks/useAuth";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z
    .object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Please enter a valid email address"),
        phone: z
            .string()
            .min(10, "Phone number must be at least 10 digits")
            .regex(/^[\d\s\-\+\(\)]+$/, "Please enter a valid phone number"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                /[A-Z]/,
                "Password must contain at least one uppercase letter"
            )
            .regex(
                /[a-z]/,
                "Password must contain at least one lowercase letter"
            )
            .regex(/[0-9]/, "Password must contain at least one number"),
        password_confirmation: z.string(),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Passwords do not match",
        path: ["password_confirmation"],
    });

export default function ClientRegisterForm() {
    const navigate = useNavigate();
    const { mutateAsync: registerUser, isPending } = useRegister();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [registrationError, setRegistrationError] = useState(null);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
            password_confirmation: "",
        },
    });

    const passwordValue = form.watch("password");

    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: "" };
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        const labels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
        const colors = [
            "bg-gray-300",
            "bg-red-500",
            "bg-orange-500",
            "bg-yellow-500",
            "bg-lime-500",
            "bg-green-500",
        ];

        return { strength, label: labels[strength], color: colors[strength] };
    };

    const passwordStrength = getPasswordStrength(passwordValue);

    const onSubmit = async (values) => {
        setRegistrationError(null);
        try {
            await registerUser(values);

            navigate("/login", {
                state: {
                    alert: {
                        type: "success",
                        message: "Account created successfully! Please login.",
                    },
                },
            });
        } catch (error) {
            console.error("Registration failed:", error);

            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                Object.keys(errors).forEach((key) => {
                    form.setError(key, { message: errors[key][0] });
                });
            } else {
                setRegistrationError(
                    "Registration failed. Please try again later."
                );
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center px-4 py-12">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground mb-4 shadow-lg">
                        <span className="font-bold text-lg">CC</span>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        Create Account
                    </h1>
                    <p className="text-muted-foreground">
                        Join CleanConnect and start booking services
                    </p>
                </div>

                {/* Error Alert */}
                {registrationError && (
                    <Alert className="mb-6 border-red-200/60 bg-red-50/50 dark:bg-red-900/20 dark:border-red-800/60">
                        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        <AlertDescription className="text-red-800 dark:text-red-300">
                            {registrationError}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Form Container */}
                <div className="rounded-2xl border border-border/60 bg-background/80 backdrop-blur-xl shadow-xl p-8">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-5"
                        >
                            {/* Full Name */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold text-foreground">
                                            Full Name
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="John Doe"
                                                    autoComplete="name"
                                                    className="pl-10 rounded-lg h-10 bg-muted/40 border-border/60 focus:border-primary/50 focus:bg-background transition-colors"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold text-foreground">
                                            Email Address
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    type="email"
                                                    placeholder="you@example.com"
                                                    autoComplete="email"
                                                    className="pl-10 rounded-lg h-10 bg-muted/40 border-border/60 focus:border-primary/50 focus:bg-background transition-colors"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            {/* Phone */}
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold text-foreground">
                                            Phone Number
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    type="tel"
                                                    placeholder="+1 (555) 123-4567"
                                                    autoComplete="tel"
                                                    className="pl-10 rounded-lg h-10 bg-muted/40 border-border/60 focus:border-primary/50 focus:bg-background transition-colors"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            {/* Password */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold text-foreground">
                                            Password
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    placeholder="Create a strong password"
                                                    autoComplete="new-password"
                                                    className="pl-10 pr-10 rounded-lg h-10 bg-muted/40 border-border/60 focus:border-primary/50 focus:bg-background transition-colors"
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            !showPassword
                                                        )
                                                    }
                                                    className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="w-4 h-4" />
                                                    ) : (
                                                        <Eye className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </FormControl>

                                        {/* Password Strength Indicator */}
                                        {passwordValue && (
                                            <div className="mt-2 space-y-2">
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map(
                                                        (i) => (
                                                            <div
                                                                key={i}
                                                                className={`h-1.5 flex-1 rounded-full transition-colors ${
                                                                    i <=
                                                                    passwordStrength.strength
                                                                        ? passwordStrength.color
                                                                        : "bg-muted"
                                                                }`}
                                                            />
                                                        )
                                                    )}
                                                </div>
                                                <p className="text-xs font-medium text-muted-foreground">
                                                    Strength:{" "}
                                                    <span
                                                        className={
                                                            passwordStrength.strength >=
                                                            4
                                                                ? "text-green-600 dark:text-green-400"
                                                                : "text-orange-600 dark:text-orange-400"
                                                        }
                                                    >
                                                        {passwordStrength.label}
                                                    </span>
                                                </p>
                                            </div>
                                        )}

                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            {/* Confirm Password */}
                            <FormField
                                control={form.control}
                                name="password_confirmation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold text-foreground">
                                            Confirm Password
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    type={
                                                        showConfirm
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    placeholder="Confirm your password"
                                                    autoComplete="new-password"
                                                    className="pl-10 pr-10 rounded-lg h-10 bg-muted/40 border-border/60 focus:border-primary/50 focus:bg-background transition-colors"
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowConfirm(
                                                            !showConfirm
                                                        )
                                                    }
                                                    className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    {showConfirm ? (
                                                        <EyeOff className="w-4 h-4" />
                                                    ) : (
                                                        <Eye className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            {/* Submit Button */}
                            <Button
                                disabled={isPending}
                                type="submit"
                                size="lg"
                                className="w-full rounded-lg font-semibold h-10 mt-6 bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all duration-200 group"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        Sign Up
                                        <span className="ml-2 group-hover:translate-x-1 transition-transform">
                                            →
                                        </span>
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-border/60" />
                        <span className="text-xs text-muted-foreground font-medium">
                            Already have an account?
                        </span>
                        <div className="flex-1 h-px bg-border/60" />
                    </div>

                    {/* Login Link */}
                    <Link to="/login">
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full rounded-lg font-semibold h-10 border-border/60 hover:bg-muted/50 transition-colors"
                        >
                            Sign In Instead
                        </Button>
                    </Link>
                </div>

                {/* Footer Links */}
                <div className="mt-6 text-center text-xs text-muted-foreground">
                    <p className="mb-3">
                        By signing up, you agree to our{" "}
                        <Link
                            to="/terms"
                            className="text-primary hover:underline"
                        >
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                            to="/privacy"
                            className="text-primary hover:underline"
                        >
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
