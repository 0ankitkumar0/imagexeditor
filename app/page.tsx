"use client";

import React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import {
  Shirt,
  Zap,
  Box,
  Wand2,
  PenTool,
  Download,
  ShoppingCart,
  RefreshCcw,
  Printer,
  MonitorSmartphone,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const features = [
  { icon: Box, title: "Real-Time 3D Preview", desc: "Instantly see designs wrapped on 3D models with realistic lighting and shadows." },
  { icon: Wand2, title: "AI Image Generation", desc: "Empower customers to create unique graphics using integrated AI generation tools." },
  { icon: PenTool, title: "Fabric.js Design Editing", desc: "Robust 2D canvas for placing, scaling, and rotating artwork precisely." },
  { icon: Download, title: "PSD Export Workflow", desc: "Generate print-ready files automatically for seamless production handover." },
  { icon: ShoppingCart, title: "Ecommerce Website Integration", desc: "Embed the customizer into Shopify, WooCommerce, or any custom storefront." },
  { icon: RefreshCcw, title: "Live Texture Updates", desc: "Watch materials and graphics update in milliseconds on the 3D garment." },
  { icon: Printer, title: "Custom Apparel Printing", desc: "Streamlined workflow designed specifically for print-on-demand and local shops." },
  { icon: MonitorSmartphone, title: "Responsive Visualization", desc: "Flawless experience across desktop, tablet, and mobile devices." }
];

const showcases = [
  {
    title: "T-Shirt Customization Workflow",
    description: "Offer your customers a fluid t-shirt design experience. From uploading their own logos to generating AI art, the intuitive interface ensures high conversion rates for your custom apparel line.",
    image: "/placeholder-tshirt.jpg", // We don't have images, so we'll use a styled div
    color: "bg-blue-50 dark:bg-blue-900/20",
    icon: <Shirt className="w-8 h-8 text-blue-600 dark:text-blue-400" />
  },
  {
    title: "Hoodie Customization Workflow",
    description: "Premium heavyweight hoodies demand a premium customization experience. Showcase intricate details like drawstrings, pocket placements, and accurate fabric textures in real-time 3D.",
    image: "/placeholder-hoodie.jpg",
    color: "bg-indigo-50 dark:bg-indigo-900/20",
    icon: <Zap className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />,
    reversed: true
  },
  {
    title: "AI-Generated Apparel Graphics",
    description: "Remove the friction of 'I don't have a design.' Your customers can type a prompt and instantly get production-ready, high-resolution graphics applied directly to their chosen garment.",
    image: "/placeholder-ai.jpg",
    color: "bg-purple-50 dark:bg-purple-900/20",
    icon: <Wand2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f5f5] to-[#d9d9d9] dark:from-[#222222] dark:to-[#111111] text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-200 dark:selection:bg-indigo-900/50">

      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#f5f5f5]/80 dark:bg-[#1a1a1a]/80 border-b border-black/5 dark:border-white/5">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 dark:bg-white p-1.5 rounded-lg">
              <Box className="w-5 h-5 text-white dark:text-slate-900" />
            </div>
            <span className="font-bold text-xl tracking-tight">Tryvirtual</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">Features</a>
            <a href="#integration" className="hover:text-slate-900 dark:hover:text-white transition-colors">Integration</a>
            <a href="#showcase" className="hover:text-slate-900 dark:hover:text-white transition-colors">Showcase</a>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/customize?type=tshirt"
              className="hidden md:flex items-center justify-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-10 pb-20 md:pt-14 md:pb-32 overflow-hidden px-6">
          {/* Background Image with Blur */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 dark:opacity-30 blur-1xl scale-110"
              style={{ backgroundImage: "url('/images/webbg.jpg')" }}
            />
            {/* Gradient overlay to blend with the main background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#f5f5f5]/50 to-[#d9d9d9] dark:from-[#222222]/50 dark:to-[#111111]" />
          </div>

          <div className="container mx-auto max-w-5xl text-center relative z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="flex flex-col items-center"
            >


              <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
                <span className="text-[#0EA5E9]">Customize</span> Apparel in Real-Time <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-900 dark:from-slate-300 dark:to-white">with 3D </span>
                <span className="text-[#8B5CF6]">Visualization</span>
              </motion.h1>

              <motion.p variants={fadeIn} className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mb-10 leading-relaxed">
                Tryvirtual helps ecommerce businesses and apparel startups provide live hoodie and t-shirt customization experiences directly on their websites.
              </motion.p>

              <motion.div variants={fadeIn} className="flex flex-wrap justify-center gap-3 mb-12 text-sm font-medium text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> AI-powered design generation</span>
                <span className="hidden md:block">•</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> 3D product visualization</span>
                <span className="hidden md:block">•</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Real-time editing</span>
                <span className="hidden md:block">•</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Ecommerce integration</span>
              </motion.div>

              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link
                  href="/customize?type=tshirt"
                  className="group flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] dark:shadow-[0_4px_14px_0_rgba(255,255,255,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_6px_20px_rgba(255,255,255,0.15)] active:scale-[0.98]"
                >
                  <Shirt className="w-5 h-5" />
                  Customize T-Shirt
                </Link>
                <Link
                  href="/customize?type=hoodie"
                  className="group flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-8 py-4 rounded-xl font-semibold text-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
                >
                  <Zap className="w-5 h-5" />
                  Customize Hoodie
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Business Integration Section */}
        <section id="integration" className="py-24 bg-white dark:bg-[#151515] border-y border-black/5 dark:border-white/5">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Built for Ecommerce Integration</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-12">
                Tryvirtual isn't just a standalone tool. It's a platform designed to seamlessly integrate into your existing ecommerce website. Whether you are an apparel printing company looking to streamline orders or a startup selling custom streetwear, our platform improves customer experience and enables live product personalization before checkout.
              </p>
              <div className="grid md:grid-cols-3 gap-8 text-left">
                <div className="p-6 rounded-2xl bg-[#f5f5f5] dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5">
                  <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                    <MonitorSmartphone className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Embed Anywhere</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Add our customizer directly to your product pages with a simple iframe or SDK integration.</p>
                </div>
                <div className="p-6 rounded-2xl bg-[#f5f5f5] dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5">
                  <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                    <ShoppingCart className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Cart Syncing</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Completed designs automatically pass accurate pricing, size, and design data to your checkout.</p>
                </div>
                <div className="p-6 rounded-2xl bg-[#f5f5f5] dark:bg-[#1a1a1a] border border-black/5 dark:border-white/5">
                  <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                    <Printer className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Print-Ready Output</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Receive high-resolution, print-ready files immediately when an order is placed on your store.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Platform Features</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Everything you need to offer a world-class customization experience to your customers.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white/60 dark:bg-[#1a1a1a]/60 backdrop-blur-sm p-6 rounded-2xl border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5 transition-all duration-300"
                >
                  <feature.icon className="w-8 h-8 text-slate-700 dark:text-slate-300 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Showcase Section */}
        <section id="showcase" className="py-24 bg-white dark:bg-[#151515] border-t border-black/5 dark:border-white/5 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Experience the Workflow</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Discover how Tryvirtual powers the custom apparel journey from blank canvas to print-ready product.
              </p>
            </div>

            <div className="space-y-24">
              {showcases.map((item, idx) => (
                <div key={idx} className={`flex flex-col ${item.reversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12`}>
                  <div className="flex-1 w-full">
                    <div className={`aspect-video rounded-3xl ${item.color} flex items-center justify-center border border-black/5 dark:border-white/5 shadow-inner`}>
                      {/* Conceptual placeholder for product image/demo */}
                      <div className="bg-white/50 dark:bg-black/20 p-6 rounded-2xl backdrop-blur-md shadow-lg border border-white/20 dark:border-white/5">
                        {item.icon}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 w-full space-y-6">
                    <h3 className="text-2xl md:text-3xl font-bold">{item.title}</h3>
                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Premium realistic visualization
                      </li>
                      <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Frictionless editing tools
                      </li>
                      <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Export-ready output
                      </li>
                    </ul>
                    <div className="pt-4">
                      <Link href="/customize?type=tshirt" className="inline-flex items-center gap-2 text-slate-900 dark:text-white font-semibold hover:gap-3 transition-all">
                        Try it live <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/5 dark:border-white/5 bg-[#f5f5f5] dark:bg-[#111111] py-12 px-6">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 dark:bg-white p-1 rounded-md">
              <Box className="w-4 h-4 text-white dark:text-slate-900" />
            </div>
            <span className="font-bold text-lg tracking-tight">Tryvirtual</span>
          </div>

          <p className="text-slate-500 dark:text-slate-400 text-sm text-center md:text-left max-w-md">
            A Web-Based Apparel Customization and 3D Visualization Platform trusted by modern ecommerce businesses.
          </p>

          <div className="flex gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact</a>
          </div>
        </div>
        <div className="container mx-auto max-w-6xl mt-8 pt-8 border-t border-black/5 dark:border-white/5 text-center text-sm text-slate-500 dark:text-slate-500">
          © {new Date().getFullYear()} Tryvirtual Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
}