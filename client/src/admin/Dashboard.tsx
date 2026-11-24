import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  Inbox,
  Mail,
  Newspaper,
  RefreshCw,
  Sparkles,
  Stethoscope,
  UserRound,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { api, apiError } from "@/lib/api";
import { formatShortDate, parseApiDate } from "@/lib/utils";
import { EmptyRow, PageHeader, Panel, StatCard, StatusBadge } from "./components";
import { useDocumentTitle } from "./ProtectedRoute";

type Overview = {
  counts: {
    appointments: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    today: number;
    upcoming: number;
    messages: number;
    unread: number;
    newsletter: number;
    services: number;
    doctors: number;
    posts: number;
    gallery: number;
  };
  recentAppointments: Appointment[];
  recentMessages: Message[];
};

type Appointment = {
  id: string;
  reference: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  doctor?: string;
  date: string;
  time: string;
  status: string;
  createdAt: string;
};

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function Dashboard() {
  useDocumentTitle("Overview");
  const { toast } = useToast();
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<{ data: Overview }>("/admin/overview");
      setData(response.data.data);
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const counts = data?.counts;

  return (
    <>
      <PageHeader
        title="Practice overview"
        description="A live snapshot of appointment requests, enquiries and published content. Appointment requests stay pending until the clinic confirms them."
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                load();
                toast({ title: "Overview refreshed" });
              }}
              iconLeft={<RefreshCw className={loading ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />}
            >
              Refresh
            </Button>
            <Link
              to="/admin/appointments"
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-burgundy px-4 text-[13px] font-medium text-white transition-colors hover:bg-burgundy-deep"
            >
              Appointment requests <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </>
        }
      />

      {error ? (
        <Panel>
          <EmptyRow
            title="Could not load the overview"
            description={error}
            action={
              <Button size="sm" variant="secondary" onClick={load}>
                Try again
              </Button>
            }
          />
        </Panel>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Pending requests"
              value={loading ? "—" : counts?.pending ?? 0}
              hint="Awaiting confirmation from reception"
              tone="warning"
              icon={<CalendarClock className="h-4 w-4" />}
            />
            <StatCard
              label="Upcoming"
              value={loading ? "—" : counts?.upcoming ?? 0}
              hint="Pending and confirmed appointments ahead"
              icon={<CalendarCheck className="h-4 w-4" />}
            />
            <StatCard
              label="Unread messages"
              value={loading ? "—" : counts?.unread ?? 0}
              hint={`${counts?.messages ?? 0} enquiries in total`}
              tone={counts?.unread ? "success" : "default"}
              icon={<Mail className="h-4 w-4" />}
            />
            <StatCard
              label="Newsletter"
              value={loading ? "—" : counts?.newsletter ?? 0}
              hint="Confirmed email subscribers"
              icon={<Users className="h-4 w-4" />}
            />
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Treatments" value={loading ? "—" : counts?.services ?? 0} icon={<Stethoscope className="h-4 w-4" />} />
            <StatCard label="Clinicians" value={loading ? "—" : counts?.doctors ?? 0} icon={<UserRound className="h-4 w-4" />} />
            <StatCard label="Journal articles" value={loading ? "—" : counts?.posts ?? 0} icon={<Newspaper className="h-4 w-4" />} />
            <StatCard label="Gallery images" value={loading ? "—" : counts?.gallery ?? 0} icon={<Sparkles className="h-4 w-4" />} />
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
            <Panel>
              <div className="flex items-center justify-between gap-3 border-b border-beige/80 px-5 py-4">
                <div>
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted">Latest activity</p>
                  <h2 className="mt-0.5 font-display text-[19px] text-ink">Recent appointment requests</h2>
                </div>
                <Link to="/admin/appointments" className="link-arrow text-[12px]">
                  View all <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </div>

              {loading ? (
                <div className="px-5 py-10 text-center text-[12.5px] text-muted">Loading requests…</div>
              ) : !data?.recentAppointments.length ? (
                <EmptyRow
                  title="No appointment requests yet"
                  description="Requests submitted through the public booking form will appear here."
                  action={
                    <Link
                      to="/appointment"
                      className="inline-flex h-9 items-center rounded-full border border-burgundy/25 bg-white px-4 text-[12.5px] font-medium text-burgundy"
                    >
                      Open booking form
                    </Link>
                  }
                />
              ) : (
                <ul className="divide-y divide-beige/70">
                  {data.recentAppointments.map((appointment) => (
                    <li key={appointment.id} className="flex flex-col gap-2 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[13px] font-semibold text-ink">
                            {appointment.firstName} {appointment.lastName}
                          </p>
                          <span className="font-mono text-[10px] tracking-wide text-muted">{appointment.reference}</span>
                        </div>
                        <p className="mt-0.5 truncate text-[11.5px] text-muted">
                          {appointment.service} · {formatShortDate(appointment.date)} at {appointment.time}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <StatusBadge status={appointment.status} />
                        <Link
                          to="/admin/appointments"
                          className="text-[11.5px] font-medium text-burgundy hover:underline"
                        >
                          Manage
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <div className="space-y-4">
              <Panel>
                <div className="flex items-center justify-between gap-3 border-b border-beige/80 px-5 py-4">
                  <div>
                    <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted">Inbox</p>
                    <h2 className="mt-0.5 font-display text-[19px] text-ink">Recent messages</h2>
                  </div>
                  <Link to="/admin/messages" className="text-[11.5px] font-medium text-burgundy hover:underline">
                    Open
                  </Link>
                </div>
                {loading ? (
                  <div className="px-5 py-8 text-center text-[12px] text-muted">Loading…</div>
                ) : !data?.recentMessages.length ? (
                  <div className="px-5 py-8 text-center text-[12px] text-muted">No enquiries yet.</div>
                ) : (
                  <ul className="divide-y divide-beige/70">
                    {data.recentMessages.map((message) => (
                      <li key={message.id} className="px-5 py-3.5">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-[12.5px] font-medium text-ink">{message.name}</p>
                          {!message.read && (
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-burgundy" role="img" aria-label="Unread" />
                          )}
                        </div>
                        <p className="truncate text-[11.5px] text-muted">{message.subject}</p>
                        <p className="mt-0.5 text-[10px] text-muted">{parseApiDate(message.createdAt)}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </Panel>

              <Panel className="bg-burgundy-deep p-5 text-white">
                <Inbox className="h-5 w-5 text-rose" aria-hidden />
                <p className="mt-3 font-display text-[19px] leading-snug">A note on this workspace</p>
                <p className="mt-2 text-[11.5px] leading-relaxed text-white/55">
                  This is a demonstration build. Do not enter real patient information. The default admin password must
                  be changed before deployment, and editorial placeholders should be reviewed.
                </p>
                <Link
                  to="/patient-information"
                  className="mt-4 inline-flex items-center gap-1.5 text-[11.5px] font-medium text-rose"
                >
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden /> View public patient guide
                </Link>
              </Panel>
            </div>
          </div>
        </>
      )}
    </>
  );
}
