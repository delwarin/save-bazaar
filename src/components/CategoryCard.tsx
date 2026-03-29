import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface CategoryCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  count: number;
}

const CategoryCard = ({ icon, title, description, href, count }: CategoryCardProps) => (
  <Link
    to={href}
    className="group flex flex-col rounded-xl border bg-card p-6 h-full transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
  >
    <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-card-foreground mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground mb-3 leading-relaxed flex-1">{description}</p>
    <span className="text-xs font-medium text-primary mt-auto">{count}+ পণ্য পাওয়া যাচ্ছে →</span>
  </Link>
);

export default CategoryCard;
