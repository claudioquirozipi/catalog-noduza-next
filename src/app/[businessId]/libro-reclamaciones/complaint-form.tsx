"use client";

import { useState, useTransition, type FormEvent, type ReactNode } from "react";
import type { ComplaintInput, ComplaintStatus } from "@/lib/api";
import { submitComplaint, trackComplaint, type SubmitResult, type TrackResult } from "./actions";

// Todo usa las clases del tema (primary, foreground, background), así el libro toma los colores del negocio.
const INPUT = "w-full rounded-md border border-foreground/25 bg-background px-3 py-2 text-sm";
const BUTTON_PRIMARY =
  "rounded-md bg-primary px-4 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60";
const BUTTON_OUTLINE = "rounded-md border border-foreground/25 px-4 py-3 font-medium transition-colors hover:bg-foreground/5";

const STATUS_LABEL: Record<ComplaintStatus, string> = {
  PENDING: "Pendiente de respuesta",
  IN_PROGRESS: "En atención",
  RESOLVED: "Resuelto",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-PE", { year: "numeric", month: "long", day: "numeric" });
}

// ==================== Formulario ====================

type ComplaintType = ComplaintInput["complaintType"];

export function ComplaintForm({
  businessId,
  businessName,
  currency,
}: {
  businessId: string;
  businessName: string;
  currency: string;
}) {
  const [complaintType, setComplaintType] = useState<ComplaintType>("RECLAMO");
  const [isMinor, setIsMinor] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [pending, startTransition] = useTransition();

  // La validación de cada campo la hace el navegador con required/minLength/maxLength,
  // con los mismos límites que la API (CreateComplaintDto en business-manager-nest).
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = (name: string) => String(data.get(name) ?? "").trim();
    const amount = Number(text("claimedAmount"));

    const input: ComplaintInput = {
      consumerName: text("consumerName"),
      consumerDocType: text("consumerDocType") as ComplaintInput["consumerDocType"],
      consumerDocNumber: text("consumerDocNumber"),
      consumerEmail: text("consumerEmail"),
      consumerPhone: text("consumerPhone"),
      consumerAddress: text("consumerAddress"),
      isMinor,
      ...(isMinor && { guardianName: text("guardianName"), guardianDocNumber: text("guardianDocNumber") }),
      complaintType,
      consumptionType: text("consumptionType") as ComplaintInput["consumptionType"],
      productDescription: text("productDescription"),
      ...(amount > 0 && { claimedAmount: amount }),
      complaintDetail: text("complaintDetail"),
      consumerRequest: text("consumerRequest"),
    };

    startTransition(async () => {
      const response = await submitComplaint(businessId, input);
      setResult(response);
      if (response.ok) window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (result?.ok) {
    return (
      <ComplaintReceipt
        businessName={businessName}
        complaintNumber={result.complaintNumber}
        createdAt={result.createdAt}
        onNew={() => {
          setResult(null);
          setComplaintType("RECLAMO");
          setIsMinor(false);
        }}
      />
    );
  }

  const label = complaintType === "RECLAMO" ? "reclamo" : "queja";

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-8">
      <Section title="1 · Tipo de registro">
        <div className="grid gap-3 sm:grid-cols-2">
          <TypeOption
            checked={complaintType === "RECLAMO"}
            onChange={() => setComplaintType("RECLAMO")}
            title="Reclamo"
            description="Disconformidad con un producto o servicio."
          />
          <TypeOption
            checked={complaintType === "QUEJA"}
            onChange={() => setComplaintType("QUEJA")}
            title="Queja"
            description="Malestar con la atención recibida."
          />
        </div>
      </Section>

      <Section title="2 · Tus datos">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre completo" className="sm:col-span-2">
            <input name="consumerName" required minLength={3} maxLength={200} autoComplete="name" className={INPUT} />
          </Field>
          <Field label="Tipo de documento">
            <select name="consumerDocType" defaultValue="DNI" className={INPUT}>
              <option value="DNI">DNI</option>
              <option value="CE">Carné de extranjería</option>
              <option value="PASAPORTE">Pasaporte</option>
            </select>
          </Field>
          <Field label="Número de documento">
            <input name="consumerDocNumber" required minLength={8} maxLength={20} className={INPUT} />
          </Field>
          <Field label="Correo electrónico">
            <input name="consumerEmail" type="email" required autoComplete="email" className={INPUT} />
          </Field>
          <Field label="Teléfono">
            <input name="consumerPhone" type="tel" required minLength={6} maxLength={20} autoComplete="tel" className={INPUT} />
          </Field>
          <Field label="Dirección" className="sm:col-span-2">
            <input name="consumerAddress" required minLength={5} maxLength={300} autoComplete="street-address" className={INPUT} />
          </Field>

          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={isMinor}
              onChange={(e) => setIsMinor(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            Soy menor de edad
          </label>
          {isMinor && (
            <>
              <Field label="Nombre del padre, madre o tutor">
                <input name="guardianName" required minLength={3} maxLength={200} className={INPUT} />
              </Field>
              <Field label="DNI del padre, madre o tutor">
                <input name="guardianDocNumber" required minLength={8} maxLength={20} className={INPUT} />
              </Field>
            </>
          )}
        </div>
      </Section>

      <Section title="3 · Producto o servicio">
        <div className="grid gap-4 sm:grid-cols-2">
          <fieldset className="sm:col-span-2">
            <legend className="mb-2 text-sm font-medium">Tipo</legend>
            <div className="flex gap-2">
              {(["PRODUCTO", "SERVICIO"] as const).map((value, i) => (
                <label
                  key={value}
                  className="cursor-pointer rounded-full border border-foreground/25 px-3 py-1.5 text-sm transition-colors hover:bg-foreground/5 has-checked:border-primary has-checked:bg-primary has-checked:text-primary-foreground has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary"
                >
                  <input type="radio" name="consumptionType" value={value} defaultChecked={i === 0} className="sr-only" />
                  {value === "PRODUCTO" ? "Producto" : "Servicio"}
                </label>
              ))}
            </div>
          </fieldset>
          <Field label="¿Qué compraste o contrataste?" className="sm:col-span-2">
            <input
              name="productDescription"
              required
              minLength={10}
              maxLength={500}
              placeholder="Ej.: polo talla M, pedido del 15 de noviembre"
              className={INPUT}
            />
          </Field>
          <Field label={`Monto reclamado en ${currency} (opcional)`}>
            <input name="claimedAmount" type="number" min={0} step="0.01" inputMode="decimal" className={INPUT} />
          </Field>
        </div>
      </Section>

      <Section title={`4 · Detalle de tu ${label}`}>
        <div className="space-y-4">
          <Field label="¿Qué pasó?" hint="Mínimo 20 caracteres.">
            <textarea name="complaintDetail" required minLength={20} maxLength={2000} rows={5} className={INPUT} />
          </Field>
          <Field label="¿Qué solución esperas?" hint="Mínimo 10 caracteres.">
            <textarea name="consumerRequest" required minLength={10} maxLength={1000} rows={3} className={INPUT} />
          </Field>
        </div>
      </Section>

      <div className="space-y-3">
        <p className="text-xs text-foreground/60">
          Al enviar declaro que la información es verdadera. {businessName} tiene un plazo máximo de 15 días hábiles
          para responder.
        </p>
        {result && !result.ok && (
          <p role="alert" className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-600">
            {result.error}
          </p>
        )}
        <button type="submit" disabled={pending} className={`w-full ${BUTTON_PRIMARY}`}>
          {pending ? "Enviando…" : `Enviar ${label}`}
        </button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-4">
      <legend className="mb-4 text-lg font-semibold">{title}</legend>
      {children}
    </fieldset>
  );
}

function Field({
  label,
  hint,
  className,
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`block text-sm ${className ?? ""}`}>
      <span className="mb-1 block font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-foreground/50">{hint}</span>}
    </label>
  );
}

function TypeOption({
  checked,
  onChange,
  title,
  description,
}: {
  checked: boolean;
  onChange: () => void;
  title: string;
  description: string;
}) {
  return (
    <label className="cursor-pointer rounded-xl border border-foreground/25 p-4 transition-colors hover:bg-foreground/5 has-checked:border-primary has-checked:bg-primary/10 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary">
      <input type="radio" name="complaintType" checked={checked} onChange={onChange} className="sr-only" />
      <span className="block font-semibold">{title}</span>
      <span className="mt-1 block text-sm text-foreground/70">{description}</span>
    </label>
  );
}

// Constancia del reclamo registrado. Se puede imprimir o guardar como PDF desde el navegador.
function ComplaintReceipt({
  businessName,
  complaintNumber,
  createdAt,
  onNew,
}: {
  businessName: string;
  complaintNumber: string;
  createdAt: string;
  onNew: () => void;
}) {
  return (
    <section className="mt-8 rounded-xl border border-primary/40 bg-primary/5 p-6 text-center">
      <p className="text-lg font-semibold">Tu registro fue enviado a {businessName}</p>
      <p className="mt-4 text-sm text-foreground/60">Número de registro</p>
      <p className="text-3xl font-bold tracking-wide">{complaintNumber}</p>
      <p className="mt-1 text-sm text-foreground/60">{formatDate(createdAt)}</p>

      <ul className="mx-auto mt-6 max-w-md space-y-1 text-left text-sm text-foreground/80">
        <li>• Guarda este número: con él y tu documento puedes consultar el estado aquí mismo.</li>
        <li>• El negocio tiene un plazo máximo de 15 días hábiles para responder.</li>
        <li>• Puedes imprimir esta constancia o guardarla como PDF.</li>
      </ul>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center print:hidden">
        <button type="button" onClick={() => window.print()} className={BUTTON_PRIMARY}>
          Imprimir o guardar PDF
        </button>
        <button type="button" onClick={onNew} className={BUTTON_OUTLINE}>
          Registrar otro
        </button>
      </div>
    </section>
  );
}

// ==================== Consulta de estado ====================

export function ComplaintTracker({ businessId }: { businessId: string }) {
  const [result, setResult] = useState<TrackResult | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const number = String(data.get("complaintNumber") ?? "");
    const doc = String(data.get("consumerDocNumber") ?? "");
    startTransition(async () => setResult(await trackComplaint(businessId, number, doc)));
  }

  return (
    <details className="mt-4 rounded-xl border border-foreground/15 p-4 text-sm print:hidden">
      <summary className="cursor-pointer font-medium">¿Ya registraste un reclamo? Consulta su estado</summary>

      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          name="complaintNumber"
          required
          placeholder="Número, ej.: 2026-000001"
          aria-label="Número de registro"
          className={INPUT}
        />
        <input
          name="consumerDocNumber"
          required
          minLength={8}
          maxLength={20}
          placeholder="Tu número de documento"
          aria-label="Número de documento con el que registraste el reclamo"
          className={INPUT}
        />
        <button type="submit" disabled={pending} className={`shrink-0 py-2 ${BUTTON_PRIMARY}`}>
          {pending ? "Buscando…" : "Consultar"}
        </button>
      </form>

      {result && !result.ok && <p className="mt-3 text-red-600">{result.error}</p>}
      {result?.ok && (
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-foreground/60">Número</dt>
            <dd className="font-semibold">{result.complaintNumber}</dd>
          </div>
          <div>
            <dt className="text-foreground/60">Fecha</dt>
            <dd>{formatDate(result.createdAt)}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-foreground/60">Estado</dt>
            <dd className="font-semibold">{STATUS_LABEL[result.status] ?? result.status}</dd>
          </div>
          {result.providerResponse && (
            <div className="sm:col-span-2">
              <dt className="text-foreground/60">
                Respuesta del negocio{result.responseDate && ` (${formatDate(result.responseDate)})`}
              </dt>
              <dd className="mt-1 whitespace-pre-line">{result.providerResponse}</dd>
            </div>
          )}
        </dl>
      )}
    </details>
  );
}
