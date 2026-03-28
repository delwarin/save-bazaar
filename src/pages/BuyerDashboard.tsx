import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { sampleProducts } from "@/data/sampleData";
import { User, Settings, Heart, ShoppingBag, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const savedProducts = sampleProducts.slice(2, 6);

const BuyerDashboard = () => (
  <Layout>
    <div className="bg-card border-b">
      <div className="container py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 rounded-full bg-accent/20 flex items-center justify-center text-accent">
            <User className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">রহিম উদ্দিন</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" /> ঢাকা বিভাগ
            </p>
          </div>
        </div>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>

    <div className="container py-8">
      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="rounded-xl border bg-card p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">৪</p>
            <p className="text-sm text-muted-foreground">সেভ করা</p>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">২</p>
            <p className="text-sm text-muted-foreground">সংগ্রহ করা</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-foreground mb-4">সেভ করা পণ্য</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {savedProducts.map((p) => (
          <ProductCard key={p.id} item={p} />
        ))}
      </div>
    </div>
  </Layout>
);

export default BuyerDashboard;
