import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Package, Eye, User, Settings, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Tables } from "@/integrations/supabase/types";

const SellerDashboard = () => {
  const { user, isReady, profile } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Tables<"items">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isReady && !user) {
      navigate("/login");
    }
  }, [isReady, user, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchItems = async () => {
      const { data } = await supabase
        .from("items")
        .select("*")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });
      setItems(data || []);
      setLoading(false);
    };
    fetchItems();
  }, [user]);

  const sellerName = profile?.full_name || "বিক্রেতা";

  return (
    <Layout>
      <div className="bg-card border-b">
        <div className="container py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{sellerName}</h1>
              <p className="text-sm text-muted-foreground">বিক্রেতা ড্যাশবোর্ড</p>
            </div>
          </div>
          <Link to="/dashboard/seller/post">
            <Button variant="hero" className="gap-1.5">
              <Plus className="h-4 w-4" />
              নতুন পণ্য পোস্ট
            </Button>
          </Link>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border bg-card p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{items.length}</p>
              <p className="text-sm text-muted-foreground">মোট পোস্ট</p>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{items.filter(i => i.status === "active").length}</p>
              <p className="text-sm text-muted-foreground">সক্রিয় পণ্য</p>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{items.filter(i => i.is_free).length}</p>
              <p className="text-sm text-muted-foreground">বিনামূল্যে পণ্য</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-4">আমার পোস্ট সমূহ</h2>
        {loading ? (
          <p className="text-muted-foreground">লোড হচ্ছে...</p>
        ) : items.length === 0 ? (
          <div className="text-center py-12 rounded-xl border bg-card">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">এখনও কোনো পণ্য পোস্ট করেননি</p>
            <Link to="/dashboard/seller/post">
              <Button variant="hero">প্রথম পণ্য পোস্ট করুন</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item) => (
              <ProductCard
                key={item.id}
                item={{
                  id: item.id,
                  title: item.title,
                  price: item.price ?? 0,
                  originalPrice: undefined,
                  image: item.image_url || "/placeholder.svg",
                  seller: sellerName,
                  location: item.division,
                  expiryDate: item.expiry_date || undefined,
                  isFree: item.is_free ?? false,
                  category: item.category as any,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SellerDashboard;
