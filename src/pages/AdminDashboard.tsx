import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Navigate } from "react-router-dom";
import { Shield, Users, Package, ShoppingBag, Check, X, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ItemWithSeller {
  id: string;
  title: string;
  description: string | null;
  category: string;
  price: number | null;
  is_free: boolean | null;
  division: string;
  address: string | null;
  image_url: string | null;
  images: string[] | null;
  status: string;
  created_at: string;
  seller_id: string;
  seller_name: string;
}

const AdminDashboard = () => {
  const { user, isReady, role } = useAuth();
  const [stats, setStats] = useState({ users: 0, items: 0, orders: 0, pending: 0 });
  const [pendingItems, setPendingItems] = useState<ItemWithSeller[]>([]);
  const [allItems, setAllItems] = useState<ItemWithSeller[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = async () => {
    if (!user || role !== "admin") return;

    const [profilesRes, itemsRes, ordersRes, pendingRes, allItemsRes] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("items").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("id", { count: "exact", head: true }),
      supabase.from("items").select("*").eq("status", "pending").order("created_at", { ascending: false }),
      supabase.from("items").select("*").order("created_at", { ascending: false }).limit(50),
    ]);

    setStats({
      users: profilesRes.count ?? 0,
      items: itemsRes.count ?? 0,
      orders: ordersRes.count ?? 0,
      pending: pendingRes.data?.length ?? 0,
    });

    // Fetch seller names for items
    const items = [...(pendingRes.data || []), ...(allItemsRes.data || [])];
    const sellerIds = [...new Set(items.map((i) => i.seller_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name")
      .in("user_id", sellerIds);
    const profileMap = new Map(profiles?.map((p) => [p.user_id, p.full_name]) || []);

    const mapItem = (item: any): ItemWithSeller => ({
      ...item,
      seller_name: profileMap.get(item.seller_id) || "অজানা",
    });

    setPendingItems((pendingRes.data || []).map(mapItem));
    setAllItems((allItemsRes.data || []).map(mapItem));
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user, role]);

  const handleApprove = async (itemId: string) => {
    setActionLoading(itemId);
    const { error } = await supabase.from("items").update({ status: "active" }).eq("id", itemId);
    setActionLoading(null);
    if (error) {
      toast.error("অনুমোদন ব্যর্থ: " + error.message);
    } else {
      toast.success("পণ্য অনুমোদিত হয়েছে!");
      fetchData();
    }
  };

  const handleReject = async (itemId: string) => {
    setActionLoading(itemId);
    const { error } = await supabase.from("items").update({ status: "rejected" }).eq("id", itemId);
    setActionLoading(null);
    if (error) {
      toast.error("প্রত্যাখ্যান ব্যর্থ: " + error.message);
    } else {
      toast.success("পণ্য প্রত্যাখ্যাত হয়েছে");
      fetchData();
    }
  };

  if (!isReady) return <Layout><div className="container py-16 text-center text-muted-foreground">লোড হচ্ছে...</div></Layout>;
  if (!user) return <Navigate to="/login" />;
  if (role !== "admin") return <Navigate to="/" />;

  const statCards = [
    { label: "মোট ব্যবহারকারী", value: stats.users, icon: <Users className="h-5 w-5" /> },
    { label: "মোট পণ্য", value: stats.items, icon: <Package className="h-5 w-5" /> },
    { label: "মোট অর্ডার", value: stats.orders, icon: <ShoppingBag className="h-5 w-5" /> },
    { label: "অপেক্ষমাণ পণ্য", value: stats.pending, icon: <Clock className="h-5 w-5" />, highlight: true },
  ];

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; className: string }> = {
      pending: { label: "অপেক্ষমাণ", className: "bg-accent/20 text-accent-foreground border-accent/30" },
      active: { label: "অনুমোদিত", className: "bg-primary/10 text-primary border-primary/20" },
      rejected: { label: "প্রত্যাখ্যাত", className: "bg-destructive/10 text-destructive border-destructive/20" },
    };
    const s = map[status] || { label: status, className: "" };
    return <Badge variant="outline" className={s.className}>{s.label}</Badge>;
  };

  const ItemRow = ({ item, showActions }: { item: ItemWithSeller; showActions: boolean }) => (
    <div className="flex gap-4 p-4 border rounded-xl bg-background">
      <div className="h-20 w-20 rounded-lg bg-muted overflow-hidden shrink-0">
        <img
          src={item.image_url || "/placeholder.svg"}
          alt={item.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-foreground text-sm line-clamp-1">{item.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              বিক্রেতা: {item.seller_name} • {item.division}
            </p>
            <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{item.description}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {statusBadge(item.status)}
            <span className="text-sm font-bold text-primary">
              {item.is_free ? "বিনামূল্যে" : `৳${item.price}`}
            </span>
          </div>
        </div>
        {showActions && item.status === "pending" && (
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              variant="default"
              className="gap-1 h-8"
              onClick={() => handleApprove(item.id)}
              disabled={actionLoading === item.id}
            >
              <Check className="h-3.5 w-3.5" />
              অনুমোদন
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="gap-1 h-8"
              onClick={() => handleReject(item.id)}
              disabled={actionLoading === item.id}
            >
              <X className="h-3.5 w-3.5" />
              প্রত্যাখ্যান
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="bg-card border-b">
        <div className="container py-8 flex items-center gap-3">
          <div className="h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
            <Shield className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">অ্যাডমিন ড্যাশবোর্ড</h1>
            <p className="text-sm text-muted-foreground">সম্পূর্ণ প্ল্যাটফর্ম ব্যবস্থাপনা</p>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <div key={i} className={`rounded-xl border bg-card p-5 flex items-center gap-4 ${s.highlight ? "border-accent ring-1 ring-accent/20" : ""}`}>
              <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${s.highlight ? "bg-accent/20 text-accent" : "bg-primary/10 text-primary"}`}>
                {s.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending" className="gap-1">
              <Clock className="h-4 w-4" />
              অপেক্ষমাণ ({pendingItems.length})
            </TabsTrigger>
            <TabsTrigger value="all" className="gap-1">
              <Package className="h-4 w-4" />
              সকল পণ্য
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {loading ? (
              <p className="text-center text-muted-foreground py-8">লোড হচ্ছে...</p>
            ) : pendingItems.length === 0 ? (
              <div className="text-center py-12 border rounded-xl bg-card">
                <Check className="h-12 w-12 text-primary mx-auto mb-3" />
                <p className="text-muted-foreground">কোনো অপেক্ষমাণ পণ্য নেই</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingItems.map((item) => (
                  <ItemRow key={item.id} item={item} showActions />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="all">
            {loading ? (
              <p className="text-center text-muted-foreground py-8">লোড হচ্ছে...</p>
            ) : allItems.length === 0 ? (
              <div className="text-center py-12 border rounded-xl bg-card">
                <p className="text-muted-foreground">কোনো পণ্য নেই</p>
              </div>
            ) : (
              <div className="space-y-3">
                {allItems.map((item) => (
                  <ItemRow key={item.id} item={item} showActions={item.status === "pending"} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
