import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus } from "lucide-react";

const HeroSection = () => (
  <section className="bg-hero-gradient">
    <div className="container py-14 md:py-20 text-center text-primary-foreground">
      <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4 animate-fade-in-up">
        অপচয় কমান, <span className="text-accent">সম্প্রদায়কে</span> সাহায্য করুন
      </h1>
      <p className="text-base md:text-lg opacity-90 max-w-xl mx-auto mb-8 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        মেয়াদ শেষের আগে খাবার, পুরাতন কাপড় ও বই — বিনামূল্যে পোস্ট করুন, সাশ্রয়ী মূল্যে বিক্রি করুন
      </p>
      <div className="flex flex-wrap justify-center gap-3 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <Link to="/register">
          <Button variant="warm" size="lg" className="rounded-xl h-11 px-6 text-base">
            <Plus className="h-4 w-4 mr-1" />
            পণ্য পোস্ট করুন
          </Button>
        </Link>
        <Link to="/category/food">
          <Button variant="outline" size="lg" className="rounded-xl h-11 px-6 text-base border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
            পণ্য দেখুন
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  </section>
);

export default HeroSection;
