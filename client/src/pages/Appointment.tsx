import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CalendarPlus,
  Check,
  CheckCircle2,
  Clock,
  Info,
  Loader2,
  Phone,
  Printer,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Field, Input, Select, Textarea, Checkbox } from "@/components/ui/Field";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { doctors, services } from "@/data/content";
import { site } from "@/config/site";
import { api, apiError } from "@/lib/api";
import { useSeo } from "@/lib/seo";
import { addDaysISO, cn, formatDate, isPastDate, todayISO } from "@/lib/utils";

const schema = z.object({
  service: z.string().min(1, "Choose a treatment, or select ‘Not sure yet’."),
  doctor: z.string().optional().default(""),
  date: z
    .string()
    .min(1, "Choose a preferred date.")
    .refine((value) => !isPastDate(value), "Please choose today or a future date.")
    .refine(
      (value) => new Date(`${value}T12:00:00`).getDay() !== 0,
      "The clinic is closed on Sundays. Please choose another day.",
    ),
  time: z.string().min(1, "Choose a preferred time."),
  firstName: z.string().trim().min(2, "Please enter your first name.").max(60),
  lastName: z.string().trim().min(2, "Please enter your last name.").max(60),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a contactable phone number.")
    .max(24, "That number is too long.")
    .regex(/^[+()\d\s-]+$/, "Use digits, spaces, +, ( ) or - only."),
  message: z.string().trim().max(1200, "Please keep notes under 1,200 characters.").optional().default(""),
  consent: z.literal(true, {
    errorMap: () => ({
      message: "Please confirm you understand this is a request, not a confirmed appointment.",
    }),
  }),
  website: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof schema>;

type Slot = { time: string; available: boolean; reason: string | null };

type Confirmation = {
  reference: string;
  status: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  doctor: string;
  date: string;
  time: string;
  message: string;
  createdAt: string;
};

const steps = ["Appointment", "Your details", "Request sent"];

export default function AppointmentPage() {
  useSeo({
    title: "Book an Appointment",
    description:
      "Request an appointment at Aurelia Dental Studio. Choose a treatment, clinician, preferred date and time — our team will confirm the exact appointment with you.",
    image: "/images/clinic-consultation-warm.jpg",
  });

  const [params] = useSearchParams();
  const { toast } = useToast();

  const requestedService = params.get("service") ?? "";
  const requestedDoctor = params.get("doctor") ?? "";

  const initialService =
    services.find((item) => item.slug === requestedService)?.name ??
    services.find((item) => item.name.toLowerCase() === requestedService.toLowerCase())?.name ??
    "";
  const initialDoctor =
    doctors.find((item) => item.slug === requestedDoctor)?.name ??
    doctors.find((item) => item.name.toLowerCase() === requestedDoctor.toLowerCase())?.name ??
    "";

  const [step, setStep] = useState(0);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      service: initialService,
      doctor: initialDoctor,
      date: "",
      time: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
      website: "",
    },
  });

  const values = watch();
  const selectedDate = values.date;
  const selectedDoctor = values.doctor;

  useEffect(() => {
    if (!selectedDate || isPastDate(selectedDate)) {
      setSlots([]);
      return;
    }
    let active = true;
    const controller = new AbortController();
    setSlotsLoading(true);
    setSlotsError(null);
    api
      .get<{ data: { slots: Slot[] } }>("/availability", {
        params: { date: selectedDate, doctor: selectedDoctor || undefined },
        signal: controller.signal,
      })
      .then((res) => {
        if (!active) return;
        const next = res.data?.data?.slots ?? [];
        setSlots(next);
        const chosen = values.time;
        if (chosen) {
          const match = next.find((slot) => slot.time === chosen);
          if (match && !match.available) {
            setValue("time", "");
            toast({
              title: "That time is no longer available",
              description: "Please choose another preferred slot.",
              variant: "info",
            });
          }
        }
      })
      .catch((error) => {
        if (!active || controller.signal.aborted) return;
        setSlots([]);
        setSlotsError(apiError(error));
      })
      .finally(() => {
        if (active) setSlotsLoading(false);
      });
    return () => {
      active = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, selectedDoctor]);

  const summaryDate = selectedDate ? formatDate(selectedDate) : "Not selected";

  const chosenService = values.service;
  const chosenDoctor = values.doctor || "No preference";

  const groupedServices = useMemo(() => {
    const map = new Map<string, typeof services>();
    for (const service of services) {
      map.set(service.category, [...(map.get(service.category) ?? []), service]);
    }
    return Array.from(map.entries());
  }, []);

  async function goToDetails() {
    const valid = await trigger(["service", "doctor", "date", "time"]);
    if (!valid) return;
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(form: FormValues) {
    setSubmitError(null);
    try {
      const { data } = await api.post<{ data: Confirmation }>("/appointments", {
        ...form,
        consent: true,
      });
      setConfirmation(data.data);
      setStep(2);
      toast({
        title: "Request received",
        description: `Your reference is ${data.data.reference}. We will be in touch to confirm.`,
        variant: "success",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      const message = apiError(error);
      setSubmitError(message);
      toast({ title: "Request not sent", description: message, variant: "error" });
    }
  }

  function downloadCalendar() {
    if (!confirmation) return;
    const start = new Date(`${confirmation.date}T${confirmation.time}:00`);
    const end = new Date(start.getTime() + 45 * 60 * 1000);
    const stamp = (date: Date) => `${date.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Aurelia Dental Studio//Appointment Request//EN",
      "BEGIN:VEVENT",
      `UID:${confirmation.reference}@aureliadental.studio`,
      `DTSTAMP:${stamp(new Date())}`,
      `DTSTART:${stamp(start)}`,
      `DTEND:${stamp(end)}`,
      `SUMMARY:Appointment request — ${confirmation.service} (${site.name})`,
      `DESCRIPTION:Reference ${confirmation.reference}. This is a REQUEST and is not confirmed until the clinic contacts you.`,
      `LOCATION:${site.contact.address.line1}, ${site.contact.address.line2}, ${site.contact.address.city} ${site.contact.address.postcode}`,
      "STATUS:TENTATIVE",
      "END:VEVENT",
      "END:VCALENDAR",
    ];
    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `aurelia-${confirmation.reference}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <PageHero
        eyebrow="Appointments"
        title="Request your visit in two short steps."
        description="Choose a preferred treatment, clinician and time. Your request is recorded as pending — our team will contact you to confirm the exact appointment. Nothing is confirmed until we have spoken."
        crumbs={[{ label: "Book an appointment" }]}
        tone="white"
        align="center"
      />

      <section className="bg-ivory py-12 lg:py-16">
        <div className="container-x">
          <div className="mx-auto max-w-6xl">
            <StepIndicator current={step} />

            {step === 2 && confirmation ? (
              <ConfirmationPanel
                confirmation={confirmation}
                onCalendar={downloadCalendar}
                onPrint={() => window.print()}
              />
            ) : (
              <div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
                <div className="rounded-3xl border border-beige bg-white p-5 shadow-soft sm:p-7">
                  <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    {step === 0 ? (
                      <div className="space-y-6">
                        <div>
                          <h2 className="font-display text-[24px] leading-snug text-ink">What can we help with?</h2>
                          <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
                            If you are unsure, choose “Not sure yet” or a general consultation.
                          </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="Treatment" htmlFor="appt-service" required error={errors.service?.message}>
                            <Select id="appt-service" invalid={Boolean(errors.service)} {...register("service")}>
                              <option value="">Select a treatment…</option>
                              <option value="Not sure yet">Not sure yet — please advise</option>
                              <option value="General consultation">General consultation</option>
                              {groupedServices.map(([category, items]) => (
                                <optgroup key={category} label={category}>
                                  {items.map((service) => (
                                    <option key={service.slug} value={service.name}>
                                      {service.name}
                                    </option>
                                  ))}
                                </optgroup>
                              ))}
                            </Select>
                          </Field>

                          <Field
                            label="Preferred clinician"
                            htmlFor="appt-doctor"
                            error={errors.doctor?.message}
                            hint="Subject to availability."
                          >
                            <Select id="appt-doctor" {...register("doctor")}>
                              <option value="">No preference</option>
                              {doctors
                                .filter((doctor) => doctor.active !== false)
                                .map((doctor) => (
                                  <option key={doctor.slug} value={doctor.name}>
                                    {doctor.name} — {doctor.specialisation}
                                  </option>
                                ))}
                            </Select>
                          </Field>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field
                            label="Preferred date"
                            htmlFor="appt-date"
                            required
                            error={errors.date?.message}
                            hint="Closed Sundays. We will confirm the exact time."
                          >
                            <Input
                              id="appt-date"
                              type="date"
                              min={todayISO()}
                              max={addDaysISO(site.booking.maxDaysAhead)}
                              invalid={Boolean(errors.date)}
                              {...register("date")}
                            />
                          </Field>
                          <div>
                            <p className="field-label">Selected</p>
                            <div className="flex h-12 items-center gap-2 rounded-xl border border-beige bg-ivory px-4 text-[13px] text-ink">
                              <CalendarDays className="h-4 w-4 shrink-0 text-rose" aria-hidden />
                              <span className="truncate">{summaryDate}</span>
                              {values.time && (
                                <>
                                  <span className="h-4 w-px bg-beige" aria-hidden />
                                  <Clock className="h-4 w-4 shrink-0 text-rose" aria-hidden />
                                  <span>{values.time}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                            <p className="field-label mb-0">
                              Preferred time <span className="text-burgundy">*</span>
                            </p>
                            <div className="flex items-center gap-3 text-[10.5px] text-muted">
                              <span className="inline-flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-burgundy" aria-hidden /> Selected
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-beige" aria-hidden /> Unavailable
                              </span>
                            </div>
                          </div>

                          {!selectedDate ? (
                            <div className="rounded-xl border border-dashed border-beige bg-ivory/60 px-4 py-8 text-center">
                              <CalendarDays className="mx-auto h-5 w-5 text-muted" aria-hidden />
                              <p className="mt-2 text-[12.5px] text-muted">
                                Choose a date to see indicative availability.
                              </p>
                            </div>
                          ) : slotsLoading ? (
                            <div className="flex items-center justify-center gap-2 rounded-xl border border-beige bg-ivory/60 px-4 py-8 text-[12.5px] text-muted">
                              <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Checking availability…
                            </div>
                          ) : slotsError ? (
                            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-[12px] leading-relaxed text-amber-900">
                              We could not load live availability. You can still choose a preferred time below and we
                              will confirm it with you.
                              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
                                {site.booking.timeSlots.map((time) => (
                                  <label
                                    key={time}
                                    className={cn(
                                      "cursor-pointer rounded-lg border px-2 py-2 text-center text-[12px] transition-colors",
                                      values.time === time
                                        ? "border-burgundy bg-burgundy text-white"
                                        : "border-beige bg-white text-ink hover:border-rose",
                                    )}
                                  >
                                    <input type="radio" value={time} className="sr-only" {...register("time")} />
                                    {time}
                                  </label>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                              {slots.map((slot) => {
                                const selected = values.time === slot.time;
                                return (
                                  <label
                                    key={slot.time}
                                    className={cn(
                                      "relative cursor-pointer rounded-xl border px-2 py-2.5 text-center text-[12px] font-medium transition-all",
                                      !slot.available
                                        ? "cursor-not-allowed border-beige/60 bg-ivory text-muted line-through"
                                        : selected
                                          ? "border-burgundy bg-burgundy text-white shadow-soft"
                                          : "border-beige bg-white text-ink hover:border-rose hover:bg-burgundy-50",
                                    )}
                                    title={
                                      !slot.available
                                        ? slot.reason === "clinician"
                                          ? "Clinician unavailable"
                                          : "Already requested"
                                        : undefined
                                    }
                                  >
                                    <input
                                      type="radio"
                                      value={slot.time}
                                      disabled={!slot.available}
                                      className="sr-only"
                                      {...register("time")}
                                    />
                                    {slot.time}
                                  </label>
                                );
                              })}
                            </div>
                          )}
                          {errors.time && (
                            <p className="mt-2 text-xs font-medium text-red-600" role="alert">
                              {errors.time.message}
                            </p>
                          )}
                          <p className="mt-2 text-[11px] leading-relaxed text-muted">
                            Times shown are requests, not confirmed slots. We may suggest the nearest available
                            alternative.
                          </p>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-beige pt-5 sm:flex-row sm:items-center sm:justify-between">
                          <a href={site.contact.phoneHref} className="text-[12.5px] font-medium text-burgundy">
                            Prefer to call? {site.contact.phone}
                          </a>
                          <Button type="button" onClick={goToDetails} iconRight={<ArrowRight className="h-4 w-4" />}>
                            Continue
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        <div>
                          <h2 className="font-display text-[24px] leading-snug text-ink">Your details</h2>
                          <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
                            We only need enough to contact you and confirm the appointment.
                          </p>
                        </div>

                        <div className="rounded-2xl border border-beige bg-ivory p-4">
                          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-ink/80">
                            <span className="inline-flex items-center gap-1.5">
                              <Sparkles className="h-3.5 w-3.5 text-rose" aria-hidden /> {chosenService}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <UserRound className="h-3.5 w-3.5 text-rose" aria-hidden /> {chosenDoctor}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays className="h-3.5 w-3.5 text-rose" aria-hidden /> {summaryDate}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-rose" aria-hidden /> {values.time}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setStep(0)}
                            className="mt-2 text-[11.5px] font-medium text-burgundy underline decoration-rose/50 underline-offset-4"
                          >
                            Change appointment preferences
                          </button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="First name" htmlFor="appt-first" required error={errors.firstName?.message}>
                            <Input
                              id="appt-first"
                              autoComplete="given-name"
                              placeholder="Alex"
                              invalid={Boolean(errors.firstName)}
                              {...register("firstName")}
                            />
                          </Field>
                          <Field label="Last name" htmlFor="appt-last" required error={errors.lastName?.message}>
                            <Input
                              id="appt-last"
                              autoComplete="family-name"
                              placeholder="Morgan"
                              invalid={Boolean(errors.lastName)}
                              {...register("lastName")}
                            />
                          </Field>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="Email address" htmlFor="appt-email" required error={errors.email?.message}>
                            <Input
                              id="appt-email"
                              type="email"
                              autoComplete="email"
                              placeholder="you@example.com"
                              invalid={Boolean(errors.email)}
                              {...register("email")}
                            />
                          </Field>
                          <Field label="Telephone" htmlFor="appt-phone" required error={errors.phone?.message}>
                            <Input
                              id="appt-phone"
                              type="tel"
                              autoComplete="tel"
                              placeholder="+44 7700 900123"
                              invalid={Boolean(errors.phone)}
                              {...register("phone")}
                            />
                          </Field>
                        </div>

                        <Field
                          label="Anything we should know?"
                          htmlFor="appt-message"
                          error={errors.message?.message}
                          hint="Nervous patient, accessibility needs, preferred contact time. Please avoid sensitive clinical detail."
                        >
                          <Textarea
                            id="appt-message"
                            rows={4}
                            placeholder="Optional notes for the reception team"
                            invalid={Boolean(errors.message)}
                            {...register("message")}
                          />
                        </Field>

                        <div className="hidden" aria-hidden="true">
                          <label htmlFor="appt-website">Website</label>
                          <input id="appt-website" tabIndex={-1} autoComplete="off" {...register("website")} />
                        </div>

                        <Checkbox
                          label={
                            <>
                              I understand this is an appointment <strong>request</strong>, not a confirmed booking.
                            </>
                          }
                          description="The clinic will contact me to confirm the exact time. I have read the privacy policy and terms."
                          {...register("consent")}
                        />
                        {errors.consent && (
                          <p className="text-xs font-medium text-red-600" role="alert">
                            {errors.consent.message}
                          </p>
                        )}

                        {submitError && (
                          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] leading-relaxed text-red-700">
                            {submitError}
                          </div>
                        )}

                        <div className="flex flex-col-reverse gap-3 border-t border-beige pt-5 sm:flex-row sm:items-center sm:justify-between">
                          <Button type="button" variant="ghost" onClick={() => setStep(0)} iconLeft={<ArrowLeft className="h-4 w-4" />}>
                            Back
                          </Button>
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            iconRight={isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                          >
                            {isSubmitting ? "Sending request…" : "Send appointment request"}
                          </Button>
                        </div>

                        <p className="text-[10.5px] leading-relaxed text-muted">
                          By sending this request you agree to be contacted about your appointment. We do not sell
                          personal data. See our{" "}
                          <Link to="/privacy-policy" className="underline decoration-rose/60 underline-offset-4">
                            privacy policy
                          </Link>
                          .
                        </p>
                      </div>
                    )}
                  </form>
                </div>

                <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
                  <div className="rounded-3xl border border-beige bg-white p-5 shadow-soft">
                    <p className="eyebrow mb-3">Your request</p>
                    <dl className="space-y-3 text-[12.5px]">
                      <div className="flex items-start justify-between gap-3">
                        <dt className="text-muted">Treatment</dt>
                        <dd className="max-w-[62%] text-right font-medium text-ink">{chosenService || "Not selected"}</dd>
                      </div>
                      <div className="flex items-start justify-between gap-3">
                        <dt className="text-muted">Clinician</dt>
                        <dd className="max-w-[62%] text-right font-medium text-ink">{chosenDoctor}</dd>
                      </div>
                      <div className="flex items-start justify-between gap-3">
                        <dt className="text-muted">Date</dt>
                        <dd className="max-w-[62%] text-right font-medium text-ink">{summaryDate}</dd>
                      </div>
                      <div className="flex items-start justify-between gap-3">
                        <dt className="text-muted">Time</dt>
                        <dd className="text-right font-medium text-ink">{values.time || "Not selected"}</dd>
                      </div>
                    </dl>
                    <div className="mt-4 rounded-xl bg-ivory p-3.5">
                      <p className="flex items-start gap-2 text-[11.5px] leading-relaxed text-muted">
                        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-burgundy" aria-hidden />
                        {site.booking.pendingNote}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-beige bg-white p-5">
                    <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted">What happens next</p>
                    <ol className="mt-3 space-y-3">
                      {[
                        "We receive your request instantly",
                        "Reception checks clinician availability",
                        "We call or email to confirm the exact time",
                        "You receive a written appointment summary",
                      ].map((item, index) => (
                        <li key={item} className="flex gap-2.5 text-[12px] leading-snug text-ink/75">
                          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-burgundy-50 text-[10px] font-semibold text-burgundy">
                            {index + 1}
                          </span>
                          {item}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="rounded-3xl border border-beige bg-ivory p-5">
                    <p className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-burgundy">
                      <Phone className="h-3.5 w-3.5" aria-hidden /> Need help booking?
                    </p>
                    <p className="mt-2 text-[12px] leading-relaxed text-muted">
                      Call reception during clinic hours and we will arrange it with you.
                    </p>
                    <a href={site.contact.phoneHref} className="mt-2 block text-[15px] font-medium text-burgundy">
                      {site.contact.phone}
                    </a>
                    <div className="mt-3 flex items-center gap-2">
                      <Badge tone="success" dot>
                        New patients welcome
                      </Badge>
                      <Badge tone="muted">Response {site.booking.responseTime}</Badge>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-rose/30 bg-rose/5 p-5">
                    <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-burgundy">
                      Urgent problem?
                    </p>
                    <p className="mt-2 text-[11.5px] leading-relaxed text-muted">{site.emergency.note}</p>
                    <p className="mt-2 text-[11.5px] leading-relaxed text-muted">
                      For severe pain or a broken tooth, please call rather than waiting for an online reply.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 px-1 text-[10.5px] leading-relaxed text-muted">
                    <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    Your details are used only to handle this request.
                  </div>
                </aside>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="mx-auto flex max-w-2xl items-center justify-center gap-2 sm:gap-4">
      {steps.map((label, index) => {
        const state = index < current ? "done" : index === current ? "current" : "upcoming";
        return (
          <li key={label} className="flex flex-1 items-center gap-2 sm:gap-3">
            <span
              className={cn(
                "grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[11px] font-semibold transition-colors",
                state === "done" && "border-burgundy bg-burgundy text-white",
                state === "current" && "border-burgundy bg-white text-burgundy",
                state === "upcoming" && "border-beige bg-white text-muted",
              )}
              aria-current={state === "current" ? "step" : undefined}
            >
              {state === "done" ? <Check className="h-3.5 w-3.5" aria-hidden /> : index + 1}
            </span>
            <span
              className={cn(
                "hidden text-[11.5px] font-medium sm:block",
                state === "upcoming" ? "text-muted" : "text-ink",
              )}
            >
              {label}
            </span>
            {index < steps.length - 1 && <span className="h-px flex-1 bg-beige" aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}

function ConfirmationPanel({
  confirmation,
  onCalendar,
  onPrint,
}: {
  confirmation: Confirmation;
  onCalendar: () => void;
  onPrint: () => void;
}) {
  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-3xl border border-beige bg-white p-6 shadow-soft sm:p-9">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-7 w-7" aria-hidden />
          </span>
          <div>
            <Badge tone="warning">Pending confirmation</Badge>
            <h2 className="mt-2 font-display text-[26px] leading-tight text-ink sm:text-[30px]">
              Your request is with our team.
            </h2>
          </div>
        </div>

        <p className="mt-4 max-w-xl text-[13.5px] leading-relaxed text-muted">
          Thank you, {confirmation.firstName}. This is not yet a confirmed appointment. Reception will contact you{" "}
          {site.booking.responseTime} to confirm the time or suggest the nearest alternative.
        </p>

        <div className="mt-6 rounded-2xl border border-beige bg-ivory p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted">Reference number</p>
            <span className="font-mono text-[15px] font-semibold tracking-wider text-burgundy">
              {confirmation.reference}
            </span>
          </div>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              ["Treatment", confirmation.service],
              ["Clinician", confirmation.doctor || "No preference"],
              ["Preferred date", formatDate(confirmation.date)],
              ["Preferred time", confirmation.time],
              ["Name", `${confirmation.firstName} ${confirmation.lastName}`],
              ["Contact", confirmation.email],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-[10.5px] uppercase tracking-[0.12em] text-muted">{label}</dt>
                <dd className="mt-0.5 text-[13px] font-medium text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 print:hidden">
          <Button onClick={onCalendar} variant="secondary" iconLeft={<CalendarPlus className="h-4 w-4" />}>
            Add to calendar
          </Button>
          <Button onClick={onPrint} variant="ghost" iconLeft={<Printer className="h-4 w-4" />}>
            Print summary
          </Button>
          <ButtonLink to="/" variant="ghost" iconRight={<ArrowRight className="h-4 w-4" />}>
            Back to home
          </ButtonLink>
        </div>

        <div className="mt-5 rounded-2xl border border-amber-200/70 bg-amber-50/60 p-4">
          <p className="flex items-start gap-2 text-[11.5px] leading-relaxed text-amber-900/80">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            Need to change or cancel? Call {site.contact.phone} and quote reference{" "}
            <strong>{confirmation.reference}</strong>. Please give at least 24 hours' notice where possible.
          </p>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-3xl border border-beige bg-white p-6">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted">While you wait</p>
          <ul className="mt-3 space-y-3">
            {[
              ["Read your first-visit guide", "/patient-information"],
              ["Prepare questions for the clinician", "/faq"],
              ["Browse related treatments", "/services"],
            ].map(([label, to]) => (
              <li key={to}>
                <Link to={to} className="flex items-center justify-between gap-2 text-[13px] text-ink/80 hover:text-burgundy">
                  {label}
                  <ArrowRight className="h-3.5 w-3.5 text-muted" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-beige bg-ivory p-6">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-burgundy">The studio</p>
          <p className="mt-2 text-[13px] font-medium text-ink">{site.name}</p>
          <p className="mt-1 text-[12px] leading-relaxed text-muted">
            {site.contact.address.line1}, {site.contact.address.line2}
            <br />
            {site.contact.address.city} {site.contact.address.postcode}
          </p>
          <a href={site.contact.phoneHref} className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-burgundy">
            <Phone className="h-3.5 w-3.5" aria-hidden /> {site.contact.phone}
          </a>
        </div>

        <div className="rounded-3xl border border-rose/30 bg-rose/5 p-5">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-burgundy">In pain?</p>
          <p className="mt-2 text-[11.5px] leading-relaxed text-muted">
            Do not wait for confirmation. Call the clinic so we can arrange urgent care.
          </p>
        </div>
      </aside>
    </div>
  );
}
