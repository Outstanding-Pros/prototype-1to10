import data from "@/data/dummy-customers.json";

type BaseCustomer = (typeof data)[number];

export type Task = {
  name: string;
  priority: "high" | "medium" | "low";
  startDay: number;
  endDay: number;
};

export type Customer = BaseCustomer & {
  measurementGaps?: { item: string; guide: string; time: string }[];
};

export function getCustomer(id?: string): Customer {
  if (id) {
    const found = data.find((c) => c.id === id);
    if (found) return found;
  }
  return data[0];
}
