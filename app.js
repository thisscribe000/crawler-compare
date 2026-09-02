// Crawler Compare - Main Application Logic (Role Authentication & Public/Private Views)

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const buyerView = document.getElementById('buyerView');
  const sellerView = document.getElementById('sellerView');
  const adminView = document.getElementById('adminView');

  const groupedProductsContainer = document.getElementById('groupedProductsContainer');
  const searchInput = document.getElementById('searchInput');
  const citySelect = document.getElementById('citySelect');
  const categorySelect = document.getElementById('categorySelect');

  const triggerScrapeBtn = document.getElementById('triggerScrapeBtn');
  const liveScrapeBanner = document.getElementById('liveScrapeBanner');

  const authNavContainer = document.getElementById('authNavContainer');
  const authModal = document.getElementById('authModal');
  const openAuthModalBtn = document.getElementById('openAuthModalBtn');
  const closeAuthModal = document.getElementById('closeAuthModal');
  const demoSellerLoginBtn = document.getElementById('demoSellerLoginBtn');
  const demoAdminLoginBtn = document.getElementById('demoAdminLoginBtn');
  const continueBuyerBtn = document.getElementById('continueBuyerBtn');

  const addModal = document.getElementById('addModal');
  const openAddProductBtn = document.getElementById('openAddProductBtn');
  const closeAddModal = document.getElementById('closeAddModal');
  const addProductForm = document.getElementById('addProductForm');

  const reviewsModal = document.getElementById('reviewsModal');
  const closeReviewsModal = document.getElementById('closeReviewsModal');
  const reviewsModalContent = document.getElementById('reviewsModalContent');

  // Active Session State (null = Public Buyer, 'seller' = Vendor, 'admin' = Admin)
  let currentUser = JSON.parse(localStorage.getItem('crawler_compare_user')) || null;

  // View Controller based on Session State
  function renderActiveView() {
    if (!currentUser) {
      // 1. PUBLIC BUYER MODE (Default for all visitors)
      buyerView.style.display = 'block';
      sellerView.style.display = 'none';
      adminView.style.display = 'none';

      authNavContainer.innerHTML = `
        <button class="btn btn-outline" id="openAuthModalBtn">
          Vendor / Admin Login
        </button>
      `;
      document.getElementById('openAuthModalBtn').addEventListener('click', () => authModal.classList.add('active'));
      renderGroupedProducts();

    } else if (currentUser.role === 'seller') {
      // 2. PRIVATE SELLER DASHBOARD
      buyerView.style.display = 'none';
      sellerView.style.display = 'block';
      adminView.style.display = 'none';

      authNavContainer.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 12px; font-weight: 700; color: var(--text-dark); background: #f1f5f9; padding: 6px 12px; border-radius: 16px;">
            Vendor: ${currentUser.name}
          </span>
          <button class="btn btn-outline" id="logoutBtn" style="padding: 6px 12px; font-size: 12px;">Log Out</button>
        </div>
      `;
      document.getElementById('logoutBtn').addEventListener('click', handleLogout);
      renderSellerDashboard();

    } else if (currentUser.role === 'admin') {
      // 3. PRIVATE ADMIN CONSOLE
      buyerView.style.display = 'none';
      sellerView.style.display = 'none';
      adminView.style.display = 'block';

      authNavContainer.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 12px; font-weight: 700; color: #dc2626; background: #fee2e2; padding: 6px 12px; border-radius: 16px;">
            System Admin
          </span>
          <button class="btn btn-outline" id="logoutBtn" style="padding: 6px 12px; font-size: 12px;">Log Out</button>
        </div>
      `;
      document.getElementById('logoutBtn').addEventListener('click', handleLogout);
      renderAdminConsole();
    }
  }

  function handleLogout() {
    currentUser = null;
    localStorage.removeItem('crawler_compare_user');
    renderActiveView();
  }

  // Auth Modal Event Handlers
  openAuthModalBtn.addEventListener('click', () => authModal.classList.add('active'));
  closeAuthModal.addEventListener('click', () => authModal.classList.remove('active'));
  continueBuyerBtn.addEventListener('click', () => authModal.classList.remove('active'));

  demoSellerLoginBtn.addEventListener('click', () => {
    currentUser = { role: 'seller', sellerId: 'sel-1', name: 'AbujaGadgetHub' };
    localStorage.setItem('crawler_compare_user', JSON.stringify(currentUser));
    authModal.classList.remove('active');
    renderActiveView();
  });

  demoAdminLoginBtn.addEventListener('click', () => {
    currentUser = { role: 'admin', name: 'System Admin' };
    localStorage.setItem('crawler_compare_user', JSON.stringify(currentUser));
    authModal.classList.remove('active');
    renderActiveView();
  });

  // Render Grouped Products (Public Buyer Mode)
  function renderGroupedProducts() {
    const filters = {
      search: searchInput.value,
      city: citySelect.value,
      category: categorySelect.value
    };

    const groups = window.db.getProductGroups(filters);
    groupedProductsContainer.innerHTML = '';

    if (groups.length === 0) {
      groupedProductsContainer.innerHTML = `
        <div style="text-align: center; padding: 48px 20px; background: #ffffff; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
          <h3 style="font-size: 16px; font-weight: 700; color: var(--text-dark); margin-bottom: 6px;">No Matching Product Models Found</h3>
          <p style="font-size: 13px; color: var(--text-muted);">Try adjusting your search query or click <strong>Firecrawl Live Search</strong> to pull live market listings.</p>
        </div>
      `;
      return;
    }

    groups.forEach(group => {
      const minPriceFormatted = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(group.minPrice);
      const maxPriceFormatted = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(group.maxPrice);

      const groupCard = document.createElement('div');
      groupCard.className = 'group-card';

      const sortedOffers = [...group.offers].sort((a, b) => a.price - b.price);

      let offersTableRows = sortedOffers.map(offer => {
        const seller = window.db.getSeller(offer.sellerId) || {
          name: 'Verified Vendor',
          badge: 'blue',
          badgeTitle: 'ID Verified',
          rating: 4.5
        };

        const offerPriceFormatted = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(offer.price);

        let badgeTag = seller.badge === 'gold' ? '<span class="trust-badge-tag gold">Gold Merit</span>' :
                       seller.badge === 'blue' ? '<span class="trust-badge-tag blue">ID Verified</span>' :
                       '<span class="trust-badge-tag store">Official Store</span>';

        return `
          <tr>
            <td>
              <div style="font-weight: 700; color: var(--text-dark);">${seller.name} ${badgeTag}</div>
              <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">⭐ ${seller.rating} / 5 Rating • ${seller.salesCount} Deals</div>
            </td>
            <td>
              <div>${offer.condition}</div>
              <div style="font-size: 11px; color: var(--text-muted);">📍 ${offer.location}</div>
            </td>
            <td>
              <div class="offer-price">${offerPriceFormatted}</div>
              <div style="font-size: 11px; color: var(--text-muted);">${offer.source}</div>
            </td>
            <td style="text-align: right;">
              <div style="display: flex; gap: 8px; justify-content: flex-end;">
                <button class="btn-reviews" data-seller="${seller.id}">Reviews</button>
                <a href="${offer.outlink}" target="_blank" rel="noopener" class="btn-outlink" data-seller="${seller.id}" data-offer="${offer.id}">
                  Visit Store / Outlink ↗
                </a>
              </div>
            </td>
          </tr>
        `;
      }).join('');

      groupCard.innerHTML = `
        <div class="group-header">
          <img src="${group.image}" alt="${group.title}" class="group-img">
          <div class="group-info">
            <h3 class="group-title">${group.title}</h3>
            <div class="group-price-range">
              Price Range: <strong>${minPriceFormatted} - ${maxPriceFormatted}</strong> (${group.offers.length} Sellers Available)
            </div>
          </div>
        </div>

        <table class="offers-table">
          <thead>
            <tr>
              <th>Seller & Trust Tier</th>
              <th>Condition & Location</th>
              <th>Price & Source</th>
              <th style="text-align: right;">Tracked Action</th>
            </tr>
          </thead>
          <tbody>
            ${offersTableRows}
          </tbody>
        </table>
      `;

      groupedProductsContainer.appendChild(groupCard);
    });

    attachBuyerEvents();
  }

  function attachBuyerEvents() {
    document.querySelectorAll('.btn-outlink').forEach(link => {
      link.addEventListener('click', () => {
        const sellerId = link.getAttribute('data-seller');
        const offerId = link.getAttribute('data-offer');
        window.db.recordOutlinkClick(sellerId, offerId);
      });
    });

    document.querySelectorAll('.btn-reviews').forEach(btn => {
      btn.addEventListener('click', () => {
        const sellerId = btn.getAttribute('data-seller');
        openSellerReviewsModal(sellerId);
      });
    });
  }

  // Render Private Seller Dashboard
  function renderSellerDashboard() {
    const sellerId = currentUser ? currentUser.sellerId : 'sel-1';
    const seller = window.db.getSeller(sellerId) || window.db.getSeller('sel-1');
    if (!seller) return;

    document.getElementById('sellerAccountName').textContent = seller.name;
    document.getElementById('sellerTotalClicks').textContent = seller.totalClicks || 0;
    document.getElementById('sellerUpvotes').textContent = seller.upvotes || 0;
    document.getElementById('sellerDeals').textContent = seller.salesCount || 0;
    document.getElementById('sellerBadgeTitle').textContent = seller.badgeTitle || 'Verified Seller';

    const logsTable = document.getElementById('clickLogsTableBody');
    logsTable.innerHTML = '';

    const logs = window.db.data.clickLogs.filter(l => l.sellerId === seller.id);

    if (logs.length === 0) {
      logsTable.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">No outbound buyer click activity logged yet.</td></tr>`;
      return;
    }

    logs.forEach(log => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${log.timestamp}</td>
        <td><strong>iPhone 15 Pro Max (256GB)</strong></td>
        <td>📍 ${log.city.toUpperCase()}</td>
        <td><code>Instagram Store Out-Link</code></td>
        <td><span style="color: #059669; font-weight: 700;">Tracked Click</span></td>
      `;
      logsTable.appendChild(tr);
    });
  }

  // Render Private Admin Console
  function renderAdminConsole() {
    const adminQueueTable = document.getElementById('adminQueueTableBody');
    adminQueueTable.innerHTML = '';

    window.db.data.sellers.forEach(seller => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${seller.name}</strong> (${seller.handle})</td>
        <td>${seller.location}</td>
        <td><span class="trust-badge-tag ${seller.badge}">${seller.badgeTitle}</span></td>
        <td>${seller.totalClicks || 0} clicks</td>
        <td>
          ${seller.badge === 'gold' ? '<span style="color:#059669; font-weight:600;">Verified Elite</span>' : `
            <button class="btn btn-primary btn-verify" data-seller="${seller.id}" style="padding: 4px 10px; font-size: 11px;">
              Promote to Gold Merit
            </button>
          `}
        </td>
      `;
      adminQueueTable.appendChild(tr);
    });

    document.querySelectorAll('.btn-verify').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-seller');
        window.db.verifySeller(id, 'gold');
        renderAdminConsole();
      });
    });
  }

  // Reviews Modal
  function openSellerReviewsModal(sellerId) {
    const seller = window.db.getSeller(sellerId);
    const reviews = window.db.getReviews(sellerId);
    if (!seller) return;

    reviewsModalContent.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color);">
        <div style="width: 44px; height: 44px; border-radius: 50%; background: #0f172a; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px;">
          ${seller.name[0]}
        </div>
        <div>
          <h3 style="font-size: 16px; font-weight: 700; color: var(--text-dark);">${seller.name}</h3>
          <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${seller.location} • ${seller.badgeTitle}</p>
        </div>
      </div>

      <div style="display: flex; gap: 16px; margin-bottom: 16px; background: #f8fafc; padding: 10px 14px; border-radius: var(--radius-sm); font-size: 13px;">
        <div><strong>Rating:</strong> ${seller.rating} / 5.0</div>
        <div><strong>Outbound Clicks:</strong> ${seller.totalClicks || 0}</div>
        <div><strong>Completed Deals:</strong> ${seller.salesCount}</div>
      </div>

      <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 20px; line-height: 1.4;">${seller.bio}</p>

      <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 10px; color: var(--text-dark);">Community Reviews (${reviews.length})</h4>

      <div style="max-height: 220px; overflow-y: auto; margin-bottom: 20px;">
        ${reviews.length === 0 ? '<p style="color: var(--text-muted); font-size: 13px;">No community reviews yet.</p>' : ''}
        ${reviews.map(r => `
          <div class="review-item">
            <div class="review-header">
              <span class="review-author">${r.author}</span>
              <span class="review-stars">${r.rating} / 5 Rating</span>
            </div>
            <p class="review-text">"${r.comment}"</p>
          </div>
        `).join('')}
      </div>

      <form id="addReviewForm" style="border-top: 1px solid var(--border-color); padding-top: 14px;">
        <div class="form-group" style="display: flex; gap: 8px;">
          <input type="text" class="form-control" id="revAuthor" placeholder="Your Name" required>
          <select class="form-control" id="revRating" style="width: 130px;" required>
            <option value="5">5 / 5 Rating</option>
            <option value="4">4 / 5 Rating</option>
          </select>
        </div>
        <div class="form-group">
          <textarea class="form-control" id="revComment" rows="2" placeholder="Write a review..." required></textarea>
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%;">Submit Review</button>
      </form>
    `;

    reviewsModal.classList.add('active');

    document.getElementById('addReviewForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const author = document.getElementById('revAuthor').value;
      const rating = document.getElementById('revRating').value;
      const comment = document.getElementById('revComment').value;

      window.db.addReview(sellerId, author, rating, comment);
      openSellerReviewsModal(sellerId);
      renderGroupedProducts();
    });
  }

  // Seller Offer Addition Form
  if (openAddProductBtn) {
    openAddProductBtn.addEventListener('click', () => addModal.classList.add('active'));
  }
  closeAddModal.addEventListener('click', () => addModal.classList.remove('active'));

  addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('formTitle').value;
    const price = parseFloat(document.getElementById('formPrice').value);
    const city = document.getElementById('formCity').value;
    const location = document.getElementById('formLocation').value;
    const outlink = document.getElementById('formOutlink').value;

    const sellerId = currentUser ? currentUser.sellerId : 'sel-1';

    // Add offer to default group
    if (window.db.data.productGroups.length > 0) {
      window.db.data.productGroups[0].offers.unshift({
        id: 'offer-' + Date.now(),
        sellerId: sellerId,
        price: price,
        condition: title + ' (New Offer)',
        city: city,
        location: location,
        source: 'Vendor Direct Entry',
        outlink: outlink,
        clicks: 0
      });
      window.db.save();
    }

    addProductForm.reset();
    addModal.classList.remove('active');
    renderActiveView();
  });

  // Filter Listeners
  searchInput.addEventListener('input', renderGroupedProducts);
  citySelect.addEventListener('change', renderGroupedProducts);
  categorySelect.addEventListener('change', renderGroupedProducts);

  closeReviewsModal.addEventListener('click', () => reviewsModal.classList.remove('active'));

  // Firecrawl Search Trigger
  triggerScrapeBtn.addEventListener('click', async () => {
    const query = searchInput.value || 'iPhone 15';
    const city = citySelect.value;

    liveScrapeBanner.style.display = 'block';
    triggerScrapeBtn.disabled = true;

    try {
      const liveResults = await window.firecrawlService.searchMarket(query, city);
      
      window.db.data.productGroups.unshift({
        id: 'group-' + Date.now(),
        title: `${query} (Live Search Scrape)`,
        category: 'phones',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
        minPrice: liveResults[0].price,
        maxPrice: liveResults[0].price * 1.15,
        offersCount: liveResults.length,
        offers: liveResults.map(r => ({
          id: r.id,
          sellerId: r.sellerId,
          price: r.price,
          condition: r.condition,
          city: r.city,
          location: r.location,
          source: r.source,
          outlink: 'https://instagram.com/abujagadgethub',
          clicks: 0
        }))
      });

      setTimeout(() => {
        liveScrapeBanner.style.display = 'none';
        triggerScrapeBtn.disabled = false;
        renderGroupedProducts();
      }, 1000);
    } catch (err) {
      console.error(err);
      liveScrapeBanner.style.display = 'none';
      triggerScrapeBtn.disabled = false;
    }
  });

  // Initial Render
  renderActiveView();
});
