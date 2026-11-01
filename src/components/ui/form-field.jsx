export function FormField({ label, hint, className, children }) {
  return (
    <div className={`flex flex-col gap-1.5 mb-4 ${className || ""}`}>
      {label && <label className="text-sm font-semibold text-foreground">{label}</label>}
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

