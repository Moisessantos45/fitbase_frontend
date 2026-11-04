import type { BaseEntity } from "@/entities/generic";
import { getNumber, getString } from "./formatters";

const mapperGeneric = (data: Record<string, unknown>): BaseEntity => {
  return {
    id: getNumber(data.id),
    name: getString(data.name),
  };
};

export { mapperGeneric };
