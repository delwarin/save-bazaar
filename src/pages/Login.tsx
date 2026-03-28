import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

const Login = () => (
  <Layout>
    <div className="container max-w-md py-16">
      <div className="text-center mb-8">
        <ShoppingBag className="h-12 w-12 text-primary mx-auto mb-3" />
        <h1 className="text-2xl font-bold text-foreground">লগইন করুন</h1>
        <p className="text-muted-foreground text-sm mt-1">আপনার অ্যাকাউন্টে প্রবেশ করুন</p>
      </div>
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="space-y-2">
          <Label>ইমেইল</Label>
          <Input type="email" placeholder="your@email.com" />
        </div>
        <div className="space-y-2">
          <Label>পাসওয়ার্ড</Label>
          <Input type="password" placeholder="••••••••" />
        </div>
        <Button variant="hero" className="w-full">লগইন</Button>
        <p className="text-center text-sm text-muted-foreground">
          অ্যাকাউন্ট নেই? <Link to="/register" className="text-primary font-medium hover:underline">নিবন্ধন করুন</Link>
        </p>
      </div>
    </div>
  </Layout>
);

export default Login;
