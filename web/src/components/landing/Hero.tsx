import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-b from-indigo-50/50 to-white">
      <div className="container mx-auto px-4 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-8 border border-indigo-200">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Now supporting JEE Mains 2026
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
          Don't Type. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Just Apply.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          The smart assistant that auto-fills your JEE, NEET, and CET application forms instantly. One profile, everywhere.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/signup">
            <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200">
              Create My Profile
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/extension">
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-2 border-slate-200 hover:bg-slate-50 text-slate-700">
              Download Extension
            </Button>
          </Link>
        </div>

        {/* Social Proof / Trust */}
        <div className="flex items-center justify-center gap-8 text-sm font-medium text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <span>100% Free for Students</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <span>Secure Cloud Storage</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <span>Works on 10+ Portals</span>
          </div>
        </div>

      </div>
    </section>
  );
}
