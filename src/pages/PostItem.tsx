import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PostItem = () => (
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

    <div className="container max-w-2xl py-8">
      <div className="rounded-xl border bg-card p-6 space-y-5">
        <div className="space-y-2">
          <Label>পণ্যের নাম</Label>
          <Input placeholder="যেমন: বিরিয়ানি - ৫ প্যাক" />
        </div>

        <div className="space-y-2">
          <Label>বিবরণ</Label>
          <Textarea placeholder="পণ্যের বিস্তারিত বিবরণ লিখুন..." rows={4} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>ক্যাটাগরি</Label>
            <Select>
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
            <Input type="number" placeholder="০ = বিনামূল্যে" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>আসল মূল্য (৳) - ঐচ্ছিক</Label>
            <Input type="number" placeholder="আসল মূল্য" />
          </div>
          <div className="space-y-2">
            <Label>মেয়াদ শেষ (খাবার/মুদি)</Label>
            <Input type="date" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>অবস্থান</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select>
              <SelectTrigger><SelectValue placeholder="বিভাগ" /></SelectTrigger>
              <SelectContent>
                {["ঢাকা", "চট্টগ্রাম", "রাজশাহী", "খুলনা", "বরিশাল", "সিলেট", "রংপুর", "ময়মনসিংহ"].map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input placeholder="এলাকা (যেমন: গুলশান)" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>ছবি আপলোড</Label>
          <div className="border-2 border-dashed rounded-xl p-8 text-center bg-muted/50 cursor-pointer hover:bg-muted transition-colors">
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">ক্লিক করুন বা ড্র্যাগ করুন</p>
            <p className="text-xs text-muted-foreground mt-1">JPG, PNG — সর্বোচ্চ ৫MB</p>
          </div>
        </div>

        <Button variant="hero" className="w-full" size="lg">পোস্ট করুন</Button>
      </div>
    </div>
  </Layout>
);

export default PostItem;
