# TaskFlow — Gestión de Tareas Inteligente

TaskFlow es una aplicación de gestión de tareas (To-Do List) moderna que utiliza **Supabase** para el almacenamiento y autenticación, y cuenta con un sistema de **gamificación** para incentivar la productividad.

## 🔗 Enlaces del Proyecto
- **Repositorio GitHub:** [https://github.com/Jona953/Projecto1](https://github.com/Jona953/Projecto1)
- **Demo en Vercel:** *(Inserta aquí tu URL de Vercel)*

## ✨ Características Principales
- 🔐 **Autenticación:** Sistema de registro e inicio de sesión seguro.
- ⚡ **Tiempo Real:** Las tareas se sincronizan instantáneamente en todos tus dispositivos.
- 📊 **Dashboard:** Gráficas de rendimiento y estadísticas de tareas completadas.
- 🎮 **Gamificación:** Gana XP y sube de nivel al completar tus actividades.
- 🏷️ **Categorización:** Organiza tareas por etiquetas de colores.
- 🌙 **Modo Oscuro:** Interfaz estética y moderna pensada en la salud visual.

## 🛠️ Instalación y Configuración Local

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/Jona953/Projecto1.git
    cd Projecto1
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno:**
    Crea un archivo `.env.local` con tus llaves de Supabase:
    ```env
    VITE_SUPABASE_URL=tu_url_aqui
    VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
    ```

4.  **Iniciar servidor de desarrollo:**
    ```bash
    npm run dev
    ```

## 🗄️ Base de Datos (SQL)
Para que la aplicación funcione, ejecuta el código SQL que se encuentra en la sección 3 del archivo [INFORME.md](./INFORME.md) dentro del **SQL Editor** de tu proyecto en Supabase.

## 📄 Documentación Técnica
Para una explicación detallada de la arquitectura, diagrama de base de datos y diseño, consulta el archivo:
👉 **[INFORME.md](./INFORME.md)**
