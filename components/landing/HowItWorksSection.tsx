"use client";

import { ArrowRight } from "lucide-react";

const steps = [
    {
        number: "01",
        title: "Connect Your Data",
        description: "Link your social accounts, upload your brand documents, or provide a URL. The AI instantly learns your voice and style."
    },
    {
        number: "02",
        title: "Choose Your Goal",
        description: "Whether you need a single social post, a full landing page, or a month of content, just tell the AI what you want to create."
    },
    {
        number: "03",
        title: "Generate & Refine",
        description: "Generate content in one click. Review, edit, and regenerate until it's perfect, then schedule it directly to your platforms."
    }
];

export const HowItWorksSection = () => {
    return (
        <section id="how-it-works" className="py-20">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">Get Results in 3 Simple Steps</h2>
                    <p className="max-w-2xl mx-auto text-lg text-muted-foreground mt-4">
                        From idea to published content in minutes, not hours.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 text-center relative">
                    {steps.map((step, index) => (
                        <div key={step.number} className="p-8">
                            <div className="text-5xl font-bold text-primary mb-4">{step.number}</div>
                            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>
                            {index < steps.length - 1 && (
                                <ArrowRight className="absolute top-1/2 -translate-y-1/2 right-1/3 text-muted-foreground/20 h-16 w-16 hidden md:block" style={{ right: `${(2-index) * 33.33 - 16.66}%`}}/>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
