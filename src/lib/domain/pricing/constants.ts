import type { Addon, Service } from "./types";

export const SERVICES: readonly Service[] = [
  {
    basePriceMaintenance: 2500,
    basePriceNew: 3500,
    description: "Limpieza, forma, cutículas y esmaltado",
    durationMaintenance: 45,
    durationNew: 60,
    id: "manicura",
    name: "Manicura clásica",
  },
  {
    basePriceMaintenance: 3200,
    basePriceNew: 4500,
    description: "Exfoliación, hidratación, forma y esmaltado",
    durationMaintenance: 60,
    durationNew: 90,
    id: "pedicura",
    name: "Pedicura completa",
  },
  {
    basePriceMaintenance: 4500,
    basePriceNew: 8000,
    description: "Extensión con acrílico, diseño incluido",
    durationMaintenance: 60,
    durationNew: 120,
    id: "acrilicas",
    name: "Uñas acrílicas",
  },
  {
    basePriceMaintenance: 4000,
    basePriceNew: 7000,
    description: "Gel semipermanente con dureza extra",
    durationMaintenance: 60,
    durationNew: 90,
    id: "gel",
    name: "Uñas en gel",
  },
  {
    basePriceMaintenance: 2200,
    basePriceNew: 3000,
    description: "Esmaltado que dura hasta 3 semanas",
    durationMaintenance: 30,
    durationNew: 45,
    id: "esmaltado",
    name: "Esmaltado semipermanente",
  },
] as const;

export const ADDONS: readonly Addon[] = [
  {
    duration: 20,
    id: "diseno",
    name: "Diseño artístico",
    price: 800,
  },
  {
    duration: 25,
    id: "decoracion",
    name: "Decoración con piedras",
    price: 1200,
  },
  {
    duration: 10,
    id: "reforzado",
    name: "Reforzado extra",
    price: 500,
  },
  {
    duration: 5,
    id: "reparacion",
    name: "Reparación de uña",
    price: 300,
  },
  {
    duration: 15,
    id: "retiro",
    name: "Retiro de esmaltado anterior",
    price: 400,
  },
] as const;