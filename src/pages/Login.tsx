import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Login = () => {
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
    // Check role to redirect
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .limit(1)
      .single();

    toast.success("লগইন সফল!");
    if (roleData?.role === "admin" || roleData?.role === "moderator") {
      navigate("/dashboard/admin");
    } else if (roleData?.role === "seller") {
      navigate("/dashboard/seller");
    } else {
      navigate("/dashboard/buyer");
    }
  };

  return (
    <Layout>
      <div className="container max-w-md py-16">
        <div className="text-center mb-8">
          <ShoppingBag className="h-12 w-12 text-primary mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-foreground">লগইন করুন</h1>
          <p className="text-muted-foreground text-sm mt-1">আপনার অ্যাকাউন্টে প্রবেশ করুন</p>
        </div>
        <form onSubmit={handleLogin} className="rounded-xl border bg-card p-6 space-y-4">
          <div className="space-y-2">
            <Label>ইমেইল</Label>
            <Input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>পাসওয়ার্ড</Label>
            <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button variant="hero" className="w-full" type="submit" disabled={loading}>
            {loading ? "অপেক্ষা করুন..." : "লগইন"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            অ্যাকাউন্ট নেই? <Link to="/register" className="text-primary font-medium hover:underline">নিবন্ধন করুন</Link>
          </p>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
