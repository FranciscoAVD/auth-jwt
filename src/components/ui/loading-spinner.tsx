import { cn } from "@/lib/utils";

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        `size-6 border-4 border-neutral-500 border-t-neutral-100 rounded-full animate-spin ${className}`,
      )}
    />
  );
}
