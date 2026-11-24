import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Field, Input, Select, Textarea, Checkbox } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { api, apiError } from "@/lib/api";
import { site } from "@/config/site";

const subjects = [
  "General enquiry",
  "Appointment question",
  "Treatment question",
  "Fees and insurance",
  "Feedback",
  "Something else",
];

const schema = z.object({
  name: z.string().trim().min(2, "Please tell us your name.").max(80, "That name is a little long."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .max(24, "That phone number is too long.")
    .refine((value) => !value || /^[+()\d\s-]{7,}$/.test(value), "Enter a valid phone number or leave it blank."),
  subject: z.string().min(2, "Choose a subject."),
  message: z
    .string()
    .trim()
    .min(10, "Please add a little more detail (at least 10 characters).")
    .max(2000, "Please keep your message under 2,000 characters."),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please confirm we may reply to your enquiry." }),
  }),
  website: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const { toast } = useToast();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "General enquiry",
      message: "",
      website: "",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      const { data } = await api.post<{ message: string }>("/contact", values);
      setSent(true);
      reset({ ...values, message: "", website: "" });
      toast({
        title: "Message sent",
        description: data.message ?? "We aim to reply within one working day.",
        variant: "success",
      });
    } catch (error) {
      toast({ title: "Message not sent", description: apiError(error), variant: "error" });
    }
  }

  if (sent) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-7 text-center sm:p-9">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white text-emerald-600 shadow-soft">
          <CheckCircle2 className="h-6 w-6" aria-hidden />
        </span>
        <h3 className="mt-4 font-display text-2xl text-ink">Thank you — your message is with us.</h3>
        <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-muted">
          A member of the team will reply within one working day. For anything urgent, please call the clinic rather
          than waiting for an email.
        </p>
        <a
          href={site.contact.phoneHref}
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-burgundy"
        >
          {site.contact.phone}
        </a>
        <div className="mt-6 flex justify-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setSent(false)}>
            Send another message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" htmlFor="contact-name" required error={errors.name?.message}>
          <Input
            id="contact-name"
            autoComplete="name"
            placeholder="Alex Morgan"
            invalid={Boolean(errors.name)}
            {...register("name")}
          />
        </Field>
        <Field label="Email address" htmlFor="contact-email" required error={errors.email?.message}>
          <Input
            id="contact-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            invalid={Boolean(errors.email)}
            {...register("email")}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Telephone"
          htmlFor="contact-phone"
          error={errors.phone?.message}
          hint="Only if you would prefer a call back."
        >
          <Input
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            placeholder="+44 7700 900123"
            invalid={Boolean(errors.phone)}
            {...register("phone")}
          />
        </Field>
        <Field label="Subject" htmlFor="contact-subject" required error={errors.subject?.message}>
          <Select id="contact-subject" invalid={Boolean(errors.subject)} {...register("subject")}>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field
        label="Your message"
        htmlFor="contact-message"
        required
        error={errors.message?.message}
        hint="Please avoid sharing sensitive medical details in this form."
      >
        <Textarea
          id="contact-message"
          rows={6}
          placeholder="How can we help?"
          invalid={Boolean(errors.message)}
          {...register("message")}
        />
      </Field>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <Checkbox
        label="I agree that the clinic may contact me about this enquiry."
        description="We will only use your details to respond. See the privacy policy for how information is handled."
        {...register("consent")}
      />
      {errors.consent && (
        <p className="text-xs font-medium text-red-600" role="alert">
          {errors.consent.message}
        </p>
      )}

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] leading-relaxed text-muted">
          We aim to reply within one working day. For urgent dental problems, please call.
        </p>
        <Button
          type="submit"
          disabled={isSubmitting}
          iconRight={isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          className="shrink-0"
        >
          {isSubmitting ? "Sending…" : "Send message"}
        </Button>
      </div>
    </form>
  );
}
