# Backend API para GitHub

Este proyecto añade un backend ligero en Node.js pensado para desplegarse en Vercel y exponer endpoints que consultan la API de GitHub. Ideal para alimentar tu portafolio con información en vivo de tus repositorios.

## Requisitos

- Node.js 18 o superior (Vercel ya lo proporciona en sus funciones serverless).
- Una cuenta en [Vercel](https://vercel.com/).
- Un token personal de GitHub con permisos de lectura sobre repositorios públicos (`repo:status`, `public_repo`).

## Variables de entorno

Configura estas variables en Vercel (`Project Settings > Environment Variables`) o en un archivo `.env` local si usas `vercel dev`.

| Variable           | Descripción                                                                 |
| ------------------ | --------------------------------------------------------------------------- |
| `GITHUB_TOKEN`     | Token personal de GitHub usado para autenticación (recomendado).            |
| `GITHUB_USERNAME`  | Usuario de GitHub por defecto para las consultas (puede sobrescribirse vía query). |

> Si no defines `GITHUB_TOKEN`, las funciones seguirán funcionando para repositorios públicos pero estarás sujeto al límite de peticiones anónimas de GitHub (60 por hora).

## Scripts disponibles

- `npm install`: instala dependencias.
- `npm run dev`: levanta el entorno local usando `vercel dev`.
- `npm run deploy`: despliega el proyecto a producción (`vercel --prod`).

## Endpoints

Los endpoints viven en la carpeta `api/` (estilo Serverless Functions de Vercel).

### `GET /api/github/repos`

Devuelve una lista de repositorios públicos del usuario indicado.

**Parámetros de query opcionales**

- `username`: usuario de GitHub a consultar (por defecto `GITHUB_USERNAME`).
- `per_page`: número de repos (máx. 100).
- `sort`: criterio de orden (`created`, `updated`, `pushed`, `full_name`).
- `direction`: `asc` o `desc`.
- `include_forks`: `true` para incluir forks (por defecto `false`).
- `topic`: filtra repositorios que contengan el topic indicado.

**Respuesta**

```json
{
  "count": 3,
  "repositories": [
    {
      "id": 123,
      "name": "mi-repo",
      "html_url": "https://github.com/usuario/mi-repo",
      "...": "..."
    }
  ]
}
```

### `GET /api/github/repo`

Obtiene la información detallada de un repositorio concreto.

**Parámetros de query**

- `owner`: propietario del repo (por defecto `GITHUB_USERNAME`).
- `repo`: nombre del repositorio (obligatorio).

**Respuesta**

```json
{
  "id": 123,
  "name": "mi-repo",
  "stargazers_count": 42,
  "...": "..."
}
```

## Despliegue en Vercel

1. Instala la [CLI de Vercel](https://vercel.com/docs/cli) y ejecuta `vercel login`.
2. Desde la raíz del proyecto, corre `npm install`.
3. Ejecuta `vercel` para crear el proyecto (elige el scope y nombre). Selecciona la carpeta raíz actual y responde **Yes** cuando pregunte si deseas enlazarlo.
4. Configura las variables de entorno en el panel de Vercel y vuelve a desplegar con `npm run deploy` (o `vercel --prod`).

## Uso en el frontend

Puedes consumir estos endpoints desde tu aplicación estática (por ejemplo, el portafolio) usando `fetch`:

```javascript
fetch("/api/github/repos?per_page=8")
  .then((res) => res.json())
  .then((data) => {
    console.log(data.repositories);
  });
```

Recuerda que al desplegar en Vercel, las funciones se sirven desde el mismo dominio del proyecto, por lo que no necesitas configurar CORS extra.

