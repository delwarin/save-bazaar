import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-illustration.jpg";

const HeroSection = () => (
  <section className="relative overflow-hidden bg-hero-gradient">
    {/* Decorative blobs */}
    <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
    <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-primary-foreground/5 blur-3xl pointer-events-none" />

    <div className="container py-20 md:py-28 relative z-10">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="text-primary-foreground space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium animate-fade-in-up">
            <Sparkles className="h-4 w-4 text-accent" />
            <span>বাংলাদেশের প্রথম অপচয় রোধ প্ল্যাটফর্ম</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.15] tracking-tight animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            অপচয় কমান,
            <br />
            <span className="text-accent">সম্প্রদায়কে</span> সাহায্য করুন
          </h1>

          <p className="text-lg md:text-xl opacity-90 leading-relaxed max-w-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            মেয়াদোত্তীর্ণ হওয়ার আগেই খাবার বিক্রি করুন, পুরাতন কাপড় ও বই দান করুন — সবই <strong>বিনামূল্যে</strong> পোস্ট করুন।
          </p>

          <div className="flex flex-wrap gap-3 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Link to="/register">
              <Button variant="warm" size="lg" className="text-base h-12 px-8 rounded-xl">
                এখনই শুরু করুন
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
            <Link to="/category/food">
              <Button
                variant="outline"
                size="lg"
                className="text-base h-12 px-8 rounded-xl border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                পণ্য দেখুন
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center gap-6 pt-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">১০০+</p>
              <p className="text-xs opacity-70">বিক্রেতা</p>
            </div>
            <div className="h-8 w-px bg-primary-foreground/20" />
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">৫০০+</p>
              <p className="text-xs opacity-70">পণ্য পোস্ট</p>
            </div>
            <div className="h-8 w-px bg-primary-foreground/20" />
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">৮ বিভাগ</p>
              <p className="text-xs opacity-70">সারা বাংলাদেশে</p>
            </div>
          </div>
        </div>

        <div className="hidden md:block animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="relative">
            <div className="absolute -inset-4 bg-accent/20 rounded-3xl blur-2xl" />
            <img
              src={heroImage}
              alt="অপচয় - সম্প্রদায় ভাগাভাগি"
              className="relative rounded-2xl shadow-2xl w-full border-2 border-primary-foreground/10"
              width={1280}
              height={720}
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
