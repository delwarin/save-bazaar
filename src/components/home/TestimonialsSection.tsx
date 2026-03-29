import { Star } from "lucide-react";

const testimonials = [
  {
    name: "রাহেলা বেগম",
    role: "রেস্টুরেন্ট মালিক, ঢাকা",
    text: "প্রতিদিন যে খাবার নষ্ট হতো, এখন সেটা কম দামে বিক্রি করতে পারছি। অপচয় আমার ব্যবসায় নতুন মাত্রা যোগ করেছে।",
    rating: 5,
  },
  {
    name: "করিম উদ্দিন",
    role: "ক্রেতা, চট্টগ্রাম",
    text: "খুব কম দামে ভালো মানের খাবার পাচ্ছি। আর পুরাতন বইও বিনামূল্যে পেয়েছি। এটি সত্যিই দারুণ একটি প্ল্যাটফর্ম!",
    rating: 5,
  },
  {
    name: "নাজমা আক্তার",
    role: "মুদি দোকানদার, রাজশাহী",
    text: "মেয়াদ শেষ হওয়ার আগে পণ্য পোস্ট করে লস কমাতে পারছি। অপচয়ের জন্য ধন্যবাদ!",
    rating: 5,
  },
];

const TestimonialsSection = () => (
  <section className="container py-20">
    <div className="text-center mb-14">
      <span className="inline-block bg-accent/10 text-accent text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
        মানুষের কথা
      </span>
      <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2">
        যারা ব্যবহার করছেন, তাদের অভিজ্ঞতা
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {testimonials.map((t, i) => (
        <div
          key={i}
          className="bg-card border rounded-2xl p-6 hover:shadow-card-hover transition-all duration-300 animate-fade-in-up"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <div className="flex gap-0.5 mb-4">
            {Array.from({ length: t.rating }).map((_, j) => (
              <Star key={j} className="h-4 w-4 fill-accent text-accent" />
            ))}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-5 italic">"{t.text}"</p>
          <div>
            <p className="font-semibold text-foreground text-sm">{t.name}</p>
            <p className="text-xs text-muted-foreground">{t.role}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default TestimonialsSection;
