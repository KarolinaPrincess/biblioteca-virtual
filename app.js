document.addEventListener('DOMContentLoaded', async function () {
  const booksContainer = document.getElementById('books-container');
  const bookDetails = document.getElementById('book-details');
  let catalogoCompleto = {};
  const navItems = document.querySelectorAll('.navbar-link');

  // Cargar catálogo desde books.json
  try {
    const res = await fetch('books.json');
    catalogoCompleto = await res.json();
    const literaturaLink = document.querySelector('.navbar-link[data-category="literatura"]');
    if (literaturaLink) {
      literaturaLink.classList.add('active');
    }
    mostrarLibrosPorCategoria('literatura'); 
  } catch (error) {
    console.error('Error al cargar el catálogo:', error);
    booksContainer.innerHTML = '<p>No se pudo cargar el catálogo.</p>';
  }

  // Manejar clics del menú
  navItems.forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault(); 
      navItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');

      const categoria = this.getAttribute('data-category');
      mostrarLibrosPorCategoria(categoria);
    });
  });

  // Función para mostrar libros
function mostrarLibrosPorCategoria(categoria) {
  const libros = catalogoCompleto[categoria] || [];
  mostrarLibrosEnPantalla(libros);
}

  // Mostrar detalles del libro seleccionado
  function mostrarDetalleLibro(libro) {
  const bookDetails = document.getElementById('book-details');
  bookDetails.innerHTML = `
    <h2>${libro.titulo}</h2>
    <span class="author">Autor: ${libro.autor}</span>
    <p class="synopsis"><strong>Sinopsis:</strong> ${libro.sinopsis}</p>
    <p class="description">${libro.descripcion_autor}</p>
    <p class="description">Publicado ${libro.publicado}</p>
    <p class="description">Paginas ${libro.paginas}</p>
    <p class="description">Genero ${libro.genero}</p>
   
  `;
}

// Dentro de DOMContentLoaded, después de cargar el catálogo y configurar eventos del menú

const searchInput = document.querySelector('.search-input');

searchInput.addEventListener('input', function () {
  const searchTerm = this.value.toLowerCase().trim();

  // Obtener categoría activa actual
  const activeNavItem = document.querySelector('.navbar-link.active');
  const categoriaActual = activeNavItem ? activeNavItem.getAttribute('data-category') : 'literatura';

  // Filtrar libros por título o autor
  const librosFiltrados = catalogoCompleto[categoriaActual]?.filter(libro =>
    libro.titulo.toLowerCase().includes(searchTerm) ||
    libro.autor.toLowerCase().includes(searchTerm)
  ) || [];

  mostrarLibrosEnPantalla(librosFiltrados);
});

function mostrarLibrosEnPantalla(libros) {
  const scrollTop = window.scrollY;

  const container = document.getElementById('books-container');
  container.classList.add('fading-out');

  requestAnimationFrame(() => {
    setTimeout(() => {
      container.innerHTML = '';
      if (!libros.length) {
        container.innerHTML = '<p>No se encontraron libros que coincidan con la búsqueda.</p>';
      } else {
        const fragment = document.createDocumentFragment();
        libros.forEach(libro => {
          const card = document.createElement('div');
          card.className = 'book-card';
          card.innerHTML = `
            <h3>${libro.titulo}</h3>  
            <a href="${libro.enlace}" target="_blank" class="book-link">Descargar libro</a>
          `;
          
          card.style.cursor = 'pointer';
          card.addEventListener('click', () => mostrarDetalleLibro(libro));
          fragment.appendChild(card);
        });
        container.appendChild(fragment);
      }

      container.classList.remove('fading-out');
      window.scrollTo({ top: scrollTop, behavior: 'auto' });
    }, 300); // Coincide con el tiempo de transición CSS
  });
}
});