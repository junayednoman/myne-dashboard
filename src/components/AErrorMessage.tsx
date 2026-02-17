import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorComponentProps {
  error: any;
  onRetry: () => void;
  className?: string;
}

export default function AErrorMessage({
  error,
  onRetry,
  className = "!bg-transparent",
}: ErrorComponentProps) {
  const message =
    (error as any)?.data?.message ||
    (error as any)?.error ||
    "Something went wrong. Please try again.";
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 !bg-background rounded-lg min-w-full ${className}`}
      style={{ backgroundColor: "#1a1a1a" }}
    >
      {/* Error Icon */}
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />

      {/* Error Message */}
      <p className="text-center text-foreground mb-4">{message}</p>

      {/* Retry Button */}
      <Button
        onClick={onRetry}
        className="bg-primary hover:bg-primary/90 text-background rounded-lg"
      >
        Retry
      </Button>
    </div>
  );
}
