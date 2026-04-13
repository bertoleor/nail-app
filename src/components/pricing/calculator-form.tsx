"use client";

import { ServiceSelect } from "./service-select";
import { AddonList } from "./addon-list";
import { PriceSummary } from "./price-summary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CalculatorForm() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">Calculadora de Precios</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-4 sm:p-6">
        <ServiceSelect />
        <AddonList />
        <PriceSummary />
      </CardContent>
    </Card>
  );
}
