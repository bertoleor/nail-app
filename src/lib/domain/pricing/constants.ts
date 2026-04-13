import type { Addon, Service } from "./types";

export const SERVICES: readonly Service[] = [
  {
    id: "manicura",
    name: "Manicura clásica",
    basePrice: 2500,
    duration: 60,
  },
  {
    id: "pedicura",
    name: "Pedicura completa",
    basePrice: 3500,
    duration: 90,
  },
  {
    id: "acrilicas",
    name: "Uñas acrílicas",
    basePrice: 5000,
    duration: 120,
  },
  {
    id: "gel",
    name: "Uñas en gel",
    basePrice: 4500,
    duration: 90,
  },
  {
    id: "esmaltado",
    name: "Esmaltado semipermanente",
    basePrice: 2000,
    duration: 45,
  },
] as const;

export const ADDONS: readonly Addon[] = [
  {
    id: "diseno",
    name: "Diseño artístico",
    price: 500,
    duration: 15,
  },
  {
    id: "decoracion",
    name: "Decoración con piedras",
    price: 800,
    duration: 20,
  },
  {
    id: "reforzado",
    name: "Reforzado extra",
    price: 300,
    duration: 10,
  },
  {
    id: "reparacion",
    name: "Reparación de uña",
    price: 200,
    duration: 5,
  },
] as const;
