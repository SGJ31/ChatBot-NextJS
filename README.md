# **Chatbot con Next.js**

## **Descripción**
Este proyecto es un chatbot simple que utiliza **Next.js** como framework y un archivo CSV para responder preguntas predefinidas. Está diseñado para ser fácil de usar y personalizar, permitiendo a los usuarios interactuar con el chatbot a través de una interfaz web simple.

## **Características**
- **Backend:** Utiliza un API Route de Next.js para manejar las preguntas.
- **Frontend:** Interfaz interactiva donde los usuarios pueden escribir sus preguntas.
- **Respuestas:** El chatbot responde a preguntas específicas definidas en un archivo CSV.
- **Tecnologías utilizadas:** Next.js, TailwindCSS, Papaparse, React Query.

## **Tecnologías**
- **Framework:** Next.js
- **Frontend:** React, TailwindCSS
- **Backend:** Next.js API Routes
- **Librerías adicionales:** Papaparse (para leer el archivo CSV), React Query (para manejo de estado)
- **Base de datos:** Archivo CSV para almacenar preguntas y respuestas.

## **Instalación**

### 1. Clona el repositorio
```bash
git clone https://github.com/tu-usuario/chatbot-nextjs.git
```

### 2. Navega al directorio del proyecto
```bash
cd chatbot-nextjs 
```

### 3. Instala las dependencias
```bash	
npm install
```

### 4. Configura TailwindCSS
Si es la primera vez que usas TailwindCSS, puedes inicializar su configuración ejecutando:
```bash
npx tailwindcss init -p
```

Luego, asegurate de agregar las reglas de TailwindCSS en el archivo global.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 5. Ejecuta el proyecto
Para iniciar el servidor en modo de desarrollo:
```bash
npm run dev
```
El proyecto estará disponible en http://localhost:3000.



## **Estructura del Proyecto**
```bash
/src
  /app
    /api/chatbot/route.ts    → Endpoint que maneja las preguntas.
    /page.tsx                → Componente principal de la interfaz.
    /layout.tsx              → Estructura de la página.
  /styles
    /globals.css             → Configuración de TailwindCSS.
  
/public
  /data.csv                  → Archivo CSV con las preguntas y respuestas.

tailwind.config.js           → Configuración de TailwindCSS.
```

## **Como Funciona**

1. El usuario escribe una pregunta en la interfaz del chatbot.
2. La pregunta es enviada al backend a través de un API Route.
3. El backend busca la pregunta en el archivo CSV.
4. Si la pregunta es encontrada, se devuelve la respuesta correspondiente.
5. Si no se encuentra la pregunta, el chatbot responde con un mensaje genérico: "Lo siento, no tengo esa información."


## **Agregar Más Preguntas**

Para agregar nuevas preguntas y respuestas:

1. Abre el archivo public/data.csv.
2. Añade una nueva fila con el formato:

```bash
Pregunta,Respuesta
```

3. Guarda el archivo y recarga la página para probar las nuevas preguntas.


## **Futuras Mejoras**
- **Mejorar las búsquedas:** Implementar una búsqueda más flexible usando procesamiento de lenguaje natural.
- **Base de datos:** Conectar el chatbot a una base de datos como MongoDB o PostgreSQL.
- **Integración NLP:** Integrar una librería de procesamiento de lenguaje natural para preguntas más complejas.


