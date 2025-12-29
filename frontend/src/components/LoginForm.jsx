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
import { useClientContext } from "@/Helper/ClientContext";
import { Checkbox } from "@radix-ui/react-checkbox";
import ClientApi from "@/Services/ClientApi";

const formSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    remember: z.boolean().optional(),
});

export default function ClientLoginForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, setAuthenticated, setUser } = useClientContext();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            remember: false,
        },
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
        setError,
        clearErrors,
    } = form;

    const onSubmit = async (values) => {
        clearErrors();

        try {
            // 1. Perform Login (Sets the cookie)
            const res = await login(values);

            if (res.status === 204) {
                // 2. Fetch the User to know their Role
                const { data: user } = await ClientApi.getClient();

                // 3. Update Context
                setAuthenticated(true);
                setUser(user);

                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Login failed:", error);

            if (error.response?.status === 422) {
                const errors = error.response.data.errors || {};
                Object.keys(errors).forEach((field) => {
                    setError(field, {
                        type: "manual",
                        message: errors[field][0],
                    });
                });
            } else {
                setError("email", {
                    message: "Invalid credentials or server error",
                });
            }
        }
    };

    return (
        <>
            {location.state?.alert && (
                <div className="p-4 mb-4 text-sm rounded-lg bg-green-100 text-green-700">
                    {location.state.alert.type} : {location.state.alert.message}
                </div>
            )}
            <Form {...form}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="form-wrapper"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter your email"
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
                                        placeholder="Enter your password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="remember"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        className="h-4 w-4 border-2 border-gray-400 rounded data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                        checked={field.value}
                                        onCheckedChange={(checked) =>
                                            field.onChange(checked === true)
                                        }
                                    />
                                </FormControl>
                                <FormLabel className="text-sm font-medium">
                                    Remember me
                                </FormLabel>
                            </FormItem>
                        )}
                    />

                    <Button
                        disabled={isSubmitting}
                        type="submit"
                        className="w-full"
                    >
                        {isSubmitting ? (
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
        </>
    );
}
