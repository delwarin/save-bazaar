import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Navigate } from "react-router-dom";
import { Shield, Users, Package, ShoppingBag } from "lucide-react";

const AdminDashboard = () => {
  const { user, isReady, role } = useAuth();
  const [stats, setStats] = useState({ users: 0, items: 0, orders: 0 });

  useEffect(() => {
    if (!user || role !== "admin") return;
    // Fetch counts
    Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("items").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("id", { count: "exact", head: true }),
    ]).then(([profiles, items, orders]) => {
      setStats({
        users: profiles.count ?? 0,
        items: items.count ?? 0,
        orders: orders.count ?? 0,
      });
    });
  }, [user, role]);

  if (!isReady) return <Layout><div className="container py-16 text-center text-muted-foreground">লোড হচ্ছে...</div></Layout>;
  if (!user) return <Navigate to="/login" />;
  if (role !== "admin") return <Navigate to="/" />;

  const statCards = [
    { label: "মোট ব্যবহারকারী", value: stats.users, icon: <Users className="h-5 w-5" /> },
    { label: "মোট পণ্য", value: stats.items, icon: <Package className="h-5 w-5" /> },
    { label: "মোট অর্ডার", value: stats.orders, icon: <ShoppingBag className="h-5 w-5" /> },
  ];

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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {statCards.map((s, i) => (
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

        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">অ্যাডমিন তথ্য</h2>
          <p className="text-sm text-muted-foreground">
            প্রথম নিবন্ধিত ব্যবহারকারী স্বয়ংক্রিয়ভাবে অ্যাডমিন হিসেবে নির্ধারিত হয়।
            আপনি এখান থেকে প্ল্যাটফর্মের সকল কার্যক্রম পরিচালনা করতে পারবেন।
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
