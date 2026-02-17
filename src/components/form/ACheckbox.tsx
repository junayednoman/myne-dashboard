import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Control, FieldValues, Path } from "react-hook-form";

interface ACheckboxProps<TFieldValues extends FieldValues = FieldValues> {
  control?: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  disabled?: boolean;
}

export const ACheckbox = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  disabled = false,
}: ACheckboxProps<TFieldValues>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-y-0">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="text-card-foreground font-normal cursor-pointer">
              {label}
            </FormLabel>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
