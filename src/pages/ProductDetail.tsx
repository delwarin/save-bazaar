import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  MapPin,
  Clock,
  ShoppingCart,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [item, setItem] = useState<Tables<"items"> | null>(null);
  const [seller, setSeller] = useState<Tables<"profiles"> | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [booked, setBooked] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      const { data } = await supabase.from("items").select("*").eq("id", id).single();
      if (data) {
        setItem(data);
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", data.seller_id)
          .single();
        setSeller(profile);
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  const images: string[] =
    item && (item as any).images && (item as any).images.length > 0
      ? (item as any).images
      : item?.image_url
        ? [item.image_url]
        : ["/placeholder.svg"];

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !item) {
      toast.error("আগে লগইন করুন");
      return;
    }
    if (!bookingName.trim() || !bookingPhone.trim()) {
      toast.error("নাম ও ফোন নম্বর দিন");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("orders").insert({
      item_id: item.id,
      buyer_id: user.id,
      status: "pending",
      message: `নাম: ${bookingName}\nফোন: ${bookingPhone}\nবার্তা: ${bookingMessage}`,
    });
    setSubmitting(false);
    if (error) {
      toast.error("বুকিং ব্যর্থ: " + error.message);
    } else {
      setBooked(true);
      setBookingOpen(false);
      toast.success("বুকিং সফল! বিক্রেতা শীঘ্রই যোগাযোগ করবেন।");
    }
  };

  const handleAddToCart = async () => {
    if (!user || !item) {
      toast.error("আগে লগইন করুন");
      return;
    }
    const { error } = await supabase.from("orders").insert({
      item_id: item.id,
      buyer_id: user.id,
      status: "cart",
      message: null,
    });
    if (error) {
      if (error.message.includes("duplicate")) {
        toast.info("এই পণ্যটি আগেই কার্টে আছে");
      } else {
        toast.error("কার্টে যোগ ব্যর্থ: " + error.message);
      }
    } else {
      setCartAdded(true);
      toast.success("কার্টে যোগ হয়েছে!");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-16 text-center text-muted-foreground">লোড হচ্ছে...</div>
      </Layout>
    );
  }

  if (!item) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <p className="text-muted-foreground mb-4">পণ্যটি পাওয়া যায়নি</p>
          <Link to="/">
            <Button variant="outline">হোমে ফিরুন</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const isFree = item.is_free || (item.price ?? 0) === 0;

  return (
    <Layout>
      {/* Top bar */}
      <div className="bg-card border-b">
        <div className="container py-4 flex items-center gap-3">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold text-foreground line-clamp-1">{item.title}</h1>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="aspect-square rounded-xl overflow-hidden bg-muted relative group">
              <img
                src={images[currentImg]}
                alt={item.title}
                className="h-full w-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImg((i) => (i === 0 ? images.length - 1 : i - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/80 text-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImg((i) => (i === images.length - 1 ? 0 : i + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/80 text-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
              {isFree && (
                <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground text-sm">
                  বিনামূল্যে
                </Badge>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImg(i)}
                    className={`h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === currentImg ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">{item.title}</h2>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {item.division}{item.address ? `, ${item.address}` : ""}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {new Date(item.created_at).toLocaleDateString("bn-BD")}
                </span>
                {item.expiry_date && (
                  <span className="flex items-center gap-1 text-destructive">
                    <CalendarClock className="h-4 w-4" />
                    মেয়াদ: {new Date(item.expiry_date).toLocaleDateString("bn-BD")}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="mb-4">
                {isFree ? (
                  <span className="text-3xl font-bold text-primary">বিনামূল্যে</span>
                ) : (
                  <span className="text-3xl font-bold text-primary">৳{item.price}</span>
                )}
              </div>

              {item.description && (
                <div className="rounded-lg border bg-muted/50 p-4">
                  <h3 className="font-semibold text-foreground mb-2">বিবরণ</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{item.description}</p>
                </div>
              )}
            </div>

            {/* Seller Info */}
            {seller && (
              <div className="rounded-lg border bg-card p-4 flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{seller.full_name || "বিক্রেতা"}</p>
                  <p className="text-sm text-muted-foreground">{seller.division || item.division}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              {isFree ? (
                // Free item → Booking form
                booked ? (
                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">বুকিং সফল!</p>
                      <p className="text-sm text-muted-foreground">বিক্রেতা শীঘ্রই আপনার সাথে যোগাযোগ করবেন।</p>
                    </div>
                  </div>
                ) : (
                  <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
                    <DialogTrigger asChild>
                      <Button variant="hero" size="lg" className="w-full gap-2 text-base">
                        <MessageSquare className="h-5 w-5" />
                        বুকিং করুন (বিনামূল্যে)
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>বুকিং ফর্ম</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleBooking} className="space-y-4 pt-2">
                        <p className="text-sm text-muted-foreground">
                          ফর্ম পূরণ করুন, বিক্রেতা আপনার সাথে যোগাযোগ করবেন।
                        </p>
                        <div className="space-y-2">
                          <Label>আপনার নাম</Label>
                          <Input
                            value={bookingName}
                            onChange={(e) => setBookingName(e.target.value)}
                            placeholder="পুরো নাম"
                            required
                            maxLength={100}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>ফোন নম্বর</Label>
                          <Input
                            value={bookingPhone}
                            onChange={(e) => setBookingPhone(e.target.value)}
                            placeholder="01XXXXXXXXX"
                            required
                            maxLength={15}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>বার্তা (ঐচ্ছিক)</Label>
                          <Textarea
                            value={bookingMessage}
                            onChange={(e) => setBookingMessage(e.target.value)}
                            placeholder="বিক্রেতাকে কিছু জানাতে চাইলে লিখুন..."
                            rows={3}
                            maxLength={500}
                          />
                        </div>
                        <Button variant="hero" className="w-full" type="submit" disabled={submitting}>
                          {submitting ? "জমা হচ্ছে..." : "বুকিং জমা দিন"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                )
              ) : (
                // Paid item → Add to Cart
                cartAdded ? (
                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">কার্টে যোগ হয়েছে!</p>
                      <p className="text-sm text-muted-foreground">
                        <Link to="/dashboard/buyer" className="text-primary underline">
                          ড্যাশবোর্ডে দেখুন
                        </Link>
                      </p>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full gap-2 text-base"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    কার্টে যোগ করুন — ৳{item.price}
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
