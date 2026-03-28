import { Link } from "react-router-dom";
import { ShoppingBag, Heart } from "lucide-react";

const Footer = () => (
  <footer className="border-t bg-card mt-auto">
    <div className="container py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-3">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-gradient-primary">সলপো</span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
            অপচয় কমান, সম্প্রদায়কে সাহায্য করুন। মেয়াদোত্তীর্ণ হওয়ার আগেই খাবার বিক্রি করুন, পুরাতন কাপড় ও বই দান করুন বা সাশ্রয়ী মূল্যে বিক্রি করুন। সলপো আপনার পাশে।
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-foreground">ক্যাটাগরি</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/category/food" className="hover:text-primary transition-colors">খাবার</Link></li>
            <li><Link to="/category/grocery" className="hover:text-primary transition-colors">মুদি দোকান</Link></li>
            <li><Link to="/category/clothes" className="hover:text-primary transition-colors">পোশাক</Link></li>
            <li><Link to="/category/books" className="hover:text-primary transition-colors">বই</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-foreground">লিংক</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary transition-colors">আমাদের সম্পর্কে</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition-colors">যোগাযোগ</Link></li>
            <li><Link to="/faq" className="hover:text-primary transition-colors">সাধারণ প্রশ্নাবলী</Link></li>
          </ul>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground flex items-center justify-center gap-1">
        <Heart className="h-3.5 w-3.5 text-destructive" />
        <span>সলপো © {new Date().getFullYear()}</span>
      </div>
    </div>
  </footer>
);

export default Footer;
