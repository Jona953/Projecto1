# TaskFlow — Gestión de Tareas con Supabase

Aplicación web de gestión de tareas (to-do list) moderna y responsiva, con sincronización en la nube en tiempo real.

## 🔗 Demo Desplegada
> **URL:** *(actualizar después del deploy en Vercel)*

## 🛠️ Tecnologías
- **Frontend:** React 18 + TypeScript + Vite
- **Estilos:** Tailwind CSS v4
- **Base de datos / Auth / Realtime:** Supabase
- **Gráficas:** Recharts
- **Iconos:** Lucide React
- **Fechas:** date-fns
- **Deploy:** Vercel (conectado a GitHub)

## ✨ Funcionalidades
- 🔐 Registro e inicio de sesión con email/contraseña (Supabase Auth)
- ✅ CRUD completo de tareas (crear, ver, editar, eliminar, completar)
- ⚡ **Sincronización en tiempo real** via Supabase Realtime (Postgres Changes)
- 🏷️ Categorías con colores personalizados (Trabajo, Personal, Estudio, etc.)
- 📅 Fechas de vencimiento con alertas de tareas vencidas
- ⚡ Prioridades: Alta / Media / Baja
- 🔍 Búsqueda y filtros por estado, prioridad y categoría
- 📊 Dashboard con estadísticas, gráficas de actividad y distribución por categoría
- 🎮 Gamificación: XP, niveles y badges por completar tareas
- 🌙 Modo oscuro/claro persistente
- 📱 Diseño totalmente responsivo (mobile, tablet, desktop)

## 🗄️ Esquema SQL (ejecutar en Supabase SQL Editor)

```sql
-- Tabla de perfiles de usuario
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users,
  username text,
  xp integer DEFAULT 0,
  level integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Tabla de categorías
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  color text DEFAULT '#6366f1',
  created_at timestamptz DEFAULT now()
);

-- Tabla principal de tareas
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  description text,
  completed boolean DEFAULT false,
  priority text DEFAULT 'medium',
  category_id uuid REFERENCES categories(id),
  due_date date,
  created_at timestamptz DEFAULT now()
);

-- Row Level Security (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own tasks" ON tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own categories" ON categories FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own profile" ON profiles FOR ALL USING (auth.uid() = id);

-- Activar realtime
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE categories;
```

## 🔑 Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

> ⚠️ Nunca subas el `.env.local` a GitHub. Está incluido en `.gitignore`.  
> Para Vercel, configura estas variables en **Settings → Environment Variables**.

## 🚀 Ejecutar Localmente

```bash
git clone https://github.com/tu-usuario/task-manager.git
cd task-manager
npm install
cp .env.example .env.local   # edita con tus credenciales de Supabase
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── layout/     AppLayout, Sidebar, Header
│   └── tasks/      TaskCard, AddTaskModal, EditTaskModal, FilterBar
├── contexts/       AuthContext, TasksContext, ThemeContext
├── lib/            supabase.ts (cliente)
├── pages/          LoginPage, RegisterPage, DashboardPage, TasksPage, CategoriesPage
└── types/          index.ts
```

## 📝 Commits Sugeridos
- `Inicial: Configuración de Vite + React + TypeScript + Tailwind`
- `Agregado: Cliente Supabase y esquema de base de datos`
- `Agregado: Autenticación con registro y login`
- `Agregado: CRUD de tareas con realtime subscription`
- `Agregado: Dashboard con estadísticas y gráficas`
- `Agregado: Gamificación con XP, niveles y badges`
- `Agregado: Categorías, prioridades y fechas de vencimiento`
- `Completado: Deploy en Vercel`
