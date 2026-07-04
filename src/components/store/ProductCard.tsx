import Link from "next/link";
import Image from "next/image";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { formatPrice, calcDiscountPercent } from "@/lib/utils/currency";
import { cn } from "@/lib/utils/cn";
import type { Product } from "@/types/product.types";

type Props = {
  product: Product & {
    images?: { url: string; is_primary: boolean }[];
    category?: { name: string; slug: string } | null;
    brand?:    { name: string } | null;
  };
  className?: string;
};

export function ProductCard({ product, className }: Props) {
  const primaryImg = product.images?.find((i) => i.is_primary)?.url
    ?? product.images?.[0]?.url;

  const discount = product.sale_price
    ? calcDiscountPercent(product.price, product.sale_price)
    : 0;

  const displayPrice = product.sale_price ?? product.price;

  return (
    <div className={cn("group relative rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5", className)}>
      {/* Image */}
      <Link href={`/produto/${product.slug}`} className="block aspect-square overflow-hidden bg-muted/30">
        {primaryImg ? (
          <Image
            src={primaryImg}
            alt={product.name}
            width={400}
            height={400}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingCart className="h-10 w-10 text-muted-foreground/30" />
          </div>
        )}
      </Link>

      {/* Badges */}
      <div className="absolute left-3 top-3 flex flex-col gap-1.5">
        {product.is_new && (
          <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wide">
            Novo
          </span>
        )}
        {discount > 0 && (
          <span className="rounded-full bg-brand-secondary px-2 py-0.5 text-[10px] font-bold text-white">
            -{discount}%
          </span>
        )}
        {product.status === "out_of_stock" && (
          <span className="rounded-full bg-gray-500 px-2 py-0.5 text-[10px] font-bold text-white">
            Esgotado
          </span>
        )}
      </div>

      {/* Wishlist button */}
      <button
        type="button"
        className="absolute right-3 top-3 rounded-full border border-border bg-background/90 p-1.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
        aria-label="Adicionar aos favoritos"
      >
        <Heart className="h-4 w-4" />
      </button>

      {/* Info */}
      <div className="p-4">
        {/* Brand */}
        {product.brand?.name && (
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
            {product.brand.name}
          </p>
        )}

        {/* Name */}
        <Link href={`/produto/${product.slug}`}>
          <h3 className="text-sm font-medium text-foreground leading-snug line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.avg_rating > 0 && (
          <div className="mt-1.5 flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-muted-foreground">
              {product.avg_rating.toFixed(1)} ({product.total_reviews})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <p className="font-heading text-lg font-bold text-brand-primary leading-none">
              {formatPrice(displayPrice)}
            </p>
            {product.sale_price && (
              <p className="text-xs text-muted-foreground line-through mt-0.5">
                {formatPrice(product.price)}
              </p>
            )}
          </div>

          {product.status !== "out_of_stock" && (
            <button
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-secondary text-white hover:bg-brand-secondary/90 transition-colors"
              aria-label="Adicionar ao carrinho"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
