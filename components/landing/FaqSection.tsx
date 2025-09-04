"use client";

import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
   {
      question: "Who is SixPathCast for?",
      answer: "SixPathCast is designed for content creators, marketers, entrepreneurs, and agencies who want to streamline their content workflow, save time, and generate high-quality content consistently."
   },
   {
      question: "Can the AI really match my brand voice?",
      answer: "Yes! Our advanced AI can be trained on your existing content, documents, and even your website. It learns your unique style, tone, and terminology to create content that is authentically yours."
   },
   {
      question: "What platforms do you support?",
      answer: "We support all major social media platforms including Facebook, Instagram, Twitter, LinkedIn, TikTok, and Pinterest. You can also generate content for blogs, emails, and websites."
   },
   {
      question: "Is there a free trial?",
      answer: "Absolutely. You can sign up for a 14-day free trial to explore all our features with no credit card required. We want you to be sure it's the right fit for you."
   },
   {
      question: "What if I don't like the generated content?",
      answer: "Our platform is built for collaboration. You can easily edit any generated content, provide feedback to the AI, or regenerate it with a different prompt. Your feedback helps the AI get even better over time."
   }
]

export const FaqSection = () => {
   return (
      <section id="faq" className="py-20 bg-card">
         <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
               <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
               <p className="text-lg text-muted-foreground mt-4">
                  Have questions? We've got answers.
               </p>
            </div>
            <Accordion type="single" collapsible className="w-full">
               {faqItems.map((item, index) => (
                  <AccordionItem value={`item-${index + 1}`} key={index}>
                     <AccordionTrigger className="text-lg text-left">{item.question}</AccordionTrigger>
                     <AccordionContent className="text-base text-muted-foreground">
                        {item.answer}
                     </AccordionContent>
                  </AccordionItem>
               ))}
            </Accordion>
         </div>
      </section>
   );
};
