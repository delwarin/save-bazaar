import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Store, Users, Leaf } from "lucide-react";

const benefits = [
  { icon: <Store className="h-5 w-5" />, text: "সম্পূর্ণ বিনামূল্যে পোস্ট করুন" },
  { icon: <Users className="h-5 w-5" />, text: "হাজারো ক্রেতার কাছে পৌঁছান" },
  { icon: <Leaf className="h-5 w-5" />, text: "অপচয় কমিয়ে পরিবেশ বাঁচান" },
];

const CtaSection = () => (
  <section className="relative overflow-hidden bg-hero-gradient">
    <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
    <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-primary-foreground/5 blur-3xl pointer-events-none" />

    <div className="container py-20 relative z-10">
      <div className="max-w-2xl mx-auto text-center text-primary-foreground">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up">
          আপনার উদ্বৃত্ত পণ্য পোস্ট করুন
        </h2>
        <p className="text-lg opacity-90 mb-8 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          রেস্টুরেন্ট, দোকান বা ব্যক্তিগত — যে কেউ বিনামূল্যে পোস্ট করতে পারবেন
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          {benefits.map((b, i) => (
            <div key={i} className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
              {b.icon}
              <span>{b.text}</span>
            </div>
          ))}
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <Link to="/register">
            <Button variant="warm" size="lg" className="text-base h-12 px-10 rounded-xl">
              বিনামূল্যে নিবন্ধন করুন
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default CtaSection;
