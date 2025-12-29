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
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { useClientContext } from "@/Helper/ClientContext";
import ClientApi from "@/Services/ClientApi";

const formSchema = z.object({
    name: z.string().min(6),
    email: z.string().email(),
    password: z.string().min(6),
    password_confirmation: z.string().min(6),
    phone: z.string().min(10),
});

export default function ClientRegisterForm() {
    const navigate = useNavigate();
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
    const { register } = useClientContext();

    const onSubmit = async (values) => {
        form.clearErrors(); // Clear previous errors
        console.log(values);
        if (values.password === values.password_confirmation) {
            try {
                const res = await register(values);

                if (res.status === 201 || res.status === 204) {
                    navigate("/login", {
                        state: {
                            alert: {
                                type: "success",
                                message:
                                    "Account created successfully. Please login.",
                            },
                        },
                    });
                }
            } catch (error) {
                console.error("Registration failed:", error);
            }
        } else {
            form.setError("password_confirmation", {
                type: "manual",
                message: "Passwords do not match",
            });
        }

        // try {
        //     const res = await login(values);

        //     if (res.status === 204) {
        //         setAuthenticated(true);
        //         navigate("/clientdashboard");
        //     }
        // } catch (error) {
        //     console.error("Login failed:", error);

        //     if (error.response?.status === 422) {
        //         const errors = error.response.data.errors || {};
        //         Object.keys(errors).forEach((field) => {
        //             form.setError(field, {
        //                 type: "manual",
        //                 message: errors[field][0],
        //             });
        //         });
        //     } else {
        //         form.setError("email", {
        //             message: "Invalid credentials or server error",
        //         });
        //     }
        // }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Your Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter Your name"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="Enter Your email"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                                <Input
                                    type="tel"
                                    placeholder="Enter Your phone number"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="Enter Your password"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password_confirmation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password Confirmation</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="password confirmation"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={form.formState.isSubmitting} type="submit">
                    {form.formState.isSubmitting ? (
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
    );
}
