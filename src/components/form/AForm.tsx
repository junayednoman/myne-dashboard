import {
  useForm,
  FormProvider,
  FieldValues,
  SubmitHandler,
  DefaultValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import React from "react";

interface AFormProps<T extends FieldValues> {
  schema: z.ZodTypeAny;
  defaultValues?: DefaultValues<T> | Promise<DefaultValues<T>> | undefined;
  onSubmit: SubmitHandler<T>;
  children: React.ReactNode;
  className?: string;
}

const AForm = <T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
  className,
}: AFormProps<T>) => {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T> | undefined,
  });

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={`space-y-6 ${className || ""}`}
        >
          {children}
        </form>
      </Form>
    </FormProvider>
  );
};

export default AForm;
