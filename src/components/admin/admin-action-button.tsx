import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AdminActionButtonProps = React.ComponentProps<typeof Button>;

export default function AdminActionButton({
  className,
  children,
  ...props
}: AdminActionButtonProps) {
  return (
    <Button
      className={cn(
        "h-10 w-full rounded-md border border-white bg-white px-5 text-black hover:bg-white/90 sm:w-auto",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
