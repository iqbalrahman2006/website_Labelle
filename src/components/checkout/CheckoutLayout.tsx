"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { CHECKOUT_STEPS, CheckoutStep } from "@/types/checkout.types";

interface CheckoutLayoutProps {
    currentStep: 'shipping' | 'payment' | 'confirmation';
    children: React.ReactNode;
}

export function CheckoutLayout({ currentStep, children }: CheckoutLayoutProps) {
    const currentStepIndex = CHECKOUT_STEPS.findIndex(step => step.id === currentStep);

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="container py-8">
                {/* Progress Steps */}
                <div className="mb-12">
                    <div className="flex items-center justify-center">
                        {CHECKOUT_STEPS.map((step, index) => (
                            <div key={step.id} className="flex items-center">
                                {/* Step Circle */}
                                <div className="flex flex-col items-center">
                                    <div
                                        className={cn(
                                            "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all",
                                            index < currentStepIndex
                                                ? "border-primary bg-primary text-white"
                                                : index === currentStepIndex
                                                    ? "border-primary bg-white text-primary"
                                                    : "border-slate-300 bg-white text-slate-400"
                                        )}
                                    >
                                        {index < currentStepIndex ? (
                                            <Check className="h-6 w-6" />
                                        ) : (
                                            <span className="font-semibold">{index + 1}</span>
                                        )}
                                    </div>
                                    <div className="mt-2 text-center">
                                        <p
                                            className={cn(
                                                "text-sm font-medium",
                                                index <= currentStepIndex
                                                    ? "text-slate-900"
                                                    : "text-slate-500"
                                            )}
                                        >
                                            {step.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground hidden sm:block">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Connector Line */}
                                {index < CHECKOUT_STEPS.length - 1 && (
                                    <div
                                        className={cn(
                                            "h-0.5 w-16 sm:w-32 mx-2 transition-all",
                                            index < currentStepIndex
                                                ? "bg-primary"
                                                : "bg-slate-300"
                                        )}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content */}
                {children}
            </div>
        </div>
    );
}
