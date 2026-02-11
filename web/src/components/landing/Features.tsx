import { Zap, Shield, UserCheck, LayoutTemplate } from "lucide-react";

const features = [
  {
    icon: UserCheck,
    title: "One Master Profile",
    description: "Enter your personal, family, and academic details once. We format it for every exam automatically."
  },
  {
    icon: Zap,
    title: "Instant Auto-Fill",
    description: "Our browser extension detects form fields on official portals and fills them in seconds."
  },
  {
    icon: LayoutTemplate,
    title: "Smart Document Resizer",
    description: "We automatically resize your photo and signature to meet the specific requirements of each exam."
  },
  {
    icon: Shield,
    title: "Secure & Encrypted",
    description: "Your data is encrypted and stored securely in the cloud. Access your profile from any device, anytime."
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to apply faster</h2>
          <p className="text-lg text-slate-600">Focus on your preparation, not on filling out 50 slightly different forms.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all duration-300 group">
              <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
