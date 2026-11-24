import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const controlBase =
  "w-full rounded-xl border bg-white text-sm text-ink placeholder:text-muted transition-all duration-200 focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:bg-ivory disabled:text-muted";

const controlTone = (invalid?: boolean) =>
  invalid
    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
    : "border-beige focus:border-burgundy/60 focus:ring-burgundy/10";

export function Field({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      <label htmlFor={htmlFor} className="field-label">
        {label}
        {required ? (
          <span className="text-burgundy" aria-hidden>
            *
          </span>
        ) : (
          <span className="font-normal normal-case tracking-normal text-muted">(optional)</span>
        )}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs leading-relaxed text-muted">{hint}</p>}
      {error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600" role="alert">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean; icon?: ReactNode };

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, icon, ...props },
  ref,
) {
  if (icon) {
    return (
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
          {icon}
        </span>
        <input
          ref={ref}
          className={cn(controlBase, controlTone(invalid), "h-12 pl-10 pr-4", className)}
          aria-invalid={invalid || undefined}
          {...props}
        />
      </div>
    );
  }
  return (
    <input
      ref={ref}
      className={cn(controlBase, controlTone(invalid), "h-12 px-4", className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }>(
  function Textarea({ className, invalid, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(controlBase, controlTone(invalid), "min-h-[120px] resize-y px-4 py-3", className)}
        aria-invalid={invalid || undefined}
        {...props}
      />
    );
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }>(
  function Select({ className, invalid, children, ...props }, ref) {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(controlBase, controlTone(invalid), "h-12 appearance-none pl-4 pr-10", className)}
          aria-invalid={invalid || undefined}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden
        />
      </div>
    );
  },
);

export const Checkbox = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { label: ReactNode; description?: string }
>(function Checkbox({ label, description, className, ...props }, ref) {
  return (
    <label className={cn("flex cursor-pointer items-start gap-3", className)}>
      <input
        ref={ref}
        type="checkbox"
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-beige text-burgundy accent-burgundy focus:ring-burgundy"
        {...props}
      />
      <span>
        <span className="text-sm text-ink">{label}</span>
        {description && <span className="mt-0.5 block text-xs leading-relaxed text-muted">{description}</span>}
      </span>
    </label>
  );
});
