import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Icons
import {
    Loader2,
    User,
    DollarSign,
    FileText,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

// UI Components
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Hooks
import { useApplyForSweepstar } from "@/Hooks/useSweepstar";

// --- Validation Schema ---
const applicationSchema = z.object({
    id_number: z
        .string()
        .min(6, "ID/Passport number must be at least 6 characters."),
    hourly_rate: z.coerce.number().min(10, "Minimum hourly rate is $10.00."),
    bio: z.string().min(20, "Please provide a bio of at least 20 characters."),
});

export default function SweepstarApply() {
    const navigate = useNavigate();

    const { mutateAsync: applyMutation, isPending } = useApplyForSweepstar();

    const form = useForm({
        resolver: zodResolver(applicationSchema),
        defaultValues: {
            id_number: "",
            hourly_rate: 25.0,
            bio: "",
        },
    });

    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(null);

    const onSubmit = async (values) => {
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
        <div className="flex justify-center items-center min-h-[80vh] p-4 animate-in fade-in slide-in-from-bottom-4">
            <Card className="w-full max-w-lg shadow-lg border-muted/60">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold">
                        Join as a Sweepstar
                    </CardTitle>
                    <CardDescription>
                        Turn your cleaning skills into income. Fill out the
                        details below.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {submitError && (
                        <div className="mb-4">
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Submission Failed</AlertTitle>
                                <AlertDescription>
                                    {submitError}
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}

                    {submitSuccess && (
                        <div className="mb-4">
                            <Alert className="border-green-200 bg-green-50 text-green-800">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <AlertTitle>Application Submitted!</AlertTitle>
                                <AlertDescription>
                                    {submitSuccess}
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-5"
                        >
                            {/* Field: ID Number */}
                            <FormField
                                control={form.control}
                                name="id_number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            ID / Passport Number
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="e.g. 900101 5000 089"
                                                    className="pl-9"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Field: Hourly Rate */}
                            <FormField
                                control={form.control}
                                name="hourly_rate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Desired Hourly Rate ($)
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    type="number"
                                                    step="0.50"
                                                    className="pl-9"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormDescription>
                                            We deduct a small service fee from
                                            this rate.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Field: Bio */}
                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Why should we hire you?
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Textarea
                                                    placeholder="Tell us about your experience, reliability, and cleaning skills..."
                                                    className="pl-9 min-h-[120px] resize-none"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full text-lg"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit Application"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
