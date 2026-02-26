# INFORME — TaskFlow: Aplicación Web de Gestión de Tareas

## 1. Descripción del Proyecto

**TaskFlow** es una aplicación web full-stack de gestión de tareas (to-do list) moderna y responsiva, desarrollada con React + TypeScript y conectada a Supabase como backend serverless. Permite registrar usuarios, gestionar tareas con categorías y prioridades, y mantiene sincronización en tiempo real entre dispositivos.

---

## 2. Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────┐
│                    CLIENTE (SPA)                     │
│  React 18 + TypeScript + Vite + Tailwind CSS v4      │
│                                                      │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │  AuthContext│  │ TasksContext │  │ThemeContext  │ │
│  │  (sesión)   │  │ (CRUD+RT)    │  │(dark/light)  │ │
│  └─────────────┘  └──────────────┘  └─────────────┘ │
│                                                      │
│  Páginas: Dashboard | Tareas | Categorías | Auth     │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS / WebSocket
                       ▼
┌─────────────────────────────────────────────────────┐
│                 SUPABASE (BaaS)                      │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │     Auth    │  │  PostgreSQL  │  │   Realtime  │ │
│  │ (JWT tokens)│  │ tasks/cats/  │  │ (Postgres   │ │
│  │             │  │ profiles+RLS │  │  Changes)   │ │
│  └─────────────┘  └──────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────┘
                       │ Git push
                       ▼
              ┌─────────────────┐
              │     VERCEL      │
              │  (Deploy auto   │
              │   desde GitHub) │
              └─────────────────┘
```

---

## 3. Sincronización en Tiempo Real

Se usa **Supabase Realtime** basado en **Postgres Changes** (replicación lógica). Al iniciar sesión, `TasksContext` abre un canal WebSocket que escucha cambios `INSERT`, `UPDATE` y `DELETE` en la tabla `tasks` filtrados por `user_id`. Cada evento actualiza el estado de React directamente, sin necesidad de hacer re-fetch. Esto garantiza que si el usuario abre la app en dos pestañas o dispositivos, los cambios se propagan automáticamente en ambos en menos de 1 segundo.

```ts
// Extracto de TasksContext.tsx
const channel = supabase
  .channel('tasks-realtime')
  .on('postgres_changes', {
    event: 'INSERT', schema: 'public', table: 'tasks',
    filter: `user_id=eq.${user.id}`
  }, (payload) => {
    setTasks(prev => [payload.new as Task, ...prev]);
  })
  // ... UPDATE y DELETE similares
  .subscribe();
```

---

## 4. Funcionalidades Adicionales Implementadas

| Funcionalidad | Descripción |
|---|---|
| **Dashboard con estadísticas** | 4 tarjetas (total/pendientes/completadas/vencidas), anillo de porcentaje completado, gráfica de barras (actividad 7 días), pie chart por categoría |
| **Gamificación** | +10 XP por cada tarea completada, niveles cada 100 XP, 4 badges desbloqueables (Primer Paso, En Racha, Centurión, Maestro) |
| **Categorías con colores** | Gestión completa de categorías con picker de color, 3 presets (Trabajo, Personal, Estudio) |
| **Fechas de vencimiento** | Date picker, tareas vencidas resaltadas en rojo |
| **Prioridades** | Alta (rojo), Media (ámbar), Baja (verde) con badges visuales |
| **Filtros y búsqueda** | Filtrar por estado, prioridad, categoría; búsqueda por texto en título/descripción |
| **Modo oscuro/claro** | Toggle persistente en localStorage, diseño optimizado para dark mode |

---

## 5. Seguridad: Row Level Security (RLS)

Supabase implementa RLS en PostgreSQL. Las políticas garantizan que cada usuario solo puede leer y modificar sus propios datos:

```sql
CREATE POLICY "Users own tasks" ON tasks
  FOR ALL USING (auth.uid() = user_id);
```

Las claves de Supabase se manejan como variables de entorno (`VITE_SUPABASE_*`) y nunca se incluyen en el código fuente.

---

## 6. Responsividad

- **Mobile (< 768px):** Sidebar se convierte en drawer con overlay, botones redimensionados
- **Tablet (768px–1024px):** Layout adaptativo con grid de 2 columnas
- **Desktop (> 1024px):** Sidebar fijo de 256px, contenido a max-width

---

## 7. Capturas de Pantalla

> *(Agregar después del deploy: pantallas de Dashboard, Tareas, y Login en mobile y desktop)*

---

## 8. Dificultades y Soluciones

| Dificultad | Solución |
|---|---|
| Realtime no actualizaba categorías | Se recargó el canal y se añadió filtro por `user_id` en el channel |
| PowerShell bloqueaba scripts npm | Se ejecutó con `cmd /c "npm ..."` como workaround |
| Tailwind v4 requiere config diferente | Se usó `@tailwindcss/vite` plugin en lugar de PostCSS y `@import "tailwindcss"` |
| Modo oscuro inconsistente con Tailwind v4 | Se usó `@custom-variant dark` para forzar class strategy |
