import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PriceTagProps {
  price: number;
  className?: string;
}

export function PriceTag({ price, className }: PriceTagProps) {
  return (
    <div
      className={cn(
        "rounded-lg bg-background/80 px-3 py-1.5 backdrop-blur-sm shadow-sm",
        className
      )}
    >
      <p className="text-sm font-bold text-foreground leading-tight">
        {formatPrice(price)}
      </p>
      <p className="text-[10px] text-muted-foreground leading-tight">per person</p>
    </div>
  );
}
