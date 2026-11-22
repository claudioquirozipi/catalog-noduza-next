"use server";

import {
  ApiError,
  createComplaint,
  trackComplaintStatus,
  type ComplaintInput,
  type ComplaintStatusInfo,
} from "@/lib/api";

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

export type TrackResult = ({ ok: true } & ComplaintStatusInfo) | { ok: false; error: string };

// Consulta del consumidor: pide el número y su documento. La API solo devuelve el estado y la respuesta.
export async function trackComplaint(
  businessId: string,
  complaintNumber: string,
  consumerDocNumber: string,
): Promise<TrackResult> {
  const number = complaintNumber.trim();
  const doc = consumerDocNumber.trim();
  if (!/^\d{4}-\d{6}$/.test(number)) {
    return { ok: false, error: "El número tiene el formato año-número, por ejemplo 2026-000001." };
  }
  if (doc.length < 8) {
    return { ok: false, error: "Escribe el número de documento con el que registraste el reclamo." };
  }

  try {
    return { ok: true, ...(await trackComplaintStatus(businessId, number, doc)) };
  } catch (error) {
    // 404: el número no existe en este negocio o el documento no coincide (la API no dice cuál, a propósito).
    if (error instanceof ApiError && error.status === 404) {
      return { ok: false, error: "No encontramos un reclamo con ese número y documento en este negocio." };
    }
    console.error("No se pudo consultar el reclamo", error);
    return { ok: false, error: "No pudimos consultar el reclamo. Inténtalo de nuevo en unos minutos." };
  }
}
