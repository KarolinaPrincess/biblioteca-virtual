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
    const scrollTop = window.scrollY;

    const container = document.getElementById('books-container');
    container.classList.add('fading-out');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        container.innerHTML = '';

        if (!libros.length) {
          container.innerHTML = '<p>No hay libros disponibles en esta categoría.</p>';
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
      });
    });
  }

  // Mostrar detalles del libro seleccionado
  function mostrarDetalleLibro(libro) {
    const bookDetails = document.getElementById('book-details');
    bookDetails.innerHTML = `
      <h2>${libro.titulo}</h2>
      <span class="author">Autor: ${libro.autor}</span>
      <p class="synopsis"><strong>Sinopsis:</strong> ${libro.sinopsis}</p>
      <p class="description">${libro.descripcion_autor}</p>
    `;
  }
});