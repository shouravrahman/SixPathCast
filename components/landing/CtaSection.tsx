"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export const CtaSection = () => {
    return (
        <section className="py-20">
            <div className="container mx-auto text-center max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-bold">Ready to Reclaim Your Time?</h2>
                <p className="text-lg text-muted-foreground mt-4 mb-8">
                    Stop the content grind and start building your brand with the power of AI. Join thousands of creators who are shipping better content, faster.
                </p>
                <Link href="/dashboard">
                    <Button size="lg">Start Your 14-Day Free Trial</Button>
                </Link>
                <p className="text-sm text-muted-foreground mt-4">No credit card required.</p>
            </div>
        </section>
    )
}
