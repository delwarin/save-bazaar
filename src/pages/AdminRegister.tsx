import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secretCode, setSecretCode] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedSecret = secretCode.trim();
    if (!normalizedSecret) {
      toast.error("সিক্রেট কোড দিন");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: { full_name: fullName.trim(), role: "admin", division: "ঢাকা" },
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      const userId = data.user?.id;
      if (!userId) {
        toast.error("রেজিস্ট্রেশন সম্পন্ন হয়নি, আবার চেষ্টা করুন");
        return;
      }

      const { data: result, error: rpcError } = await supabase.rpc("register_admin", {
        _user_id: userId,
        _secret: normalizedSecret,
      });

      if (rpcError) {
        console.error("register_admin error:", rpcError);
        toast.error("সার্ভার সমস্যা হয়েছে, আবার চেষ্টা করুন");
        return;
      }

      if (result === true) {
        toast.success("অ্যাডমিন নিবন্ধন সফল!");
        navigate("/dashboard/admin");
        return;
      }

      toast.error("সিক্রেট কোড ভুল!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-md py-16">
        <div className="text-center mb-8">
          <Shield className="h-12 w-12 text-primary mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-foreground">অ্যাডমিন নিবন্ধন</h1>
          <p className="text-muted-foreground text-sm mt-1">অ্যাডমিন অ্যাকাউন্ট তৈরি করতে সিক্রেট কোড প্রয়োজন</p>
        </div>
        <form onSubmit={handleRegister} className="rounded-xl border bg-card p-6 space-y-4">
          <div className="space-y-2">
            <Label>পুরো নাম</Label>
            <Input placeholder="আপনার নাম" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>ইমেইল</Label>
            <Input type="email" placeholder="admin@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>পাসওয়ার্ড</Label>
            <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <div className="space-y-2">
            <Label>সিক্রেট কোড</Label>
            <Input type="password" placeholder="অ্যাডমিন সিক্রেট কোড" value={secretCode} onChange={(e) => setSecretCode(e.target.value)} required />
          </div>
          <Button variant="hero" className="w-full" type="submit" disabled={loading}>
            {loading ? "অপেক্ষা করুন..." : "অ্যাডমিন নিবন্ধন"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            সাধারণ অ্যাকাউন্ট? <Link to="/register" className="text-primary font-medium hover:underline">নিবন্ধন করুন</Link>
          </p>
        </form>
      </div>
    </Layout>
  );
};

export default AdminRegister;
