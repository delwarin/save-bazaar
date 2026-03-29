import Layout from "@/components/Layout";
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CtaSection from "@/components/home/CtaSection";

const Index = () => (
  <Layout>
    <HeroSection />
    <CategoriesSection />
    <HowItWorksSection />
    <FeaturedProductsSection />
    <TestimonialsSection />
    <CtaSection />
  </Layout>
);

export default Index;
