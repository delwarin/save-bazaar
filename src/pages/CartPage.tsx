import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Trash2,
  ShoppingCart,
  MapPin,
  CheckCircle,
  Package,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface CartItem {
  order_id: string;
  item_id: string;
  title: string;
  price: number;
  image_url: string | null;
  images: string[];
  division: string;
  seller_id: string;
  seller_name: string | null;
}

const CartPage = () => {
  const { user, isReady } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Checkout form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (isReady && !user) navigate("/login");
  }, [isReady, user, navigate]);

  useEffect(() => {
    if (!user) return;
    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;
    setLoading(true);

    // Get orders with status 'cart' for this buyer
    const { data: orders } = await supabase
      .from("orders")
      .select("id, item_id")
      .eq("buyer_id", user.id)
      .eq("status", "cart");

    if (!orders || orders.length === 0) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    const itemIds = orders.map((o) => o.item_id);
    const { data: items } = await supabase
      .from("items")
      .select("*")
      .in("id", itemIds);

    if (!items) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    // Get seller profiles
    const sellerIds = [...new Set(items.map((i) => i.seller_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name")
      .in("user_id", sellerIds);

    const profileMap = new Map(profiles?.map((p) => [p.user_id, p.full_name]) || []);

    const mapped: CartItem[] = items.map((item) => {
      const order = orders.find((o) => o.item_id === item.id);
      return {
        order_id: order!.id,
        item_id: item.id,
        title: item.title,
        price: item.price ?? 0,
        image_url: item.image_url,
        images: (item as any).images || [],
        division: item.division,
        seller_id: item.seller_id,
        seller_name: profileMap.get(item.seller_id) || null,
      };
    });

    setCartItems(mapped);
    setLoading(false);
  };

  const removeFromCart = async (orderId: string) => {
    // We can't DELETE due to RLS, so update status to 'cancelled'
    const { error } = await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", orderId);

    if (error) {
      toast.error("সরাতে সমস্যা হয়েছে");
    } else {
      setCartItems((prev) => prev.filter((c) => c.order_id !== orderId));
      toast.success("কার্ট থেকে সরানো হয়েছে");
    }
  };

  const totalPrice = cartItems.reduce((sum, c) => sum + c.price, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!name.trim() || !phone.trim() || !address.trim()) {
      toast.error("সব তথ্য পূরণ করুন");
      return;
    }
    setSubmitting(true);

    const orderIds = cartItems.map((c) => c.order_id);
    const message = `নাম: ${name}\nফোন: ${phone}\nঠিকানা: ${address}\nনোট: ${note}`;

    // Update all cart orders to 'pending' with buyer info
    for (const oid of orderIds) {
      await supabase
        .from("orders")
        .update({ status: "pending", message })
        .eq("id", oid);
    }

    setSubmitting(false);
    setOrderPlaced(true);
    toast.success("অর্ডার সফলভাবে সম্পন্ন হয়েছে!");
  };

  if (orderPlaced) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <div className="mx-auto h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">অর্ডার সম্পন্ন!</h2>
            <p className="text-muted-foreground">
              আপনার অর্ডার সফলভাবে জমা হয়েছে। বিক্রেতা শীঘ্রই আপনার সাথে যোগাযোগ করবেন।
            </p>
            <div className="flex gap-3 justify-center pt-4">
              <Link to="/">
                <Button variant="outline">হোমে ফিরুন</Button>
              </Link>
              <Link to="/dashboard/buyer">
                <Button variant="hero">ড্যাশবোর্ড দেখুন</Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-card border-b">
        <div className="container py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => (checkoutMode ? setCheckoutMode(false) : navigate(-1))}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold text-foreground">
            {checkoutMode ? "চেকআউট" : "আমার কার্ট"}
          </h1>
        </div>
      </div>

      <div className="container py-8">
        {loading ? (
          <p className="text-muted-foreground text-center py-12">লোড হচ্ছে...</p>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-4">আপনার কার্ট খালি</p>
            <Link to="/">
              <Button variant="hero">পণ্য দেখুন</Button>
            </Link>
          </div>
        ) : checkoutMode ? (
          /* Checkout Form */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <form onSubmit={handleCheckout} className="lg:col-span-2 space-y-5">
              <div className="rounded-xl border bg-card p-6 space-y-4">
                <h2 className="text-lg font-bold text-foreground">ডেলিভারি তথ্য</h2>
                <div className="space-y-2">
                  <Label>আপনার নাম</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="পুরো নাম" required maxLength={100} />
                </div>
                <div className="space-y-2">
                  <Label>ফোন নম্বর</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX" required maxLength={15} />
                </div>
                <div className="space-y-2">
                  <Label>ডেলিভারি ঠিকানা</Label>
                  <Textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="পুরো ঠিকানা লিখুন" rows={3} required maxLength={300} />
                </div>
                <div className="space-y-2">
                  <Label>নোট (ঐচ্ছিক)</Label>
                  <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="বিশেষ কোনো নির্দেশনা" maxLength={200} />
                </div>
                <Button variant="hero" className="w-full" size="lg" type="submit" disabled={submitting}>
                  {submitting ? "অর্ডার হচ্ছে..." : `অর্ডার নিশ্চিত করুন — ৳${totalPrice}`}
                </Button>
              </div>
            </form>

            {/* Order Summary Sidebar */}
            <div className="rounded-xl border bg-card p-5 h-fit space-y-4">
              <h3 className="font-bold text-foreground">অর্ডার সারাংশ</h3>
              {cartItems.map((c) => (
                <div key={c.order_id} className="flex items-center gap-3 py-2 border-b last:border-0">
                  <img
                    src={c.images[0] || c.image_url || "/placeholder.svg"}
                    alt={c.title}
                    className="h-12 w-12 rounded-lg object-cover bg-muted flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-1">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.seller_name || "বিক্রেতা"}</p>
                  </div>
                  <span className="text-sm font-bold text-primary whitespace-nowrap">৳{c.price}</span>
                </div>
              ))}
              <div className="pt-3 border-t flex justify-between font-bold text-foreground">
                <span>মোট</span>
                <span className="text-primary">৳{totalPrice}</span>
              </div>
            </div>
          </div>
        ) : (
          /* Cart List */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-3">
              {cartItems.map((c) => (
                <div key={c.order_id} className="rounded-xl border bg-card p-4 flex items-center gap-4">
                  <Link to={`/product/${c.item_id}`} className="flex-shrink-0">
                    <img
                      src={c.images[0] || c.image_url || "/placeholder.svg"}
                      alt={c.title}
                      className="h-20 w-20 rounded-lg object-cover bg-muted"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${c.item_id}`}>
                      <h3 className="font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors">
                        {c.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" /> {c.division}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      বিক্রেতা: {c.seller_name || "—"}
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <span className="text-lg font-bold text-primary">৳{c.price}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => removeFromCart(c.order_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="rounded-xl border bg-card p-5 h-fit space-y-4">
              <h3 className="font-bold text-foreground">কার্ট সারাংশ</h3>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>পণ্য ({cartItems.length}টি)</span>
                <span>৳{totalPrice}</span>
              </div>
              <div className="pt-3 border-t flex justify-between font-bold text-foreground text-lg">
                <span>মোট</span>
                <span className="text-primary">৳{totalPrice}</span>
              </div>
              <Button
                variant="hero"
                className="w-full"
                size="lg"
                onClick={() => setCheckoutMode(true)}
              >
                চেকআউট করুন
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
