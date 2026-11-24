import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "light" | "outlineLight";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-burgundy text-white shadow-soft hover:bg-burgundy-deep hover:shadow-lift active:translate-y-px",
  secondary:
    "border border-burgundy/25 bg-white text-burgundy hover:border-burgundy/60 hover:bg-burgundy-50",
  ghost: "text-burgundy hover:bg-burgundy-50",
  light: "bg-white text-burgundy shadow-soft hover:bg-ivory",
  outlineLight:
    "border border-white/35 bg-transparent text-white hover:border-white/70 hover:bg-white/10",
};

const sizes: Record<Size, string> = {
  sm: "h-9 gap-1.5 px-4 text-[13px]",
  md: "h-11 gap-2 px-6 text-sm",
  lg: "h-[52px] gap-2.5 px-7 text-[14px]",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}) {
  return cn(
    "group inline-flex select-none items-center justify-center rounded-full font-medium transition-all duration-300 ease-luxe disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
}

type CommonProps = {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  iconRight?: ReactNode;
  iconLeft?: ReactNode;
  children: ReactNode;
  className?: string;
};

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading, iconRight, iconLeft, children, className, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={buttonStyles({ variant, size, className })}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : iconLeft}
      <span>{children}</span>
      {!loading && iconRight}
    </button>
  );
});

type LinkButtonProps = CommonProps & {
  to: string;
  external?: boolean;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">;

export function ButtonLink({
  to,
  external,
  variant = "primary",
  size = "md",
  iconRight,
  iconLeft,
  children,
  className,
  ...rest
}: LinkButtonProps) {
  const classes = buttonStyles({ variant, size, className });
  const isExternal = external || /^(https?:|mailto:|tel:)/.test(to);

  if (isExternal) {
    return (
      <a
        href={to}
        className={classes}
        target={to.startsWith("http") ? "_blank" : undefined}
        rel={to.startsWith("http") ? "noreferrer noopener" : undefined}
        {...rest}
      >
        {iconLeft}
        <span>{children}</span>
        {iconRight}
      </a>
    );
  }

  return (
    <Link to={to} className={classes} {...rest}>
      {iconLeft}
      <span>{children}</span>
      {iconRight}
    </Link>
  );
}

export function ArrowButton({ to, children }: { to: string; children: ReactNode }) {
  return (
    <ButtonLink to={to} variant="secondary" iconRight={<ArrowRight className="h-4 w-4" />}>
      {children}
    </ButtonLink>
  );
}
