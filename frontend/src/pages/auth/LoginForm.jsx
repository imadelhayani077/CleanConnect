// src/pages/auth/ClientLoginForm.jsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
    Loader2,
    Eye,
    EyeOff,
    Mail,
    Lock,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useLogin } from "@/Hooks/useAuth";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    remember: z.boolean().optional(),
});

export default function ClientLoginForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const { mutateAsync: loginUser, isPending } = useLogin();
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            remember: false,
        },
    });

    const onSubmit = async (values) => {
        form.clearErrors();

        try {
            await loginUser(values);
        } catch (error) {
            console.error("Login failed:", error);

            if (error.response?.status === 422) {
                const errors = error.response.data.errors || {};
                Object.keys(errors).forEach((field) => {
                    form.setError(field, {
                        type: "manual",
                        message: errors[field][0],
                    });
                });
            } else if (error.response?.status === 401) {
                form.setError("email", {
                    type: "manual",
                    message: "Invalid email or password.",
                });
            } else {
                form.setError("email", {
                    type: "manual",
                    message: "Something went wrong. Please try again.",
                });
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
                        Welcome Back
                    </h1>
                    <p className="text-muted-foreground">
                        Sign in to your CleanConnect account
                    </p>
                </div>

                {/* Alert Messages */}
                {location.state?.alert && (
                    <Alert className="mb-6 border-emerald-200/60 bg-emerald-50/50 dark:bg-emerald-900/20 dark:border-emerald-800/60">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <AlertDescription className="text-emerald-800 dark:text-emerald-300">
                            {location.state.alert.message}
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
                            {/* Email Field */}
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

                            {/* Password Field */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center justify-between mb-2">
                                            <FormLabel className="text-sm font-semibold text-foreground">
                                                Password
                                            </FormLabel>
                                            <Link
                                                to="/forgot-password"
                                                className="text-xs text-primary hover:underline font-medium"
                                            >
                                                Forgot?
                                            </Link>
                                        </div>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    placeholder="Enter your password"
                                                    autoComplete="current-password"
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
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            {/* Remember Me */}
                            <FormField
                                control={form.control}
                                name="remember"
                                render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="rounded"
                                            />
                                        </FormControl>
                                        <FormLabel className="text-sm font-medium text-muted-foreground cursor-pointer">
                                            Keep me signed in
                                        </FormLabel>
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
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
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
                            Don't have an account?
                        </span>
                        <div className="flex-1 h-px bg-border/60" />
                    </div>

                    {/* Sign Up Link */}
                    <Link to="/signup">
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full rounded-lg font-semibold h-10 border-border/60 hover:bg-muted/50 transition-colors"
                        >
                            Create Account
                        </Button>
                    </Link>
                </div>

                {/* Footer Links */}
                <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                    <Link
                        to="/privacy"
                        className="hover:text-primary transition-colors"
                    >
                        Privacy Policy
                    </Link>
                    <span>•</span>
                    <Link
                        to="/terms"
                        className="hover:text-primary transition-colors"
                    >
                        Terms of Service
                    </Link>
                </div>
            </div>
        </div>
    );
}
