import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import CategoryCard from "@/components/CategoryCard";
import ProductCard, { ProductItem } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, ShoppingCart, Shirt, BookOpen, ArrowRight, Recycle, Heart, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-illustration.jpg";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-illustration.jpg";

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

const howItWorks = [
  {
    icon: <Recycle className="h-8 w-8" />,
    title: "পোস্ট করুন",
    description: "আপনার উদ্বৃত্ত খাবার, পুরাতন কাপড় বা বই বিনামূল্যে পোস্ট করুন",
  },
  {
    icon: <Heart className="h-8 w-8" />,
    title: "খুঁজে নিন",
    description: "ক্রেতারা সাশ্রয়ী মূল্যে বা বিনামূল্যে পণ্য খুঁজে নিতে পারবেন",
  },
  {
    icon: <Truck className="h-8 w-8" />,
    title: "সংগ্রহ করুন",
    description: "সরাসরি নিয়ে যান অথবা ডেলিভারি পান আপনার ঠিকানায়",
  },
];

const Index = () => {
  const featuredProducts = sampleProducts.slice(0, 4);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="container py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-primary-foreground">
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
                অপচয় কমান,
                <br />
                <span className="text-accent">সম্প্রদায়কে</span> সাহায্য করুন
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-8 leading-relaxed max-w-lg">
                মেয়াদোত্তীর্ণ হওয়ার আগেই খাবার বিক্রি করুন, পুরাতন কাপড় ও বই দান করুন — সবই বিনামূল্যে পোস্ট করুন।
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/register">
                  <Button variant="warm" size="lg" className="text-base">
                    এখনই শুরু করুন
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
                <Link to="/category/food">
                  <Button variant="outline" size="lg" className="text-base border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                    পণ্য দেখুন
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src={heroImage}
                alt="অপচয় - সম্প্রদায় ভাগাভাগি"
                className="rounded-2xl shadow-2xl w-full"
                width={1280}
                height={720}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">ক্যাটাগরি সমূহ</h2>
          <p className="text-muted-foreground">আপনার প্রয়োজনীয় পণ্য খুঁজে নিন</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <CategoryCard key={cat.href} {...cat} />
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-card border-y">
        <div className="container py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">কিভাবে কাজ করে?</h2>
            <p className="text-muted-foreground">মাত্র তিনটি সহজ ধাপে</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">সাম্প্রতিক পণ্য</h2>
            <p className="text-muted-foreground">নতুন যোগ করা পণ্য দেখুন</p>
          </div>
          <Link to="/category/food">
            <Button variant="outline" className="gap-1">
              সব দেখুন <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} item={product} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-hero-gradient">
        <div className="container py-16 text-center text-primary-foreground">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">আপনার উদ্বৃত্ত পণ্য পোস্ট করুন</h2>
          <p className="text-lg opacity-90 mb-6 max-w-xl mx-auto">
            রেস্টুরেন্ট, দোকান বা ব্যক্তিগত — যে কেউ বিনামূল্যে পোস্ট করতে পারবেন
          </p>
          <Link to="/register">
            <Button variant="warm" size="lg" className="text-base">
              বিনামূল্যে নিবন্ধন করুন
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
