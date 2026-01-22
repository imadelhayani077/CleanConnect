// src/pages/Contact.jsx
import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Validation schema
const contactFormSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    subject: z.string().min(5, "Subject must be at least 5 characters"),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const form = useForm({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
        },
    });

    async function onSubmit(data) {
        setIsSubmitting(true);
        try {
            // Replace with your actual API endpoint
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setSubmitSuccess(true);
                form.reset();
                setTimeout(() => setSubmitSuccess(false), 5000);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    const contactInfo = [
        {
            icon: Mail,
            title: "Email",
            value: "support@cleanconnect.com",
            description: "We'll reply within 24 hours",
        },
        {
            icon: Phone,
            title: "Phone",
            value: "+1 (555) 123-4567",
            description: "Monday to Friday, 9am-6pm",
        },
        {
            icon: MapPin,
            title: "Address",
            value: "123 Clean Street, City, State 12345",
            description: "Visit our office",
        },
        {
            icon: Clock,
            title: "Business Hours",
            value: "Mon - Fri: 9:00 AM - 6:00 PM",
            description: "Weekend support available",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
            {/* Hero Section */}
            <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
                        Get in Touch
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Have questions? We'd love to hear from you. Send us a
                        message and we'll respond as soon as possible.
                    </p>
                </div>

                {/* Contact Info Cards */}
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {contactInfo.map((info, index) => {
                        const Icon = info.icon;
                        return (
                            <div
                                key={index}
                                className="group rounded-xl border border-border/60 bg-background/50 backdrop-blur-sm p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                        <Icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-foreground mb-1">
                                            {info.title}
                                        </h3>
                                        <p className="text-sm font-medium text-foreground break-words">
                                            {info.value}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            {info.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    <div className="rounded-2xl border border-border/60 bg-background/80 backdrop-blur-sm shadow-xl p-8 md:p-12">
                        {submitSuccess ? (
                            // Success Message
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="mb-4 p-4 rounded-full bg-emerald-100 dark:bg-emerald-900/20">
                                    <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-2">
                                    Message Sent!
                                </h3>
                                <p className="text-muted-foreground mb-6 max-w-sm">
                                    Thank you for contacting us. We've received
                                    your message and will get back to you
                                    shortly.
                                </p>
                                <Button onClick={() => setSubmitSuccess(false)}>
                                    Send Another Message
                                </Button>
                            </div>
                        ) : (
                            // Form
                            <>
                                <h2 className="text-3xl font-bold text-foreground mb-2">
                                    Send us a Message
                                </h2>
                                <p className="text-muted-foreground mb-8">
                                    Fill out the form below and we'll get back
                                    to you as soon as possible.
                                </p>

                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(onSubmit)}
                                        className="space-y-6"
                                    >
                                        {/* Name Row */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="firstName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            First Name
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="John"
                                                                {...field}
                                                                className="rounded-lg"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="lastName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Last Name
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Doe"
                                                                {...field}
                                                                className="rounded-lg"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {/* Email & Phone Row */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Email Address
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="email"
                                                                placeholder="john@example.com"
                                                                {...field}
                                                                className="rounded-lg"
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
                                                        <FormLabel>
                                                            Phone Number
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="tel"
                                                                placeholder="+1 (555) 123-4567"
                                                                {...field}
                                                                className="rounded-lg"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {/* Subject */}
                                        <FormField
                                            control={form.control}
                                            name="subject"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Subject
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="How can we help?"
                                                            {...field}
                                                            className="rounded-lg"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Message */}
                                        <FormField
                                            control={form.control}
                                            name="message"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Message
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Tell us more about your inquiry..."
                                                            rows={6}
                                                            className="rounded-lg resize-none"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Please provide as much
                                                        detail as possible.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Submit Button */}
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            size="lg"
                                            className="w-full rounded-lg font-semibold group"
                                        >
                                            <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                                            {isSubmitting
                                                ? "Sending..."
                                                : "Send Message"}
                                        </Button>
                                    </form>
                                </Form>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30 mt-12">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
                        Frequently Asked Questions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            {
                                q: "What's your response time?",
                                a: "We typically respond to inquiries within 24 business hours.",
                            },
                            {
                                q: "Do you offer phone support?",
                                a: "Yes, call us during business hours: Monday-Friday, 9am-6pm.",
                            },
                            {
                                q: "Can I schedule a service consultation?",
                                a: "Absolutely! Use our booking system or contact us directly.",
                            },
                            {
                                q: "What if I need urgent assistance?",
                                a: "For urgent matters, call our emergency line during business hours.",
                            },
                        ].map((faq, index) => (
                            <div
                                key={index}
                                className="rounded-lg border border-border/60 bg-background p-6"
                            >
                                <h3 className="font-semibold text-foreground mb-3">
                                    {faq.q}
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
