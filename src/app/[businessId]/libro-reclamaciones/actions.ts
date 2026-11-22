"use server";

import { ApiError, createComplaint, getComplaintByNumber, type ComplaintInput, type ComplaintStatus } from "@/lib/api";

export type SubmitResult = { ok: true; complaintNumber: string; createdAt: string } | { ok: false; error: string };

// Se llama desde el formulario del catálogo. La API valida de nuevo todos los campos.
export async function submitComplaint(businessId: string, input: ComplaintInput): Promise<SubmitResult> {
  try {
    const complaint = await createComplaint(businessId, input);
    return { ok: true, complaintNumber: complaint.complaintNumber, createdAt: complaint.createdAt };
  } catch (error) {
    console.error("No se pudo registrar el reclamo", error);
    const invalid = error instanceof ApiError && error.status === 400;
    return {
      ok: false,
      error: invalid
        ? "Revisa los datos del formulario: hay algún campo incompleto o con un formato no válido."
        : "No pudimos registrar tu reclamo. Inténtalo de nuevo en unos minutos.",
    };
  }
}

export type TrackResult =
  | {
      ok: true;
      complaintNumber: string;
      createdAt: string;
      status: ComplaintStatus;
      providerResponse: string | null;
      responseDate: string | null;
    }
  | { ok: false; error: string };

// Devuelve solo el estado y la respuesta, nunca los datos personales del consumidor.
// Además, solo muestra reclamos de este negocio: la API busca el número en toda la plataforma.
export async function trackComplaint(businessId: string, complaintNumber: string): Promise<TrackResult> {
  const notFound: TrackResult = { ok: false, error: "No encontramos un reclamo con ese número en este negocio." };
  const number = complaintNumber.trim();
  if (!/^\d{4}-\d{6}$/.test(number)) {
    return { ok: false, error: "El número tiene el formato año-número, por ejemplo 2026-000001." };
  }

  try {
    const complaint = await getComplaintByNumber(number);
    if (complaint.business.id !== businessId) return notFound;
    return {
      ok: true,
      complaintNumber: complaint.complaintNumber,
      createdAt: complaint.createdAt,
      status: complaint.status,
      providerResponse: complaint.providerResponse,
      responseDate: complaint.responseDate,
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return notFound;
    console.error("No se pudo consultar el reclamo", error);
    return { ok: false, error: "No pudimos consultar el reclamo. Inténtalo de nuevo en unos minutos." };
  }
}
