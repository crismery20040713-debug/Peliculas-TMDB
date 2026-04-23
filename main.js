// Configuraciones para imágenes (TMDB las usa incluso para archivos locales)
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

let currentPage = 1;

/**
 * CONFIGURACIÓN PARA JSON LOCAL
 * CineWave - Catálogo de Películas
 */

// 1. Cargar las películas al iniciar
document.addEventListener('DOMContentLoaded', () => {
    fetchMovies();
});

// 2. Función principal para obtener datos del JSON
async function fetchMovies() {
    const grid = document.getElementById('moviesGrid');
    try {
        // Ahora cargamos el package.json
        const response = await fetch('/package.json');
        if (!response.ok) throw new Error("No se pudo cargar el archivo");

        const data = await response.json();
        
        // Accedemos a la propiedad donde guardamos las películas
        displayMovies(data.moviesData.results);
        
    } catch (error) {
        console.error("Error:", error);
    }
}
// 3. Función para renderizar las tarjetas en el HTML
function displayMovies(movies) {
    const grid = document.getElementById('moviesGrid');
    grid.innerHTML = ''; // Limpiar el contenedor

    if (movies.length === 0) {
        grid.innerHTML = '<p class="text-center w-100">No se encontraron películas.</p>';
        return;
    }

    movies.forEach(movie => {
        // Verificamos si la imagen es una URL completa o solo una ruta de TMDB
        const posterUrl = movie.poster_path;
           
        const cardHTML = `
        <div class="col">
            <div class="card h-100 shadow">
                <img src="${posterUrl}" 
                     class="card-img-top" 
                     alt="${movie.title}" 
                     style="height: 400px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title text-warning">${movie.title}</h5>
                    <span class="badge bg-dark text-warning border border-warning mb-2">⭐ ${movie.vote_average}</span>
                    <p class="card-text text-secondary small">${movie.overview.substring(0, 100)}...</p>
                </div>
            </div>
        </div>
    `;
    grid.innerHTML += cardHTML;
});
}

// 4. Lógica de Búsqueda Dinámica (Filtrado en tiempo real)
document.getElementById('searchInput').addEventListener('input', async (e) => {
    const query = e.target.value.toLowerCase();
    
    try {
        const response = await fetch('peliculas.json');
        const data = await response.json();
        
        // Filtramos el arreglo basado en el título
        const filteredMovies = data.results.filter(movie => 
            movie.title.toLowerCase().includes(query)
        );
        
        displayMovies(filteredMovies);
    } catch (error) {
        console.error("Error al buscar:", error);
    }
});