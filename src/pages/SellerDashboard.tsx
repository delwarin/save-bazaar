import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { sampleProducts } from "@/data/sampleData";
import { Link } from "react-router-dom";
import { Plus, Package, Eye, User, Settings, BarChart3 } from "lucide-react";

const sellerProducts = sampleProducts.slice(0, 3);

const stats = [
  { label: "মোট পোস্ট", value: "১২", icon: <Package className="h-5 w-5" /> },
  { label: "মোট ভিউ", value: "৩৪৫", icon: <Eye className="h-5 w-5" /> },
  { label: "বিক্রি/দান", value: "৮", icon: <BarChart3 className="h-5 w-5" /> },
];

const SellerDashboard = () => (
  <Layout>
    <div className="bg-card border-b">
      <div className="container py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">স্টার কাবাব</h1>
            <p className="text-sm text-muted-foreground">বিক্রেতা ড্যাশবোর্ড</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/dashboard/seller/post">
            <Button variant="hero" className="gap-1.5">
              <Plus className="h-4 w-4" />
              নতুন পণ্য পোস্ট
            </Button>
          </Link>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>

    <div className="container py-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="rounded-xl border bg-card p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* My Products */}
      <h2 className="text-xl font-bold text-foreground mb-4">আমার পোস্ট সমূহ</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sellerProducts.map((p) => (
          <ProductCard key={p.id} item={p} />
        ))}
      </div>
    </div>
  </Layout>
);

export default SellerDashboard;
