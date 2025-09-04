import { CtaSection } from "@/components/landing/CtaSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function Home() {
   return (
      <div className="min-h-screen bg-background text-foreground">
         <LandingHeader />

         <main>
            <HeroSection />
            {/* <FeaturesSection /> */}
            <HowItWorksSection />
            <FaqSection />
            <CtaSection />
         </main>

         <LandingFooter />
      </div>
   );
}
