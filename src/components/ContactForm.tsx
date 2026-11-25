import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Copy,
  LoaderCircle,
  Mail,
} from "lucide-react";
import { company } from "../data/company";
import { services } from "../data/services";

type Fields = {
  name: string;
  business: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};
type Status = "idle" | "sending" | "success" | "email-ready" | "error";
const empty: Fields = {
  name: "",
  business: "",
  email: "",
  phone: "",
  service: "",
  message: "",
};

function validate(values: Fields) {
  const errors: Partial<Record<keyof Fields, string>> = {};
  if (values.name.trim().length < 2)
    errors.name = "Please enter your full name (at least 2 characters).";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
    errors.email = "Please enter a valid email address.";
  const digits = values.phone.replace(/\D/g, "");
  if (
    !/^\+?[\d\s().-]+$/.test(values.phone.trim()) ||
    digits.length < 7 ||
    digits.length > 15
  )
    errors.phone =
      "Please enter a valid phone number, including your country code.";
  if (!values.service)
    errors.service =
      'Please select a service or choose "Let\'s figure it out".';
  if (values.message.trim().length < 20)
    errors.message =
      "Tell us a little more about your project (at least 20 characters).";
  return errors;
}

export default function ContactForm({
  selectedService,
}: {
  selectedService: { name: string };
}) {
  const [values, setValues] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>(
    {},
  );
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");
  const [copyFeedback, setCopyFeedback] = useState("");
  const form = useRef<HTMLFormElement>(null);
  const pendingRequest = useRef<AbortController | null>(null);

  useEffect(() => {
    if (selectedService.name) {
      setValues((current) => ({ ...current, service: selectedService.name }));
      setErrors((current) => ({ ...current, service: undefined }));
    }
  }, [selectedService]);
  useEffect(() => () => pendingRequest.current?.abort(), []);

  const brief = `Hello ${company.name},\n\nI'd like to discuss a project.\n\nName: ${values.name.trim()}\nCompany: ${values.business.trim() || "Not specified"}\nEmail: ${values.email.trim()}\nPhone: ${values.phone.trim()}\nService: ${values.service}\n\nProject description:\n${values.message.trim()}\n\nThank you!`;
  const mailto = `mailto:${company.email}?subject=${encodeURIComponent(`Project enquiry: ${values.service || "New project"}`)}&body=${encodeURIComponent(brief)}`;

  function update(field: keyof Fields, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field])
      setErrors((current) => ({ ...current, [field]: undefined }));
    if (status !== "idle" && status !== "sending") setStatus("idle");
    setCopyFeedback("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus("idle");
      const firstField = Object.keys(nextErrors)[0];
      (
        form.current?.elements.namedItem(firstField) as HTMLElement | null
      )?.focus();
      return;
    }
    if (!company.formEndpoint.trim()) {
      setStatus("email-ready");
      window.location.href = mailto;
      return;
    }
    setStatus("sending");
    setFeedback("");
    const controller = new AbortController();
    pendingRequest.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    try {
      const payload = new FormData();
      Object.entries(values).forEach(([key, value]) =>
        payload.append(key, value.trim()),
      );
      payload.append(
        "_subject",
        `${company.name} project enquiry: ${values.service}`,
      );
      payload.append("_gotcha", "");
      const response = await fetch(company.formEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: payload,
        signal: controller.signal,
      });
      if (!response.ok)
        throw new Error(
          "The form service could not deliver your enquiry. Please try again or email us directly.",
        );
      setStatus("success");
      setValues(empty);
      setFeedback(
        "Thank you for reaching out. Your enquiry was accepted by our form service. We look forward to discussing your project.",
      );
    } catch (error) {
      setStatus("error");
      setFeedback(
        error instanceof TypeError
          ? "We could not reach the form service. Check your connection, try again, or email us directly."
          : error instanceof Error && error.name !== "AbortError"
            ? error.message
            : "The request timed out. Your details are still here. Please try again or email us directly.",
      );
    } finally {
      window.clearTimeout(timeout);
      pendingRequest.current = null;
    }
  }

  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(brief);
      setCopyFeedback(
        "Project details copied. Paste them into an email or WhatsApp message.",
      );
    } catch {
      setCopyFeedback(
        `Clipboard access is unavailable. Please send your enquiry directly to ${company.email}.`,
      );
    }
  }

  const errorMessage = (name: keyof Fields) =>
    errors[name] ? (
      <span className="field-error" id={`${name}-error`}>
        {errors[name]}
      </span>
    ) : null;
  const inputProps = (name: keyof Fields) => ({
    id: name,
    name,
    value: values[name],
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
    onChange: (event: { target: { value: string } }) =>
      update(name, event.target.value),
  });

  return (
    <form ref={form} className="contact-form" onSubmit={submit} noValidate>
      <fieldset disabled={status === "sending"}>
        <legend className="sr-only">Tell us about your project</legend>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="name">
              Full Name <span>*</span>
            </label>
            <input
              {...inputProps("name")}
              placeholder="Your name"
              autoComplete="name"
              required
              maxLength={100}
            />
            {errorMessage("name")}
          </div>
          <div className="form-field">
            <label htmlFor="business">
              Business / Company <span className="optional">(optional)</span>
            </label>
            <input
              {...inputProps("business")}
              placeholder="Your company"
              autoComplete="organization"
              maxLength={120}
            />
          </div>
          <div className="form-field">
            <label htmlFor="email">
              Email Address <span>*</span>
            </label>
            <input
              {...inputProps("email")}
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              required
              maxLength={254}
            />
            {errorMessage("email")}
          </div>
          <div className="form-field">
            <label htmlFor="phone">
              Phone Number <span>*</span>
            </label>
            <input
              {...inputProps("phone")}
              type="tel"
              placeholder="+91 98765 43210"
              autoComplete="tel"
              required
              maxLength={30}
            />
            {errorMessage("phone")}
          </div>
          <div className="form-field full-width">
            <label htmlFor="service">
              Service Required <span>*</span>
            </label>
            <select {...inputProps("service")} required>
              <option value="" disabled>
                Select a service
              </option>
              {services.map((service) => (
                <option key={service.id} value={service.name}>
                  {service.name}
                </option>
              ))}
              <option value="Let's figure it out">Let's figure it out</option>
            </select>
            {errorMessage("service")}
          </div>
          <div className="form-field full-width">
            <label htmlFor="message">
              Project Description <span>*</span>
            </label>
            <textarea
              {...inputProps("message")}
              placeholder="A little about your idea, your goals, and what you have in mind..."
              rows={4}
              minLength={20}
              maxLength={3000}
              required
            />
            {errorMessage("message")}
          </div>
        </div>
        <button
          className="button button-primary form-submit"
          type="submit"
          disabled={status === "sending"}
          aria-busy={status === "sending"}
        >
          {status === "sending" ? (
            <>
              <LoaderCircle size={18} className="loading-icon" /> Sending your
              enquiry...
            </>
          ) : (
            <>
              Let's Discuss Your Project <ArrowUpRight size={18} />
            </>
          )}
        </button>
      </fieldset>
      <p className="form-privacy">
        {company.formEndpoint
          ? "Your enquiry is sent securely through our form provider."
          : "This form opens your email app with your project details. Nothing is submitted until you send."}
      </p>
      <div aria-live="polite" aria-atomic="true">
        {status === "email-ready" && (
          <div className="form-feedback">
            <Mail size={22} />
            <div>
              <h3>Your email draft is ready.</h3>
              <p>
                Send it from your email app to complete your enquiry. If nothing
                opened, use the options below. No enquiry has been sent yet.
              </p>
              <div className="feedback-actions">
                <a href={mailto} className="text-link">
                  Open email app <ArrowUpRight size={14} />
                </a>
                <button type="button" className="text-link" onClick={copyBrief}>
                  Copy project details <Copy size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
        {status === "success" && (
          <div className="form-feedback">
            <CheckCircle2 size={24} />
            <div>
              <h3>Let's build something meaningful.</h3>
              <p>{feedback}</p>
            </div>
          </div>
        )}
        {status === "error" && (
          <div className="form-feedback is-error" role="alert">
            <div>
              <h3>Your enquiry has not been sent.</h3>
              <p>{feedback}</p>
              <a href={mailto} className="text-link">
                Send by email instead <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        )}
        {copyFeedback && <p className="copy-feedback">{copyFeedback}</p>}
      </div>
    </form>
  );
}
