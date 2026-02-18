import { Input } from "@/components/ui/input";

type AdminTextInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export default function AdminTextInput({
  label,
  value,
  onChange,
  placeholder,
  className,
}: AdminTextInputProps) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm text-card-foreground">{label}</label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 border-border bg-background"
      />
    </div>
  );
}
