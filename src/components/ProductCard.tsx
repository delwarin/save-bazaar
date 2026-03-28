import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock } from "lucide-react";

export interface ProductItem {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  isFree: boolean;
  category: "food" | "grocery" | "clothes" | "books";
  location: string;
  postedAt: string;
  expiresAt?: string;
  image: string;
  sellerName: string;
}

const ProductCard = ({ item }: { item: ProductItem }) => (
  <Link
    to={`/product/${item.id}`}
    className="group block rounded-xl border bg-card overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
  >
    <div className="aspect-[4/3] overflow-hidden bg-muted relative">
      <img
        src={item.image}
        alt={item.title}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      {item.isFree ? (
        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">বিনামূল্যে</Badge>
      ) : item.originalPrice && item.originalPrice > item.price ? (
        <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
          {Math.round((1 - item.price / item.originalPrice) * 100)}% ছাড়
        </Badge>
      ) : null}
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-card-foreground line-clamp-1 mb-1">{item.title}</h3>
      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
      
      <div className="flex items-center justify-between">
        <div>
          {item.isFree ? (
            <span className="text-lg font-bold text-primary">বিনামূল্যে</span>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">৳{item.price}</span>
              {item.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">৳{item.originalPrice}</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {item.location}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {item.postedAt}
        </span>
      </div>
    </div>
  </Link>
);

export default ProductCard;
