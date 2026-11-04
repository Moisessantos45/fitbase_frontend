import { isAxiosError } from "axios";

export const errorHandler = (
  error: unknown,
): { msg: string; status: number | undefined; code?: string } => {
  if (isAxiosError(error)) {
    const serverMessage = error.response?.data?.message;
    const serverCode = error.response?.data?.code;
    const errorDetails = serializeToJson<string>(
      error.response?.data?.errors,
      [],
    );

    if (serverCode === "VALIDATION_ERROR" && errorDetails.length > 0) {
      return {
        msg: `Error de validación: ${errorDetails.join(", ")}`,
        status: error.response?.status,
        code: serverCode,
      };
    }

    if (serverMessage)
      return {
        msg: serverMessage,
        status: error.response?.status,
        code: serverCode,
      };

    if (error.response?.status === 400) {
      return {
        msg: "Datos inválidos. Verifica los campos.",
        status: error.response?.status,
        code: serverCode,
      };
    }

    if (error.response?.status === 401) {
      return {
        msg: "No autorizado. Verifica tu sesión.",
        status: error.response?.status,
        code: serverCode,
      };
    }

    return {
      msg: error.message || "Error del servidor",
      status: error.response?.status,
      code: serverCode,
    };
  }

  return {
    msg: error instanceof Error ? error.message : "Error desconocido",
    status: 500,
    code: "UNKNOWN_ERROR",
  };
};