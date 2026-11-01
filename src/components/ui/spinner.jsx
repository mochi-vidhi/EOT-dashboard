import { cn } from "../../lib/utils";

export function Spinner({ className, size = 16 }) {
  return (
    <span
      className={cn("inline-block rounded-full border-2 border-current/30 border-t-current animate-spin", className)}
      style={{ width: size, height: size }}
    />
  );
}

