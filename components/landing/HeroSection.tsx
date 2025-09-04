"use client";
import React from "react";
import { motion } from "framer-motion";
import { LampContainer } from "../ui/lamp";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
   return (
      <>
         <motion.h1
            initial={{ opacity: 0.5, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
               delay: 0.3,
               duration: 0.8,
               ease: "easeInOut",
            }}
            className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
         >
            The AI-powered content creation platform for busy marketers and creators.
         </motion.h1>
         <p className="text-lg text-slate-400 text-center mt-4">
            The AI-powered content creation platform for busy marketers and creators.
         </p>
         <div className="mt-8 flex justify-center gap-4">
            <Link href="/dashboard">
               <Button>Get Started for Free</Button>
            </Link>
            <Link href="#features">
               <Button variant="outline">Learn More</Button>
            </Link>
         </div>
      </>
   );
}
