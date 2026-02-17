import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext, FieldValues, Path } from "react-hook-form";

interface Option {
  value: string;
  label: string;
}

interface ASelectProps<TFieldValues extends FieldValues = FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  options: Option[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export function ASelect<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  options,
  placeholder,
  className,
  disabled,
  required,
}: ASelectProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="text-foreground">
            {label} {required && <span className="text-destructive">*</span>}
          </FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={disabled}
            >
              <SelectTrigger className="w-full border-border bg-card text-foreground !h-12">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {options.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="hover:bg-accent hover:text-accent-foreground"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
