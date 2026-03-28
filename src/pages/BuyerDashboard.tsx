import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import ProductCard, { ProductItem } from "@/components/ProductCard";
import { User, Settings, ShoppingBag, MapPin, Package, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface OrderWithItem {
  id: string;
  status: string;
  message: string | null;
  created_at: string;
  item_title: string;
  item_image: string;
  item_price: number;
  item_is_free: boolean;
  item_id: string;
  seller_name: string;
}

const BuyerDashboard = () => {
  const { user, isReady, profile } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderWithItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isReady && !user) navigate("/login");
  }, [isReady, user, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      const { data: orderData } = await supabase
        .from("orders")
        .select("*")
        .eq("buyer_id", user.id)
        .neq("status", "cancelled")
        .order("created_at", { ascending: false });

      if (!orderData || orderData.length === 0) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const itemIds = [...new Set(orderData.map((o) => o.item_id))];
      const { data: items } = await supabase
        .from("items")
        .select("*")
        .in("id", itemIds);

      const sellerIds = [...new Set(items?.map((i) => i.seller_id) || [])];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", sellerIds);

      const itemMap = new Map(items?.map((i) => [i.id, i]) || []);
      const profileMap = new Map(profiles?.map((p) => [p.user_id, p.full_name]) || []);

      const mapped: OrderWithItem[] = orderData.map((o) => {
        const item = itemMap.get(o.item_id);
        return {
          id: o.id,
          status: o.status,
          message: o.message,
          created_at: o.created_at,
          item_title: item?.title || "পণ্য",
          item_image: (item as any)?.images?.[0] || item?.image_url || "/placeholder.svg",
          item_price: item?.price ?? 0,
          item_is_free: item?.is_free ?? false,
          item_id: o.item_id,
          seller_name: profileMap.get(item?.seller_id || "") || "বিক্রেতা",
        };
      });

      setOrders(mapped);
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  const cartOrders = orders.filter((o) => o.status === "cart");
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const completedOrders = orders.filter((o) => o.status === "completed");

  const statusLabel: Record<string, string> = {
    cart: "কার্টে",
    pending: "প্রক্রিয়াধীন",
    completed: "সম্পন্ন",
    confirmed: "নিশ্চিত",
  };

  const statusColor: Record<string, string> = {
    cart: "bg-muted text-muted-foreground",
    pending: "bg-primary/10 text-primary",
    completed: "bg-green-100 text-green-700",
    confirmed: "bg-blue-100 text-blue-700",
  };

  const buyerName = profile?.full_name || "ক্রেতা";

  return (
    <Layout>
      <div className="bg-card border-b">
        <div className="container py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-accent/20 flex items-center justify-center text-accent">
              <User className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{buyerName}</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {profile?.division || "বাংলাদেশ"}
              </p>
            </div>
          </div>
          <Link to="/cart">
            <Button variant="outline" className="gap-1.5">
              <ShoppingBag className="h-4 w-4" />
              কার্ট ({cartOrders.length})
            </Button>
          </Link>
        </div>
      </div>

      <div className="container py-8">
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border bg-card p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{cartOrders.length}</p>
              <p className="text-sm text-muted-foreground">কার্টে</p>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{pendingOrders.length}</p>
              <p className="text-sm text-muted-foreground">প্রক্রিয়াধীন</p>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{completedOrders.length}</p>
              <p className="text-sm text-muted-foreground">সম্পন্ন</p>
            </div>
          </div>
        </div>

        {/* Orders */}
        <h2 className="text-xl font-bold text-foreground mb-4">আমার অর্ডার সমূহ</h2>
        {loading ? (
          <p className="text-muted-foreground">লোড হচ্ছে...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 rounded-xl border bg-card">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">এখনও কোনো অর্ডার নেই</p>
            <Link to="/">
              <Button variant="hero">পণ্য দেখুন</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="rounded-xl border bg-card p-4 flex items-center gap-4">
                <Link to={`/product/${order.item_id}`} className="flex-shrink-0">
                  <img
                    src={order.item_image}
                    alt={order.item_title}
                    className="h-16 w-16 rounded-lg object-cover bg-muted"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${order.item_id}`}>
                    <h3 className="font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors">
                      {order.item_title}
                    </h3>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    বিক্রেতা: {order.seller_name} • {new Date(order.created_at).toLocaleDateString("bn-BD")}
                  </p>
                </div>
                <div className="text-right flex flex-col items-end gap-1.5">
                  <span className="text-lg font-bold text-primary">
                    {order.item_is_free ? "বিনামূল্যে" : `৳${order.item_price}`}
                  </span>
                  <Badge className={statusColor[order.status] || "bg-muted text-muted-foreground"}>
                    {statusLabel[order.status] || order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BuyerDashboard;
