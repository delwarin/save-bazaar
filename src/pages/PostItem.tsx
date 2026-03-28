import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const PostItem = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [division, setDivision] = useState("");
  const [address, setAddress] = useState("");
  const [isFree, setIsFree] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("আগে লগইন করুন");
      return;
    }
    if (!category || !division) {
      toast.error("সব ফিল্ড পূরণ করুন");
      return;
    }
    setLoading(true);
    const priceNum = parseFloat(price) || 0;
    const { error } = await supabase.from("items").insert({
      title,
      description,
      category,
      price: priceNum,
      is_free: priceNum === 0,
      expiry_date: expiryDate || null,
      division,
      address,
      seller_id: user.id,
      status: "active",
    });
    setLoading(false);
    if (error) {
      toast.error("পোস্ট করতে সমস্যা হয়েছে: " + error.message);
    } else {
      toast.success("পণ্য সফলভাবে পোস্ট হয়েছে!");
      navigate("/dashboard/seller");
    }
  };

  return (
    <Layout>
      <div className="bg-card border-b">
        <div className="container py-6 flex items-center gap-3">
          <Link to="/dashboard/seller">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-foreground">নতুন পণ্য পোস্ট করুন</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="container max-w-2xl py-8">
        <div className="rounded-xl border bg-card p-6 space-y-5">
          <div className="space-y-2">
            <Label>পণ্যের নাম</Label>
            <Input placeholder="যেমন: বিরিয়ানি - ৫ প্যাক" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label>বিবরণ</Label>
            <Textarea placeholder="পণ্যের বিস্তারিত বিবরণ লিখুন..." rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>ক্যাটাগরি</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="ক্যাটাগরি বাছুন" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">খাবার</SelectItem>
                  <SelectItem value="grocery">মুদি</SelectItem>
                  <SelectItem value="clothes">পোশাক</SelectItem>
                  <SelectItem value="books">বই</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>মূল্য (৳)</Label>
              <Input type="number" placeholder="০ = বিনামূল্যে" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>মেয়াদ শেষ (খাবার/মুদি)</Label>
            <Input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>অবস্থান</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select value={division} onValueChange={setDivision}>
                <SelectTrigger><SelectValue placeholder="বিভাগ" /></SelectTrigger>
                <SelectContent>
                  {["ঢাকা", "চট্টগ্রাম", "রাজশাহী", "খুলনা", "বরিশাল", "সিলেট", "রংপুর", "ময়মনসিংহ"].map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input placeholder="এলাকা (যেমন: গুলশান)" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
          </div>

          <Button variant="hero" className="w-full" size="lg" type="submit" disabled={loading}>
            {loading ? "পোস্ট হচ্ছে..." : "পোস্ট করুন"}
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default PostItem;
