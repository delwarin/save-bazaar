import { Recycle, Heart, Truck, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: <Recycle className="h-8 w-8" />,
    step: "০১",
    title: "পোস্ট করুন",
    description: "আপনার উদ্বৃত্ত খাবার, পুরাতন কাপড় বা বই বিনামূল্যে পোস্ট করুন — কোনো খরচ নেই",
  },
  {
    icon: <Heart className="h-8 w-8" />,
    step: "০২",
    title: "খুঁজে নিন",
    description: "ক্রেতারা সাশ্রয়ী মূল্যে বা সম্পূর্ণ বিনামূল্যে পণ্য খুঁজে নিতে পারবেন",
  },
  {
    icon: <Truck className="h-8 w-8" />,
    step: "০৩",
    title: "সংগ্রহ করুন",
    description: "সরাসরি নিয়ে যান অথবা ডেলিভারি পান আপনার ঠিকানায়",
  },
];

const HowItWorksSection = () => (
  <section className="bg-card border-y">
    <div className="container py-20">
      <div className="text-center mb-14">
        <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
          কিভাবে কাজ করে?
        </span>
        <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2">
          মাত্র তিনটি সহজ ধাপে শুরু করুন
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          যে কেউ সহজেই পণ্য পোস্ট করতে বা সংগ্রহ করতে পারবেন
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {/* Connecting line on desktop */}
        <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-border" />

        {steps.map((s, i) => (
          <div
            key={i}
            className="relative text-center bg-background rounded-2xl p-8 border shadow-sm hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            <div className="mx-auto mb-2 text-xs font-bold text-accent">{s.step}</div>
            <div className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              {s.icon}
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>

            {i < steps.length - 1 && (
              <div className="hidden md:flex absolute -right-3 top-16 z-10 h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <ArrowRight className="h-3 w-3" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
