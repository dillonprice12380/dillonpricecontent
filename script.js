/* =============================================
   Dillon Price Portfolio - JavaScript
   Filter + Search + Pagination Logic
   ============================================= */

(function () {
  const ITEMS_PER_PAGE = 5;

  let currentFilter = 'all';
  let currentSearch = '';
  let currentPage = 1;

  const articleList = document.getElementById('articleList');
  const searchInput = document.getElementById('searchInput');
  const pageInfo = document.getElementById('pageInfo');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const filterBtns = document.querySelectorAll('.filter-btn');

  // Get all list items as an array
  const allItems = Array.from(articleList.querySelectorAll('li'));

  // ---- Filter buttons ----
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      currentPage = 1;
      render();
    });
  });

  // ---- Search ----
  searchInput.addEventListener('input', function () {
    currentSearch = searchInput.value.toLowerCase().trim();
    currentPage = 1;
    render();
  });

  // ---- Pagination ----
  window.changePage = function (direction) {
    currentPage += direction;
    render();
  };

  // ---- Render ----
  function render() {
    // Determine which items match the filter + search
    var matched = allItems.filter(function (item) {
      var sourceMatch = currentFilter === 'all' || item.dataset.source === currentFilter;
      var searchMatch = currentSearch === '' ||
        item.textContent.toLowerCase().includes(currentSearch);
      return sourceMatch && searchMatch;
    });

    // Pagination math
    var totalPages = Math.max(1, Math.ceil(matched.length / ITEMS_PER_PAGE));
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    var start = (currentPage - 1) * ITEMS_PER_PAGE;
    var end = start + ITEMS_PER_PAGE;
    var pageItems = matched.slice(start, end);

    // Show / hide items
    allItems.forEach(function (item) {
      item.classList.add('hidden');
    });
    pageItems.forEach(function (item) {
      item.classList.remove('hidden');
    });

    // Update pagination controls
    pageInfo.textContent = currentPage + ' of ' + totalPages;
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;
  }

  // Initial render
  render();
})();
