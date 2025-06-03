(async function () {
  const input = document.getElementById('search-input');
  const resultList = document.getElementById('search-results');

  try {
    const res = await fetch('/search.xml');
    const text = await res.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');

    const entries = [...xml.querySelectorAll('entry')].map(entry => ({
      title: entry.querySelector('title')?.textContent || 'No Title',
      content: entry.querySelector('content')?.textContent || '',
      url: entry.querySelector('url')?.textContent || '#'
    }));

    input.addEventListener('input', function () {
      const query = this.value.trim().toLowerCase();
      resultList.innerHTML = '';

      if (!query) return;

      const results = entries.filter(entry =>
        entry.title.toLowerCase().includes(query) ||
        entry.content.toLowerCase().includes(query)
      );

      if (results.length === 0) {
        resultList.innerHTML = '<li>No results found.</li>';
        return;
      }

      results.forEach(entry => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${entry.url}">${entry.title}</a>`;
        resultList.appendChild(li);
      });
    });
  } catch (error) {
    console.error('Search index loading failed:', error);
    resultList.innerHTML = '<li>Error loading search index.</li>';
  }
})();
