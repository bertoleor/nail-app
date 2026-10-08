# 24 - Spec-Driven Development (Gentleman-Grade)

## Principio Fundamental

Escribir código sin especificación es construir sin plano. Cada cambio significativo debe pasar por el workflow SDD antes de implementación.

---

## 1. Workflow SDD

```
proposal -> specs --> tasks -> apply -> verify -> archive
             ^
             |
           design
```

### Fases

| Fase      | Descripción                                   | Artifacto      |
| --------- | --------------------------------------------- | -------------- |
| `explore` | Investigar ideas, leer codebase               | Exploración    |
| `propose` | Crear propuesta de cambio                     | Proposal       |
| `spec`    | Especificar requisitos y escenarios           | Spec           |
| `design`  | Diseño técnico con decisiones de arquitectura | Design         |
| `tasks`   | Desglosar en tareas implementables            | Tasks          |
| `apply`   | Implementar código                            | Apply Progress |
| `verify`  | Validar contra specs                          | Verify Report  |
| `archive` | Cerrar cambio y persistir estado              | Archive Report |

## 2. Cuándo Usar SDD

- Nueva feature significativa
- Cambio arquitectónico
- Refactor mayor
- Integración de servicio externo

### Cuándo NO usar SDD

- Bug fix trivial
- Cambio de texto/copy
- Ajuste de estilo menor

## 3. Comandos

| Comando                 | Descripción                                     |
| ----------------------- | ----------------------------------------------- |
| `/sdd-new <change>`     | Iniciar nuevo cambio (explora + propone)        |
| `/sdd-continue`         | Continuar siguiente fase del DAG                |
| `/sdd-ff <name>`        | Fast-forward: proposal → specs → design → tasks |
| `/sdd-apply [change]`   | Implementar tareas                              |
| `/sdd-verify [change]`  | Validar implementación                          |
| `/sdd-archive [change]` | Cerrar cambio                                   |

---

## Reglas Relacionadas

Al planificar cambios, estas reglas son MANDATORIAS:

- **Rule 23**: Architecture Scope - Scope Rule
- **Rule 00**: Behavior - Delegación universal
