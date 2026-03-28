import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    // Verify admin role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .eq("role", "admin")
      .limit(1)
      .single();

    if (roleData) {
      toast.success("অ্যাডমিন লগইন সফল!");
      navigate("/dashboard/admin");
    } else {
      await supabase.auth.signOut();
      toast.error("আপনি অ্যাডমিন নন!");
    }
  };

  return (
    <Layout>
      <div className="container max-w-md py-16">
        <div className="text-center mb-8">
          <Shield className="h-12 w-12 text-primary mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-foreground">অ্যাডমিন লগইন</h1>
          <p className="text-muted-foreground text-sm mt-1">অ্যাডমিন প্যানেলে প্রবেশ করুন</p>
        </div>
        <form onSubmit={handleLogin} className="rounded-xl border bg-card p-6 space-y-4">
          <div className="space-y-2">
            <Label>ইমেইল</Label>
            <Input type="email" placeholder="admin@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>পাসওয়ার্ড</Label>
            <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button variant="hero" className="w-full" type="submit" disabled={loading}>
            {loading ? "অপেক্ষা করুন..." : "অ্যাডমিন লগইন"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            অ্যাডমিন অ্যাকাউন্ট নেই? <Link to="/admin/register" className="text-primary font-medium hover:underline">নিবন্ধন করুন</Link>
          </p>
        </form>
      </div>
    </Layout>
  );
};

export default AdminLogin;
