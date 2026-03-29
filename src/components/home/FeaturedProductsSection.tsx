import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ProductCard, { ProductItem } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";

const FeaturedProductsSection = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);

  useEffect(() => {
    const fetchRecent = async () => {
      const { data } = await supabase
        .from("items")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(8);

      if (data) {
        const sellerIds = [...new Set(data.map((i) => i.seller_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, full_name")
          .in("user_id", sellerIds);
        const profileMap = new Map(profiles?.map((p) => [p.user_id, p.full_name]) || []);

        setProducts(
          data.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description || "",
            price: item.price ?? 0,
            isFree: item.is_free ?? false,
            category: item.category as any,
            location: item.division,
            postedAt: new Date(item.created_at).toLocaleDateString("bn-BD"),
            expiresAt: item.expiry_date || undefined,
            image: item.image_url || "/placeholder.svg",
            images: item.images || [],
            sellerName: profileMap.get(item.seller_id) || "বিক্রেতা",
          }))
        );
      }
    };
    fetchRecent();
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="container py-20">
      <div className="flex items-end justify-between mb-10">
        <div>
          <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            নতুন পণ্য
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-1">সাম্প্রতিক পণ্য</h2>
          <p className="text-muted-foreground">নতুন যোগ করা পণ্য দেখুন</p>
        </div>
        <Link to="/category/food" className="hidden sm:block">
          <Button variant="outline" className="gap-1 rounded-xl">
            সব দেখুন <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {products.map((product, i) => (
          <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <ProductCard item={product} />
          </div>
        ))}
      </div>
      <div className="sm:hidden text-center mt-6">
        <Link to="/category/food">
          <Button variant="outline" className="gap-1 rounded-xl">
            সব দেখুন <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
