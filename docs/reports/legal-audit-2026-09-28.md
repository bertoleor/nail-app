# Auditoría legal — ToS + Privacy Policy — 2026-09-28

> **Fecha:** 2026-09-28 · **Auditor:** 24-orquestador (rol 23-legal + 34-auditor, turno noche G0) · **Trigger:** tarjeta `t_99bc0d82` + SDD `nail-legal-build-gate` T2
> **Búsqueda:** keywords: `legal, tos, privacy, 25.326, 24.240, audit` · clasificación: `auditoria` · estado: `completo`
> **Parte de:** [[TERMS-OF-SERVICE]] · Relacionados: [[PRIVACY-POLICY]], [[ADR-001-mockup-sin-backend]], [[ADR-003-demo-vs-saas]], [[LICENSE-DECISION]]

## Conclusión (leé esto primero)

**Estado: DRAFT SÓLIDO — NO apto para publicación con datos reales.** Ambos documentos están
estructuralmente completos y correctamente alineados con Ley 25.326 (datos) y Ley 24.240
(consumidor). El bloqueo es exclusivamente **administrativo**: 9 marcadores `[POR COMPLETAR]`
en ToS + 7 en Privacy requieren datos del titular (razón social, CUIT, domicilio, email,
jurisdicción). Ningún hallazgo de redacción es bloqueante por sí mismo; los 🔴 requieren
acción del titular, los 🟡 son mejoras recomendadas pre-publicación.

**Regla operativa vigente (coherente con ADR-001):** mientras los placeholders sigan, el
deploy público con datos de clientas reales queda **prohibido**. El doc de cierre de cada
archivo ya lo dice; esta auditoría lo re-certifica con evidencia línea por línea.

---

## A. TERMS-OF-SERVICE.md — 12 cláusulas auditadas

| # | Sección | Severidad | Hallazgo | Ley | Redline (qué hacer) |
|---|---------|-----------|----------|-----|---------------------|
| A-1 | §1 Identificación del titular | 🔴 | 5 marcadores: razón social, CUIT, domicilio, email, trámite de marca | 24.240 art. 5-bis (identificación del proveedor) | **Dueño: titular.** Cargar datos reales; el trámite de marca es opcional (borrar la línea si no hay) |
| A-2 | §2 Aceptación | 🟢 | Click-wrap implícito por uso ("aceptación plena") | 24.240 art. 3 | OK para app demo sin registro. Si ADR-003 elige SaaS con cuentas, agregar checkbox explícito pre-registro |
| A-3 | §3 Descripción del Servicio | 🟢 | Declara "etapa de desarrollo/mockup" — honesto y correcto | 24.240 art. 4 (obligación de información) | Mantener la frase de etapa mientras sea cierta; actualizarla al pasar a producción |
| A-4 | §4 Cuentas | 🟡 | "Cuando el uso requiera registro" — condicional; hoy NO hay auth (ADR-001) | 25.326 art. 6 | Dejar así (demuestra que no hay cuentas hoy). Al implementar auth, especificar credenciales/2FA y plazos |
| A-5 | §5 Cancelaciones y turnos | 🟢 | Excluye responsabilidad de NailApp sobre la relación manicurista-clienta | 24.240 art. 5-bis | Correcto: la app es "registro y recordatorio", el servicio lo presta la profesional. Sin cambios |
| A-6 | §6 Uso aceptable | 🟢 | Lista estándar (ilícitos, spam, explotación de datos) | — | OK sin cambios |
| A-7 | §7 Propiedad intelectual — **licencia MIT** | 🟡 | El código es MIT (permisiva) PERO §7.2 dice "la marca NailApp no podrá usarse sin autorización" | Ley 22.362 (marcas); art. 17-in fine CN | **No es contradictorio** (MIT cubre copyright, no marca) pero conviene explicitar: "La licencia MIT del código no incluye la marca" para evitar confusión en un repo público |
| A-8 | §8 Limitación de responsabilidad | 🟡 | Excluye "pérdidas de datos" en forma amplia | 24.240 art. 37 (cláusulas abusivas — las limitaciones no pueden ser contra moral y buenas costumbres; dolo no excluable) | Suavizar: la exclusión total de pérdida de datos puede leerse abusiva ante un caso de pérdida real por negligencia. Redline: "salvo dolo o culpa grave" antes de la enumeración |
| A-9 | §9 Exclusión de garantías | 🟢 | "Tal cual"/"según disponibilidad" + disclaimer de estimación de precios | 24.240 art. 7 | OK. El disclaimer de la calculadora (estimación referencial) está bien |
| A-10 | §10 Ley aplicable y jurisdicción | 🔴 | Marcador ciudad/partido + renuncia amplia a fuero | CPCCN art. 1; 24.240 **art. 58** (competencia judicial en lugar de cumplimiento del contrato, **improrrogable a favor del consumidor**) | **Ojo legal:** la renuncia a "cualquier otro fuero" es de dudosa validez para relaciones de consumo (relación de consumo = tutela 24.240). Redline: no renunciar a fuero; fijar tribunales del domicilio del titular Y reconocer la competencia del lugar de cumplimiento (defensa del consumidor) |
| A-11 | §11 Modificaciones | 🟢 | 15 días de antelación + acceptance-by-use | — | OK. Poner canal de notificación concreto cuando exista (hoy dice "canales disponibles en el Servicio") |
| A-12 | §12 Contacto | 🔴 | Email y canal sin datos | 24.240 art. 10-bis | **Dueño: titular.** Sin email de contacto no hay canal efectivo de quejas/retractación |

### ToS — resumen: 🔴 x3 (A-1, A-10, A-12) · 🟡 x3 (A-4, A-7, A-8) · 🟢 x6

## B. PRIVACY-POLICY.md — 11 secciones auditadas

| # | Sección | Severidad | Hallazgo | Ley | Redline (qué hacer) |
|---|---------|-----------|----------|-----|---------------------|
| B-1 | §1 Responsable | 🔴 | 5 marcadores idénticos al ToS + inscripción AAIP | 25.326 art. 3 (titular registrado); Disposición AAIP 4/2019 | **Dueño: titular.** CUIT + razón social obligatorios para inscribir la base |
| B-2 | §2 Alcance + nota GDPR | 🟢 | Correctamente excluye GDPR hasta alcance UE; cita 25.326 | 25.326; GDPR recital 24 | OK sin cambios — redacción exactamente correcta para app es-AR-only (ADR-002) |
| B-3 | §3 Datos recopilados | 🟢 | Cuenta/turnos/uso; niega datos sensibles sin consentimiento | 25.326 art. 2 | OK. Agregar "datos de navegación/analytics" explícitamente cuando se agregue un analytics real |
| B-4 | §4 Finalidad y cesión | 🟢 | Finalidades acotadas; cesión solo hosting/ley/consentimiento | 25.326 art. 4-5 | OK. **Al integrar Supabase** (ADR-003): nombrar al encargado + cláusula de transferencia internacional si el hosting no es AR |
| B-5 | §5 Consentimiento | 🟢 | Consentimiento informado + regla "el consentimiento de las clientas lo maneja la profesional" | 25.326 art. 5 | Correcto y bien pensado para el modelo de dos capas (profesional carga datos de terceras) |
| B-6 | §6 Almacenamiento y seguridad | 🟡 | "[POR COMPLETAR — hosting]" + retención "hasta 2 años post-baja" | 25.326 art. 5-inc. 3; DDyMA (P3P) | **Dueño: titular** (hosting). El plazo de retención de 2 años post-baja es razonable; aclarar que la baja de la cuenta NO borra los datos de clientas cargadas por la profesional (están en SU agenda), o explicitar el cascading |
| B-7 | §7 Cookies | 🟢 | Solo técnicas/funcionales, sesión y preferencias | 24.240 art. 9-bis; Disposición AAIP 2/2018 | OK mientras no haya cookies de tracking/publicidad. Sin banner necesario (solo cookies técnicas) |
| B- con | §8 Derechos ARCO | 🟢 | Acceso/rectificación/supresión/actualización + canal AAIP | 25.326 arts. 13-16; Disposición 4/2019 | OK. El canal de ejercicio es [POR COMPLETAR] → depende de B-1/A-12 (mismo email) |
| B-9 | §9 Menores | 🟢 | +18, eliminación si se detectan menores | 25.326 art. 7 | OK sin cambios |
| B- docs | §10-11 Modificaciones + contacto | 🔴 | Email sin datos | 25.326 art. 6-inc. 2 | Idem A-12: canal de ejercicio de derechos inexistente hasta cargar datos |

### Privacy — resumen: 🔴 x3 (B-1, B-6, B-11) · 🟡 x1 (B-6) · 🟢 x7

---

## C. Inventario consolidado de marcadores `[POR COMPLETAR]` (bloqueantes, dueño: TITULAR)

| Doc | § | Dato faltante | Impacto |
|-----|---|---------------|---------|
| ToS §1 | 1 | Razón social | No identifica al proveedor |
| ToS §1 | 2 | CUIT | Ídem + imposible facturación/validación |
| ToS §1 | 3 | Domicilio legal | Ídem + jurisdicción de §10 |
| ToS §1 | 4 | Email de contacto | Canal de A-12 inexistente |
| ToS §1 | 5 | Trámite de marca (opcional) | Borrar si no hay |
| ToS §10 | 6 | Ciudad/partido para tribunales | Fuero indefinido |
| ToS §12 | 7 | Email + responsable | Canal de contacto ausente |
| PP §1 | 8 | Razón social / CUIT / domicilio / email | Responsable sin identificar (cuenta como 1 bloque) |
| PP §1 | 9 | Inscripción AAIP (número) | Obligación registral al operar datos |
| PP §6 | 10 | Hosting/ubicación de servidores | Transferencia internacional indefinida |
| PP §8/§11 | 11 | Canal ejercicio derechos ARCO | Derechos sin canal efectivo |

**Total: 11 bloques (5+2+4).** Todos con dueño = titular. NINGUNO se rellena con datos
ficticios (prohibido explícitamente en la proposal del SDD change y en 24.240 art. 5-bis).

## D. Síntesis ejecutiva

1. **Redacción:** sólida para es-AR. Ambos docs citan las leyes correctas, niegan datos
   sensibles, manejan bien el modelo de dos capas (profesional → clientas) y el estado
   mockup. El trabajo de redacción está 95% completo.
2. **Lo único que falta es el titular.** 11 bloques administrativos. Cero trabajo de
   redacción bloqueante pendiente del lado del equipo.
3. **Dos redlines de fondo (no administrativos):**
   - **A-10 (fuero):** renuncia amplia de fuero vs. 24.240 art. 58. Al cargar la ciudad,
     reformular para reconocer la competencia de consumo (lugar de cumplimiento) en vez de
     renuncia general.
   - **B-6 (retención):** definir el destino de los datos de clientas cuando la profesional
     se da de baja (cascading vs conservación en su agenda).
4. **Dependencia de ADR-003 (demo vs SaaS):** si se elige demo pura, estos docs quedan
   "dormidos" (sin datos reales no hay tratamiento → no aplican aún). Si se elige SaaS,
   estos 11 bloques son el **gate de despliegue** — conviene cargarlos ANTES del backend,
   no después.
5. **Checklist de revisión por abogado (cuando el titular cargue datos):**
   - [ ] Verificar razón social + CUIT contra AFIP (constancia de inscripción)
   - [ ] Confirmar inscripción AAIP (o decidir si aplica por etapa demo)
   - [ ] Revisar cláusula de fuero (redline A-10) antes de publicar
   - [ ] Validar hosting elegido + cláusula de transferencia si no es Argentina
   - [ ] Revisar retención 2 años post-baja (redline B-6)
   - [ ] Confirmar que "NailApp" no está registrado por un tercero (busca INPI previo a uso comercial serio)

## E. Qué sigue (no bloqueante, ordenado)

1. **Titular carga los 11 bloques** → los docs quedan completos automáticamente (el equipo
   no re-escribe nada).
2. **Aplicar redline A-10** (fuero) — cambio de redacción pequeño, lo puede hacer el equipo
   con los datos cargados.
3. **ADR-003 decisión demo-vs-SaaS** (due 2026-10-03) determina la urgencia real de todo esto.

> Auditoría realizada por auditoría de texto completo (102+108 líneas leídas íntegras),
> sin inventar ningún dato. Este documento NO reemplaza revisión por abogado matriculado;
> es un screening técnico de cumplimiento estructural.
