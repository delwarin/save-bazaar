import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [division, setDivision] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !division) {
      toast.error("সব ফিল্ড পূরণ করুন");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role, division },
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("নিবন্ধন সফল হয়েছে!");
      if (role === "seller") {
        navigate("/dashboard/seller");
      } else {
        navigate("/dashboard/buyer");
      }
    }
  };

  return (
    <Layout>
      <div className="container max-w-md py-16">
        <div className="text-center mb-8">
          <ShoppingBag className="h-12 w-12 text-primary mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-foreground">নিবন্ধন করুন</h1>
          <p className="text-muted-foreground text-sm mt-1">বিনামূল্যে অ্যাকাউন্ট তৈরি করুন</p>
        </div>
        <form onSubmit={handleRegister} className="rounded-xl border bg-card p-6 space-y-4">
          <div className="space-y-2">
            <Label>পুরো নাম</Label>
            <Input placeholder="আপনার নাম" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>ইমেইল</Label>
            <Input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>পাসওয়ার্ড</Label>
            <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <div className="space-y-2">
            <Label>আপনি কে?</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger><SelectValue placeholder="ভূমিকা বাছুন" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="buyer">ক্রেতা (কিনতে / নিতে চাই)</SelectItem>
                <SelectItem value="seller">বিক্রেতা (রেস্টুরেন্ট / দোকান / ব্যক্তিগত)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>বিভাগ</Label>
            <Select value={division} onValueChange={setDivision}>
              <SelectTrigger><SelectValue placeholder="আপনার বিভাগ" /></SelectTrigger>
              <SelectContent>
                {["ঢাকা", "চট্টগ্রাম", "রাজশাহী", "খুলনা", "বরিশাল", "সিলেট", "রংপুর", "ময়মনসিংহ"].map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="hero" className="w-full" type="submit" disabled={loading}>
            {loading ? "অপেক্ষা করুন..." : "নিবন্ধন করুন"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            ইতিমধ্যে অ্যাকাউন্ট আছে? <Link to="/login" className="text-primary font-medium hover:underline">লগইন করুন</Link>
          </p>
        </form>
      </div>
    </Layout>
  );
};

export default Register;
