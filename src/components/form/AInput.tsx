import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FieldValues, Control, Path } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // Ensure you have lucide-react installed

interface AInputProps<TFieldValues extends FieldValues = FieldValues> {
  control?: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  type?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
    value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AInput = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  className,
  disabled,
  required,
    value,
  onChange,
}: AInputProps<TFieldValues>) => {
  const effectiveControl = control;
  const [showPassword, setShowPassword] = useState(false);

  // Compute inputType dynamically based on state
  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type || "text";

  return (
    <FormField
      control={effectiveControl}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={label} className="text-foreground">
            {label} {required && <span className="text-destructive">*</span>}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Input
  id={label}
  type={inputType}
  placeholder={placeholder}
  className={`border-border text-foreground h-12 rounded-[8px] pr-10 bg-card ${
    className || ""
  }`}
  disabled={disabled}
  {...field}
  value={value ?? field.value ?? ""}
  onChange={(e) => {
    field.onChange(e); // react-hook-form handler
    onChange?.(e);     // optional custom handler
  }}
/>
                {type === "password" && (
                  <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={disabled}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
