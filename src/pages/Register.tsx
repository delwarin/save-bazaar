import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

const Register = () => (
  <Layout>
    <div className="container max-w-md py-16">
      <div className="text-center mb-8">
        <ShoppingBag className="h-12 w-12 text-primary mx-auto mb-3" />
        <h1 className="text-2xl font-bold text-foreground">নিবন্ধন করুন</h1>
        <p className="text-muted-foreground text-sm mt-1">বিনামূল্যে অ্যাকাউন্ট তৈরি করুন</p>
      </div>
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="space-y-2">
          <Label>পুরো নাম</Label>
          <Input placeholder="আপনার নাম" />
        </div>
        <div className="space-y-2">
          <Label>ইমেইল</Label>
          <Input type="email" placeholder="your@email.com" />
        </div>
        <div className="space-y-2">
          <Label>পাসওয়ার্ড</Label>
          <Input type="password" placeholder="••••••••" />
        </div>
        <div className="space-y-2">
          <Label>আপনি কে?</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="ভূমিকা বাছুন" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="buyer">ক্রেতা (কিনতে / নিতে চাই)</SelectItem>
              <SelectItem value="seller">বিক্রেতা (রেস্টুরেন্ট / দোকান / ব্যক্তিগত)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>বিভাগ</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="আপনার বিভাগ" />
            </SelectTrigger>
            <SelectContent>
              {["ঢাকা", "চট্টগ্রাম", "রাজশাহী", "খুলনা", "বরিশাল", "সিলেট", "রংপুর", "ময়মনসিংহ"].map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="hero" className="w-full">নিবন্ধন করুন</Button>
        <p className="text-center text-sm text-muted-foreground">
          ইতিমধ্যে অ্যাকাউন্ট আছে? <Link to="/login" className="text-primary font-medium hover:underline">লগইন করুন</Link>
        </p>
      </div>
    </div>
  </Layout>
);

export default Register;
