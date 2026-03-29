import { useState, useRef } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, ArrowLeft, X, ImagePlus, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { searchAreas } from "@/data/bdAreas";

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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (imageFiles.length + files.length > 5) {
      toast.error("সর্বোচ্চ ৫টি ছবি আপলোড করা যাবে");
      return;
    }
    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreviews((prev) => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    if (!user || imageFiles.length === 0) return [];
    const urls: string[] = [];
    for (const file of imageFiles) {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("item-images").upload(path, file);
      if (error) {
        toast.error("ছবি আপলোড ব্যর্থ: " + error.message);
        continue;
      }
      const { data: urlData } = supabase.storage.from("item-images").getPublicUrl(path);
      urls.push(urlData.publicUrl);
    }
    return urls;
  };

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

    const uploadedUrls = await uploadImages();
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
      status: "pending",
      image_url: uploadedUrls[0] || null,
      images: uploadedUrls,
    } as any);

    setLoading(false);
    if (error) {
      toast.error("পোস্ট করতে সমস্যা হয়েছে: " + error.message);
    } else {
      toast.success("পণ্য পোস্ট হয়েছে! অ্যাডমিন অনুমোদনের পর দেখা যাবে।");
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
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>পণ্যের ছবি (সর্বোচ্চ ৫টি)</Label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {imagePreviews.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border bg-muted group">
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                      প্রধান
                    </span>
                  )}
                </div>
              ))}
              {imageFiles.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <ImagePlus className="h-6 w-6" />
                  <span className="text-[10px]">ছবি যোগ</span>
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageSelect}
            />
          </div>

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
              <Select value={division} onValueChange={(v) => { setDivision(v); setAddress(""); }}>
                <SelectTrigger><SelectValue placeholder="বিভাগ" /></SelectTrigger>
                <SelectContent>
                  {["ঢাকা", "চট্টগ্রাম", "রাজশাহী", "খুলনা", "বরিশাল", "সিলেট", "রংপুর", "ময়মনসিংহ"].map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="এলাকা খুঁজুন..."
                  className="pl-9"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  autoComplete="off"
                />
                {address.length > 0 && division && (() => {
                  const suggestions = searchAreas(division, address);
                  // Only show dropdown if there are matches and user hasn't selected an exact match
                  if (suggestions.length === 0 || (suggestions.length === 1 && suggestions[0] === address)) return null;
                  return (
                    <div className="absolute z-50 top-full mt-1 w-full max-h-48 overflow-y-auto rounded-lg border bg-popover shadow-md">
                      {suggestions.slice(0, 10).map((area) => (
                        <button
                          key={area}
                          type="button"
                          onClick={() => setAddress(area)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2"
                        >
                          <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <span>{area}</span>
                        </button>
                      ))}
                    </div>
                  );
                })()}
              </div>
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
