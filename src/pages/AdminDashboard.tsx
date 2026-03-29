import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Navigate } from "react-router-dom";
import { Shield, Users, Package, ShoppingBag, Check, X, Clock, UserCog, Trash2, UserPlus, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

interface UserWithRole {
  user_id: string;
  full_name: string | null;
  division: string | null;
  avatar_url: string | null;
  created_at: string;
  roles: string[];
}

const AdminDashboard = () => {
  const { user, isReady, role } = useAuth();
  const [stats, setStats] = useState({ users: 0, items: 0, orders: 0, pending: 0 });
  const [pendingItems, setPendingItems] = useState<ItemWithSeller[]>([]);
  const [allItems, setAllItems] = useState<ItemWithSeller[]>([]);
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [roleToAdd, setRoleToAdd] = useState<Record<string, string>>({});
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ full_name: "", email: "", password: "", division: "", role: "" });
  const [creating, setCreating] = useState(false);
  const [modOrders, setModOrders] = useState<any[]>([]);

  const isAdmin = role === "admin";
  const isModerator = role === "moderator";

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.full_name || !newUser.role) {
      toast.error("সব ফিল্ড পূরণ করুন");
      return;
    }
    if (newUser.password.length < 6) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে");
      return;
    }
    setCreating(true);
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-create-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newUser),
    });

    const result = await res.json();
    setCreating(false);

    if (!res.ok) {
      toast.error("ব্যবহারকারী তৈরি ব্যর্থ: " + (result.error || "Unknown error"));
    } else {
      toast.success("নতুন ব্যবহারকারী তৈরি হয়েছে!");
      setNewUser({ full_name: "", email: "", password: "", division: "", role: "" });
      setShowAddUser(false);
      fetchData();
    }
  };

  const fetchData = async () => {
    if (!user || (!isAdmin && !isModerator)) return;

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

    // Fetch users with roles (admin only)
    if (isAdmin) {
      const { data: allProfiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, division, avatar_url, created_at")
        .order("created_at", { ascending: false });

      const { data: allRoles } = await supabase.from("user_roles").select("user_id, role");

      const roleMap = new Map<string, string[]>();
      allRoles?.forEach((r) => {
        const existing = roleMap.get(r.user_id) || [];
        existing.push(r.role);
        roleMap.set(r.user_id, existing);
      });

      setUsers(
        (allProfiles || []).map((p) => ({
          ...p,
          roles: roleMap.get(p.user_id) || [],
        }))
      );
    }

    // Fetch moderator's own orders
    if (isModerator && user) {
      const { data: orderData } = await supabase
        .from("orders")
        .select("*")
        .eq("buyer_id", user.id)
        .neq("status", "cancelled")
        .order("created_at", { ascending: false });

      if (orderData && orderData.length > 0) {
        const itemIds = [...new Set(orderData.map((o) => o.item_id))];
        const { data: itemsData } = await supabase
          .from("items")
          .select("id, title, image_url, price, is_free, seller_id")
          .in("id", itemIds);

        const itemMap = new Map(itemsData?.map((i) => [i.id, i]) || []);
        const sellerIdsForOrders = [...new Set(itemsData?.map((i) => i.seller_id) || [])];
        const { data: sellerProfiles } = await supabase
          .from("profiles")
          .select("user_id, full_name")
          .in("user_id", sellerIdsForOrders);
        const sellerMap = new Map(sellerProfiles?.map((p) => [p.user_id, p.full_name]) || []);

        setModOrders(
          orderData.map((o) => {
            const item = itemMap.get(o.item_id);
            return {
              ...o,
              item_title: item?.title || "পণ্য",
              item_image: item?.image_url || "/placeholder.svg",
              item_price: item?.price || 0,
              item_is_free: item?.is_free || false,
              seller_name: item ? sellerMap.get(item.seller_id) || "বিক্রেতা" : "বিক্রেতা",
            };
          })
        );
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user, role]);

  const handleApprove = async (itemId: string) => {
    setActionLoading(itemId);
    const { error } = await supabase.from("items").update({ status: "active" }).eq("id", itemId);
    setActionLoading(null);
    if (error) toast.error("অনুমোদন ব্যর্থ: " + error.message);
    else { toast.success("পণ্য অনুমোদিত হয়েছে!"); fetchData(); }
  };

  const handleReject = async (itemId: string) => {
    setActionLoading(itemId);
    const { error } = await supabase.from("items").update({ status: "rejected" }).eq("id", itemId);
    setActionLoading(null);
    if (error) toast.error("প্রত্যাখ্যান ব্যর্থ: " + error.message);
    else { toast.success("পণ্য প্রত্যাখ্যাত হয়েছে"); fetchData(); }
  };

  const handleAddRole = async (userId: string) => {
    const newRole = roleToAdd[userId];
    if (!newRole) { toast.error("একটি ভূমিকা বাছুন"); return; }
    setActionLoading(userId);
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: newRole as any });
    setActionLoading(null);
    if (error) {
      if (error.message.includes("duplicate")) toast.error("এই ভূমিকা ইতিমধ্যে আছে");
      else toast.error("ভূমিকা যোগ ব্যর্থ: " + error.message);
    } else {
      toast.success("ভূমিকা যোগ হয়েছে!");
      setRoleToAdd((prev) => ({ ...prev, [userId]: "" }));
      fetchData();
    }
  };

  const handleRemoveRole = async (userId: string, roleToRemove: string) => {
    setActionLoading(`${userId}-${roleToRemove}`);
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role", roleToRemove as any);
    setActionLoading(null);
    if (error) toast.error("ভূমিকা মুছতে ব্যর্থ: " + error.message);
    else { toast.success("ভূমিকা মুছে ফেলা হয়েছে"); fetchData(); }
  };

  if (!isReady) return <Layout><div className="container py-16 text-center text-muted-foreground">লোড হচ্ছে...</div></Layout>;
  if (!user) return <Navigate to="/login" />;
  if (!isAdmin && !isModerator) return <Navigate to="/" />;

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

  const roleBadge = (r: string) => {
    const map: Record<string, string> = {
      admin: "bg-destructive/10 text-destructive border-destructive/20",
      moderator: "bg-accent/20 text-accent-foreground border-accent/30",
      seller: "bg-primary/10 text-primary border-primary/20",
      buyer: "bg-muted text-muted-foreground border-border",
    };
    const labels: Record<string, string> = {
      admin: "অ্যাডমিন",
      moderator: "ম্যানেজার",
      seller: "বিক্রেতা",
      buyer: "ক্রেতা",
    };
    return (
      <Badge key={r} variant="outline" className={map[r] || ""}>
        {labels[r] || r}
      </Badge>
    );
  };

  const ItemRow = ({ item, showActions }: { item: ItemWithSeller; showActions: boolean }) => (
    <div className="flex gap-4 p-4 border rounded-xl bg-background">
      <div className="h-20 w-20 rounded-lg bg-muted overflow-hidden shrink-0">
        <img src={item.image_url || "/placeholder.svg"} alt={item.title} className="h-full w-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-foreground text-sm line-clamp-1">{item.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">বিক্রেতা: {item.seller_name} • {item.division}</p>
            <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{item.description}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {statusBadge(item.status)}
            <span className="text-sm font-bold text-primary">{item.is_free ? "বিনামূল্যে" : `৳${item.price}`}</span>
          </div>
        </div>
        {showActions && item.status === "pending" && (
          <div className="flex gap-2 mt-3">
            <Button size="sm" variant="default" className="gap-1 h-8" onClick={() => handleApprove(item.id)} disabled={actionLoading === item.id}>
              <Check className="h-3.5 w-3.5" /> অনুমোদন
            </Button>
            <Button size="sm" variant="destructive" className="gap-1 h-8" onClick={() => handleReject(item.id)} disabled={actionLoading === item.id}>
              <X className="h-3.5 w-3.5" /> প্রত্যাখ্যান
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
            <h1 className="text-xl font-bold text-foreground">
              {isModerator ? "ম্যানেজার ড্যাশবোর্ড" : "অ্যাডমিন ড্যাশবোর্ড"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isModerator ? "পণ্য অনুমোদন ব্যবস্থাপনা" : "সম্পূর্ণ প্ল্যাটফর্ম ব্যবস্থাপনা"}
            </p>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats - hide for moderator */}
        {isAdmin && (
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
        )}

        {isModerator ? (
          <Tabs defaultValue="approval" className="space-y-4">
            <TabsList>
              <TabsTrigger value="approval" className="gap-1">
                <Clock className="h-4 w-4" /> পণ্য অনুমোদন ({pendingItems.length})
              </TabsTrigger>
              <TabsTrigger value="my-orders" className="gap-1">
                <ShoppingBag className="h-4 w-4" /> আমার অর্ডার ({modOrders.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="approval">
              {loading ? (
                <p className="text-center text-muted-foreground py-8">লোড হচ্ছে...</p>
              ) : pendingItems.length === 0 ? (
                <div className="text-center py-12 border rounded-xl bg-card">
                  <Check className="h-12 w-12 text-primary mx-auto mb-3" />
                  <p className="text-muted-foreground">কোনো অপেক্ষমাণ পণ্য নেই</p>
                </div>
              ) : (
                <div className="space-y-3">{pendingItems.map((item) => <ItemRow key={item.id} item={item} showActions />)}</div>
              )}
            </TabsContent>

            <TabsContent value="my-orders">
              {loading ? (
                <p className="text-center text-muted-foreground py-8">লোড হচ্ছে...</p>
              ) : modOrders.length === 0 ? (
                <div className="text-center py-12 border rounded-xl bg-card">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">এখনও কোনো অর্ডার নেই</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {modOrders.map((order) => (
                    <div key={order.id} className="flex gap-4 p-4 border rounded-xl bg-background">
                      <div className="h-16 w-16 rounded-lg bg-muted overflow-hidden shrink-0">
                        <img src={order.item_image} alt={order.item_title} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm line-clamp-1">{order.item_title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">বিক্রেতা: {order.seller_name}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className={
                            order.status === "pending" ? "bg-accent/20 text-accent-foreground" :
                            order.status === "completed" ? "bg-primary/10 text-primary" :
                            "bg-muted text-muted-foreground"
                          }>
                            {order.status === "cart" ? "কার্টে" : order.status === "pending" ? "প্রক্রিয়াধীন" : order.status === "completed" ? "সম্পন্ন" : order.status}
                          </Badge>
                          <span className="text-sm font-bold text-primary">
                            {order.item_is_free ? "বিনামূল্যে" : `৳${order.item_price}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList>
              <TabsTrigger value="pending" className="gap-1">
                <Clock className="h-4 w-4" /> অপেক্ষমাণ ({pendingItems.length})
              </TabsTrigger>
              <TabsTrigger value="all" className="gap-1">
                <Package className="h-4 w-4" /> সকল পণ্য
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-1">
                <UserCog className="h-4 w-4" /> ব্যবহারকারী
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
                <div className="space-y-3">{pendingItems.map((item) => <ItemRow key={item.id} item={item} showActions />)}</div>
              )}
            </TabsContent>

            <TabsContent value="all">
              {loading ? (
                <p className="text-center text-muted-foreground py-8">লোড হচ্ছে...</p>
              ) : allItems.length === 0 ? (
                <div className="text-center py-12 border rounded-xl bg-card"><p className="text-muted-foreground">কোনো পণ্য নেই</p></div>
              ) : (
                <div className="space-y-3">{allItems.map((item) => <ItemRow key={item.id} item={item} showActions={item.status === "pending"} />)}</div>
              )}
            </TabsContent>

            <TabsContent value="users">
              <div className="flex justify-end mb-4">
                <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
                  <DialogTrigger asChild>
                    <Button variant="hero" className="gap-1.5">
                      <UserPlus className="h-4 w-4" /> নতুন ব্যবহারকারী
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>নতুন ব্যবহারকারী তৈরি করুন</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 pt-2">
                      <div className="space-y-1.5">
                        <Label>পুরো নাম</Label>
                        <Input placeholder="নাম লিখুন" value={newUser.full_name} onChange={(e) => setNewUser((p) => ({ ...p, full_name: e.target.value }))} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>ইমেইল</Label>
                        <Input type="email" placeholder="email@example.com" value={newUser.email} onChange={(e) => setNewUser((p) => ({ ...p, email: e.target.value }))} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>পাসওয়ার্ড</Label>
                        <Input type="password" placeholder="কমপক্ষে ৬ অক্ষর" value={newUser.password} onChange={(e) => setNewUser((p) => ({ ...p, password: e.target.value }))} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>ভূমিকা</Label>
                        <Select value={newUser.role} onValueChange={(v) => setNewUser((p) => ({ ...p, role: v }))}>
                          <SelectTrigger><SelectValue placeholder="ভূমিকা বাছুন" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="buyer">ক্রেতা</SelectItem>
                            <SelectItem value="seller">বিক্রেতা</SelectItem>
                            <SelectItem value="moderator">ম্যানেজার</SelectItem>
                            <SelectItem value="admin">অ্যাডমিন</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label>বিভাগ</Label>
                        <Select value={newUser.division} onValueChange={(v) => setNewUser((p) => ({ ...p, division: v }))}>
                          <SelectTrigger><SelectValue placeholder="বিভাগ বাছুন" /></SelectTrigger>
                          <SelectContent>
                            {["ঢাকা", "চট্টগ্রাম", "রাজশাহী", "খুলনা", "বরিশাল", "সিলেট", "রংপুর", "ময়মনসিংহ"].map((d) => (
                              <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full" onClick={handleCreateUser} disabled={creating}>
                        {creating ? "তৈরি হচ্ছে..." : "ব্যবহারকারী তৈরি করুন"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {loading ? (
                <p className="text-center text-muted-foreground py-8">লোড হচ্ছে...</p>
              ) : users.length === 0 ? (
                <div className="text-center py-12 border rounded-xl bg-card"><p className="text-muted-foreground">কোনো ব্যবহারকারী নেই</p></div>
              ) : (
                <div className="space-y-3">
                  {users.map((u) => (
                    <div key={u.user_id} className="flex gap-4 p-4 border rounded-xl bg-background items-center">
                      <div className="h-12 w-12 rounded-full bg-muted overflow-hidden shrink-0 flex items-center justify-center">
                        {u.avatar_url ? (
                          <img src={u.avatar_url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <Users className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm">{u.full_name || "নাম নেই"}</p>
                        <p className="text-xs text-muted-foreground">{u.division || "বিভাগ নেই"} • যোগদান: {new Date(u.created_at).toLocaleDateString("bn-BD")}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {u.roles.map((r) => (
                            <div key={r} className="flex items-center gap-1">
                              {roleBadge(r)}
                              {r !== "admin" && (
                                <button
                                  onClick={() => handleRemoveRole(u.user_id, r)}
                                  disabled={actionLoading === `${u.user_id}-${r}`}
                                  className="h-4 w-4 rounded-full bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive/20 transition-colors"
                                >
                                  <X className="h-2.5 w-2.5" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Select
                          value={roleToAdd[u.user_id] || ""}
                          onValueChange={(v) => setRoleToAdd((prev) => ({ ...prev, [u.user_id]: v }))}
                        >
                          <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue placeholder="ভূমিকা যোগ" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="moderator">ম্যানেজার</SelectItem>
                            <SelectItem value="seller">বিক্রেতা</SelectItem>
                            <SelectItem value="buyer">ক্রেতা</SelectItem>
                            <SelectItem value="admin">অ্যাডমিন</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => handleAddRole(u.user_id)}
                          disabled={!roleToAdd[u.user_id] || actionLoading === u.user_id}
                        >
                          যোগ
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
