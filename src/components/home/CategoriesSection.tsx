import { UtensilsCrossed, ShoppingCart, Shirt, BookOpen } from "lucide-react";
import CategoryCard from "@/components/CategoryCard";

const categories = [
  {
    icon: <UtensilsCrossed className="h-7 w-7" />,
    title: "খাবার",
    description: "রেস্টুরেন্ট থেকে মেয়াদোত্তীর্ণ হওয়ার আগে সাশ্রয়ী মূল্যে খাবার কিনুন",
    href: "/category/food",
    count: 45,
  },
  {
    icon: <ShoppingCart className="h-7 w-7" />,
    title: "মুদি দোকান",
    description: "উদ্বৃত্ত মুদি পণ্য কম দামে সংগ্রহ করুন",
    href: "/category/grocery",
    count: 32,
  },
  {
    icon: <Shirt className="h-7 w-7" />,
    title: "পোশাক",
    description: "পুরাতন কাপড় বিনামূল্যে পান, শুধু ডেলিভারি খরচ",
    href: "/category/clothes",
    count: 78,
  },
  {
    icon: <BookOpen className="h-7 w-7" />,
    title: "বই",
    description: "পুরাতন বই বিনামূল্যে পান, জ্ঞান ভাগ করুন",
    href: "/category/books",
    count: 56,
  },
];

const CategoriesSection = () => (
  <section className="container py-20">
    <div className="text-center mb-12">
      <span className="inline-block bg-accent/10 text-accent text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
        ক্যাটাগরি
      </span>
      <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2">আপনার প্রয়োজনীয় পণ্য খুঁজে নিন</h2>
      <p className="text-muted-foreground">চারটি ক্যাটাগরিতে হাজারো পণ্য অপেক্ষা করছে</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {categories.map((cat, i) => (
        <div key={cat.href} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
          <CategoryCard {...cat} />
        </div>
      ))}
    </div>
  </section>
);

export default CategoriesSection;
