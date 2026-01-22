// src/pages/Homepage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Zap,
    Users,
    Shield,
    TrendingUp,
    Star,
    ArrowRight,
    Check,
    Sparkles,
} from "lucide-react";

export default function Homepage() {
    // Features for customization
    const features = [
        {
            icon: Zap,
            title: "Lightning Fast",
            description:
                "Experience blazing fast service bookings and responses",
        },
        {
            icon: Shield,
            title: "Secure & Trusted",
            description:
                "Your data is protected with enterprise-grade security",
        },
        {
            icon: Users,
            title: "Expert Professionals",
            description:
                "Connect with verified and experienced cleaning experts",
        },
        {
            icon: TrendingUp,
            title: "Best Rates",
            description: "Competitive pricing with transparent billing",
        },
    ];

    // Pricing plans for customization
    const plans = [
        {
            name: "Basic",
            price: "$29",
            description: "Perfect for occasional cleaning",
            features: [
                "Up to 4 bookings per month",
                "Standard cleaning package",
                "24-hour support",
                "Basic customer reviews",
            ],
            popular: false,
        },
        {
            name: "Professional",
            price: "$79",
            description: "Best for regular maintenance",
            features: [
                "Unlimited bookings",
                "All cleaning packages",
                "Priority 2-hour support",
                "Advanced scheduling",
                "Custom packages",
                "Professional quality guarantee",
            ],
            popular: true,
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "For large-scale operations",
            features: [
                "Dedicated account manager",
                "Custom solutions",
                "24/7 priority support",
                "Bulk pricing",
                "API access",
                "Advanced analytics",
            ],
            popular: false,
        },
    ];

    // Testimonials for customization
    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Homeowner",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
            quote: "CleanConnect made finding reliable cleaners so easy. Highly recommended!",
            rating: 5,
        },
        {
            name: "Mike Chen",
            role: "Business Owner",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
            quote: "Professional service, competitive prices. Our office has never looked better!",
            rating: 5,
        },
        {
            name: "Emma Davis",
            role: "Regular Customer",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
            quote: "Consistent quality and reliable scheduling. Worth every penny.",
            rating: 5,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
            {/* Hero Section */}
            <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 pt-32">
                {/* Background decorative elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-12 space-y-6">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-sm font-semibold text-primary">
                                Welcome to CleanConnect
                            </span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground">
                            Professional Cleaning
                            <span className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
                                {" "}
                                Made Simple
                            </span>
                        </h1>

                        {/* Subheading */}
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Book trusted cleaning professionals in minutes. From
                            homes to offices, we've got you covered with
                            reliable service and transparent pricing.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Link to="/contact">
                                <Button
                                    size="lg"
                                    className="rounded-lg font-semibold h-12 bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all duration-200 group px-8"
                                >
                                    Get Started
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link to="/contact">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="rounded-lg font-semibold h-12 border-border/60 hover:bg-muted/50 transition-colors px-8"
                                >
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Hero Image/Showcase */}
                    <div className="mt-16 rounded-2xl border border-border/60 bg-muted/30 backdrop-blur-sm overflow-hidden shadow-2xl">
                        <div className="aspect-video bg-gradient-to-br from-primary/10 to-muted/50 flex items-center justify-center">
                            <div className="text-6xl">✨</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl font-bold text-foreground">
                            Why Choose CleanConnect?
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Experience the difference with our comprehensive
                            cleaning solutions
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="group rounded-xl border border-border/60 bg-background/50 backdrop-blur-sm p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="mb-4 p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors w-fit">
                                        <Icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-foreground mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl font-bold text-foreground">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Choose the perfect plan for your cleaning needs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan, index) => (
                            <div
                                key={index}
                                className={`rounded-2xl border transition-all duration-300 ${
                                    plan.popular
                                        ? "border-primary/60 bg-background shadow-2xl scale-105 md:scale-100"
                                        : "border-border/60 bg-background/50"
                                } backdrop-blur-sm p-8 hover:shadow-lg`}
                            >
                                {plan.popular && (
                                    <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10">
                                        <Star className="w-4 h-4 text-primary" />
                                        <span className="text-xs font-semibold text-primary">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <h3 className="text-2xl font-bold text-foreground mb-2">
                                    {plan.name}
                                </h3>
                                <p className="text-muted-foreground text-sm mb-4">
                                    {plan.description}
                                </p>

                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-foreground">
                                        {plan.price}
                                    </span>
                                    {plan.price !== "Custom" && (
                                        <span className="text-muted-foreground">
                                            /month
                                        </span>
                                    )}
                                </div>

                                <Button
                                    className={`w-full rounded-lg font-semibold h-11 mb-8 ${
                                        plan.popular
                                            ? "bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg"
                                            : "border-border/60"
                                    }`}
                                    variant={
                                        plan.popular ? "default" : "outline"
                                    }
                                >
                                    {plan.price === "Custom"
                                        ? "Contact Sales"
                                        : "Get Started"}
                                </Button>

                                <div className="space-y-4">
                                    {plan.features.map((feature, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-start gap-3"
                                        >
                                            <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                            <span className="text-sm text-muted-foreground">
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl font-bold text-foreground">
                            What Our Customers Say
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Join thousands of satisfied customers
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="rounded-xl border border-border/60 bg-background/50 backdrop-blur-sm p-6 hover:shadow-lg transition-all duration-300"
                            >
                                {/* Stars */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map(
                                        (_, i) => (
                                            <Star
                                                key={i}
                                                className="w-4 h-4 fill-primary text-primary"
                                            />
                                        )
                                    )}
                                </div>

                                {/* Quote */}
                                <p className="text-muted-foreground mb-6 italic">
                                    "{testimonial.quote}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-4">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div>
                                        <p className="font-semibold text-foreground text-sm">
                                            {testimonial.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 via-background to-muted/30 backdrop-blur-sm p-12 text-center">
                        <h2 className="text-4xl font-bold text-foreground mb-4">
                            Ready to Get Started?
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Join thousands of happy customers and experience the
                            CleanConnect difference today.
                        </p>
                        <Link to="/contact">
                            <Button
                                size="lg"
                                className="rounded-lg font-semibold h-12 bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all duration-200 group px-8"
                            >
                                Book Your First Service
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
