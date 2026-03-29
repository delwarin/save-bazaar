import { useState, useRef } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Camera } from "lucide-react";
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
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("ছবির সাইজ ২MB এর কম হতে হবে");
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !division) {
      toast.error("সব ফিল্ড পূরণ করুন");
      return;
    }
    if (!avatarFile) {
      toast.error("প্রোফাইল ছবি আপলোড করুন");
      return;
    }

    setLoading(true);

    const { data: signUpData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role, division },
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }

    const userId = signUpData.user?.id;
    if (userId && avatarFile) {
      const fileExt = avatarFile.name.split(".").pop();
      const filePath = `${userId}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("item-images")
        .upload(filePath, avatarFile, { upsert: true });

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from("item-images")
          .getPublicUrl(filePath);

        await supabase
          .from("profiles")
          .update({ avatar_url: urlData.publicUrl })
          .eq("user_id", userId);
      }
    }

    setLoading(false);
    toast.success("নিবন্ধন সফল হয়েছে!");
    if (role === "seller") {
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
          <h1 className="text-2xl font-bold text-foreground">নিবন্ধন করুন</h1>
          <p className="text-muted-foreground text-sm mt-1">বিনামূল্যে অ্যাকাউন্ট তৈরি করুন</p>
        </div>
        <form onSubmit={handleRegister} className="rounded-xl border bg-card p-6 space-y-4">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-2">
            <Label className="text-center">প্রোফাইল ছবি <span className="text-destructive">*</span></Label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative h-24 w-24 rounded-full border-2 border-dashed border-primary/40 hover:border-primary bg-muted flex items-center justify-center overflow-hidden transition-colors group"
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="প্রোফাইল" className="h-full w-full object-cover" />
              ) : (
                <Camera className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
              )}
              {avatarPreview && (
                <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-5 w-5 text-primary-foreground" />
                </div>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <p className="text-xs text-muted-foreground">JPG, PNG (সর্বোচ্চ ২MB)</p>
          </div>

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
