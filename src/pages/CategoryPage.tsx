import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import ProductCard, { ProductItem } from "@/components/ProductCard";
import { getCategoryLabel, getCategoryDescription } from "@/data/sampleData";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const divisions = ["সব বিভাগ", "ঢাকা", "চট্টগ্রাম", "রাজশাহী", "খুলনা", "বরিশাল", "সিলেট", "রংপুর", "ময়মনসিংহ"];

const CategoryPage = () => {
  const { type } = useParams<{ type: string }>();
  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  const label = type ? getCategoryLabel(type) : "সব পণ্য";
  const desc = type ? getCategoryDescription(type) : "সব ক্যাটাগরির পণ্য দেখুন";

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      let query = supabase
        .from("items")
        .select("*")
        .eq("status", "active");

      if (type) query = query.eq("category", type);

      const { data } = await query.order("created_at", { ascending: false });

      if (data) {
        // Get seller names
        const sellerIds = [...new Set(data.map((i) => i.seller_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, full_name")
          .in("user_id", sellerIds);
        const profileMap = new Map(profiles?.map((p) => [p.user_id, p.full_name]) || []);

        const mapped: ProductItem[] = data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description || "",
          price: item.price ?? 0,
          isFree: item.is_free ?? false,
          category: item.category as any,
          location: item.division,
          postedAt: new Date(item.created_at).toLocaleDateString("bn-BD"),
          expiresAt: item.expiry_date || undefined,
          image: item.image_url || "/placeholder.svg",
          images: (item as any).images || [],
          sellerName: profileMap.get(item.seller_id) || "বিক্রেতা",
        }));
        setItems(mapped);
      }
      setLoading(false);
    };
    fetchItems();
  }, [type]);

  let filtered = items;
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter((p) => p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
  }
  if (divisionFilter !== "all") {
    filtered = filtered.filter((p) => p.location === divisionFilter);
  }
  if (sortBy === "price-low") filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sortBy === "price-high") filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sortBy === "free") filtered = filtered.filter((p) => p.isFree);

  return (
    <Layout>
      <div className="bg-card border-b">
        <div className="container py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">{label}</h1>
          <p className="text-muted-foreground">{desc}</p>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="পণ্য খুঁজুন..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={divisionFilter} onValueChange={setDivisionFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="বিভাগ বাছুন" />
            </SelectTrigger>
            <SelectContent>
              {divisions.map((d) => (
                <SelectItem key={d} value={d === "সব বিভাগ" ? "all" : d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">সর্বশেষ</SelectItem>
              <SelectItem value="price-low">কম দাম</SelectItem>
              <SelectItem value="price-high">বেশি দাম</SelectItem>
              <SelectItem value="free">বিনামূল্যে</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <p className="text-center py-16 text-muted-foreground">লোড হচ্ছে...</p>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product) => (
              <ProductCard key={product.id} item={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">এই ক্যাটাগরিতে এখনো কোনো পণ্য নেই</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoryPage;
