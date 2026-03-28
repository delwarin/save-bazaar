import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { sampleProducts, getCategoryLabel, getCategoryDescription } from "@/data/sampleData";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

const divisions = ["সব বিভাগ", "ঢাকা", "চট্টগ্রাম", "রাজশাহী", "খুলনা", "বরিশাল", "সিলেট", "রংপুর", "ময়মনসিংহ"];

const CategoryPage = () => {
  const { type } = useParams<{ type: string }>();
  const filtered = type ? sampleProducts.filter((p) => p.category === type) : sampleProducts;
  const label = type ? getCategoryLabel(type) : "সব পণ্য";
  const desc = type ? getCategoryDescription(type) : "সব ক্যাটাগরির পণ্য দেখুন";

  return (
    <Layout>
      <div className="bg-card border-b">
        <div className="container py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">{label}</h1>
          <p className="text-muted-foreground">{desc}</p>
        </div>
      </div>

      <div className="container py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="পণ্য খুঁজুন..." className="pl-9" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="বিভাগ বাছুন" />
            </SelectTrigger>
            <SelectContent>
              {divisions.map((d) => (
                <SelectItem key={d} value={d === "সব বিভাগ" ? "all" : d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select defaultValue="latest">
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

        {filtered.length > 0 ? (
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
