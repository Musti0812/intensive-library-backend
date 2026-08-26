import { z } from "zod";

const schema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, { message: "Title is required." }),
  acronym: z.string().optional(),
  libraryItemTypeId: z
    .string()
    .min(1, { message: "You must select a library item type." }),
  categoryId: z.string().min(1, { message: "You must select a category." }),
  isBorrowable: z.boolean({ error: "Borrowable must be true or false." }),
  borrower: z.string().optional(),
  borrowDate: z.date().optional(),
  author: z.string().optional(),
  nbrPages: z
    .number({ error: "Number of pages must be a number." })
    .min(0)
    .optional(),
  runTimeMinutes: z
    .number({ error: "Runtime must be a number." })
    .min(0)
    .optional(),
});

const checkoutSchema = z.object({
  borrower: z.string().min(1, { message: "Borrower is required." }),
  dueDate: z.date({ error: "Due date must be a valid date." }),
});

type FormData = z.infer<typeof schema>;
type CheckoutFormData = z.infer<typeof checkoutSchema>;

export function validate(body: FormData) {
  return schema.safeParse(body);
}

export function validateCheckout(body: CheckoutFormData) {
  return checkoutSchema.safeParse(body);
}
