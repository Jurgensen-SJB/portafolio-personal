// Configuración personalizable para la sección de proyectos de GitHub.
// Edita estas listas para controlar qué usuarios y repositorios se mostrarán.
// - `users`: lista de usuarios/organizaciones desde donde se obtendrán repos públicos.
// - `include`: lista de repositorios específicos (owner/repo) que se deben mostrar.
// - `exclude`: lista de repositorios específicos (owner/repo) que se deben ocultar.
// - `limit`: cantidad máxima de proyectos a mostrar (usa "all" para sin límite).
// - `sort`: criterio de orden para la API de GitHub (por ejemplo, "updated" o "pushed").
//
// Si prefieres usar los atributos data-* en el HTML, puedes dejar estas listas vacías.
// Las configuraciones desde data-* y esta variable se combinan, dando prioridad a los
// repositorios que declares aquí en `include`.

window.GITHUB_PROJECTS_CONFIG = {
  users: ['Basilik06', 'Jurgensen-SJB'],
  include: [
    // 'Basilik06/mi-proyecto-destacado',
  ],
  exclude: [
    'Basilik06/inventario',
    'Basilik06/agencia-de-viajes',
  ],
  limit: 6,
  sort: 'updated'
};

