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
import { useLocation, useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { Checkbox } from "@radix-ui/react-checkbox";
import { useLogin } from "@/Hooks/useAuth";

const formSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    remember: z.boolean().optional(),
});

export default function ClientLoginForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const { mutateAsync: loginUser, isPending } = useLogin();

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
                    message: "These credentials do not match our records.",
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
        <div className="form-container">
            {location.state?.alert && (
                <div className="p-4 mb-4 text-sm rounded-lg bg-green-100 text-green-700">
                    {location.state.alert.type} : {location.state.alert.message}
                </div>
            )}

            <h1 className="text-2xl font-semibold mb-6 text-foreground">
                Sign in to your account
            </h1>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="form-wrapper"
                >
                    {/* Email */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter your email"
                                        autoComplete="email"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Password */}
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Remember me */}
                    <FormField
                        control={form.control}
                        name="remember"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2 space-y-0 my-4">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="h-4 w-4 border border-gray-400 rounded data-[state=checked]:bg-black data-[state=checked]:text-white"
                                    />
                                </FormControl>
                                <FormLabel className="text-sm font-medium cursor-pointer">
                                    Remember me
                                </FormLabel>
                            </FormItem>
                        )}
                    />

                    {/* Submit */}
                    <Button
                        disabled={isPending}
                        type="submit"
                        className="w-full"
                    >
                        {isPending ? (
                            <>
                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
