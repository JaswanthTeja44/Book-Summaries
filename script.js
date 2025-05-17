    function addSummary() {
      const title = document.getElementById('title').value.trim();
      const category = document.getElementById('category').value;
      const summary = document.getElementById('summary').value.trim();
      const rating = document.getElementById('rating').value;
      const errorDiv = document.getElementById('error');

      errorDiv.innerText = '';

      if (!title || !summary || !rating || rating < 1 || rating > 5) {
        errorDiv.innerText = 'Please fill all fields correctly (Rating 1-5).';
        return;
      }

      const card = document.createElement('div');
      card.className = 'summary-card';

      const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);

      card.innerHTML = `
        <h3>${title} <span class="category-tag">${category}</span></h3>
        <p>${summary}</p>
        <div class="rating">${stars}</div>
      `;

      document.getElementById('summary-list').prepend(card);

      document.getElementById('title').value = '';
      document.getElementById('summary').value = '';
      document.getElementById('rating').value = '';
    }

    async function searchBooks() {
      const query = document.getElementById('search-book').value.trim();
      const resultDiv = document.getElementById('browse-results');
      resultDiv.innerHTML = '';

      if (!query) {
        resultDiv.innerHTML = '<p class="error">Enter a search term.</p>';
        return;
      }

      try {
        const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.docs && data.docs.length > 0) {
          data.docs.slice(0, 5).forEach(book => {
            const div = document.createElement('div');
            div.className = 'browse-item';
            const title = book.title;
            const author = book.author_name?.[0] || 'Unknown Author';
            const readUrl = book.key;

            div.innerHTML = `
              <strong>${title}</strong> by ${author}
              <span class="read-link" onclick="previewBook('${readUrl}')">Read Preview</span>
            `;
            div.onclick = () => {
              document.getElementById('title').value = title;
            };
            resultDiv.appendChild(div);
          });
        } else {
          resultDiv.innerHTML = '<p>No books found.</p>';
        }
      } catch (err) {
        resultDiv.innerHTML = '<p class="error">Error fetching book data.</p>';
      }
    }

    async function previewBook(key) {
      const previewDiv = document.getElementById('preview-reader');
      const textContainer = document.getElementById('preview-text');
      previewDiv.style.display = 'block';
      textContainer.innerText = 'Loading preview...';

      try {
        const res = await fetch(`https://openlibrary.org${key}.json`);
        const data = await res.json();
        const preview = data.description?.value || data.description || "Preview not available.";
        textContainer.innerText = preview.substring(0, 1000) + (preview.length > 1000 ? '...' : '');
      } catch (err) {
        textContainer.innerText = 'Could not load preview.';
      }
    }