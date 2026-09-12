import type { Addon, Service } from "./types";

export const SERVICES: readonly Service[] = [
  {
    basePrice: 2500,
    duration: 60,
    id: "manicura",
    name: "Manicura clásica",
  },
  {
    basePrice: 3500,
    duration: 90,
    id: "pedicura",
    name: "Pedicura completa",
  },
  {
    basePrice: 5000,
    duration: 120,
    id: "acrilicas",
    name: "Uñas acrílicas",
  },
  {
    basePrice: 4500,
    duration: 90,
    id: "gel",
    name: "Uñas en gel",
  },
  {
    basePrice: 2000,
    duration: 45,
    id: "esmaltado",
    name: "Esmaltado semipermanente",
  },
] as const;

export const ADDONS: readonly Addon[] = [
  {
    duration: 15,
    id: "diseno",
    name: "Diseño artístico",
    price: 500,
  },
  {
    duration: 20,
    id: "decoracion",
    name: "Decoración con piedras",
    price: 800,
  },
  {
    duration: 10,
    id: "reforzado",
    name: "Reforzado extra",
    price: 300,
  },
  {
    duration: 5,
    id: "reparacion",
    name: "Reparación de uña",
    price: 200,
  },
] as const;
