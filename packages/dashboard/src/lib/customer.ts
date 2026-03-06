import dataKo from "@/data/dummy-customers.json";
import dataEn from "@/data/dummy-customers-en.json";

type BaseCustomer = (typeof dataKo)[number];

export type Task = {
  name: string;
  priority: "high" | "medium" | "low";
  startDay: number;
  endDay: number;
};

export type Customer = BaseCustomer & {
  measurementGaps?: { item: string; guide: string; time: string }[];
};

export function getCustomer(id?: string, language: string = "ko"): Customer {
  const data = language === "en" ? dataEn : dataKo;
  if (id) {
    const found = data.find((c) => c.id === id);
    if (found) return found as Customer;
  }
  return data[0] as Customer;
}
