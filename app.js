// Crawler Compare - Main Application Logic

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const productsGrid = document.getElementById('productsGrid');
  const searchInput = document.getElementById('searchInput');
  const citySelect = document.getElementById('citySelect');
  const categorySelect = document.getElementById('categorySelect');
  const sortSelect = document.getElementById('sortSelect');
  const badgePills = document.querySelectorAll('.badge-pill');
  
  const triggerScrapeBtn = document.getElementById('triggerScrapeBtn');
  const liveScrapeBanner = document.getElementById('liveScrapeBanner');
  
  const addModal = document.getElementById('addModal');
  const openAddModalBtn = document.getElementById('openAddModalBtn');
  const closeAddModal = document.getElementById('closeAddModal');
  const addProductForm = document.getElementById('addProductForm');

  const reviewsModal = document.getElementById('reviewsModal');
  const closeReviewsModal = document.getElementById('closeReviewsModal');
  const reviewsModalContent = document.getElementById('reviewsModalContent');

  let activeBadgeFilter = 'all';

  // Render Products Function
  function renderProducts() {
    const filters = {
      search: searchInput.value,
      city: citySelect.value,
      category: categorySelect.value,
      sortBy: sortSelect.value,
      badge: activeBadgeFilter
    };

    const products = window.db.getProducts(filters);
    productsGrid.innerHTML = '';

    if (products.length === 0) {
      productsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <div style="font-size: 48px; margin-bottom: 12px;">🔎</div>
          <h3 style="font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 8px;">No Listings Found</h3>
          <p>Try clearing your search filters or click <strong>Firecrawl Live Search</strong> to pull web deals in real-time.</p>
        </div>
      `;
      return;
    }

    products.forEach(product => {
      const seller = window.db.getSeller(product.sellerId) || {
        name: 'Verified Vendor',
        handle: '@vendor',
        badge: 'blue',
        badgeTitle: '🔵 ID Verified Vendor',
        rating: 4.5
      };

      const isUpvoted = !!window.db.userUpvotes[product.id];
      const meritRankScore = window.db.calculateMeritRank(seller, product);

      // Format Currency in NGN ₦
      const formattedPrice = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(product.price);

      // Badge HTML styling
      let badgeHtml = '';
      if (seller.badge === 'gold') {
        badgeHtml = `<span class="card-badge-tag" style="background: rgba(251, 191, 36, 0.2); color: #fbbf24; border: 1px solid #fbbf24;">🏆 Gold Merit Vendor</span>`;
      } else if (seller.badge === 'blue') {
        badgeHtml = `<span class="card-badge-tag" style="background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid #38bdf8;">🔵 ID Verified</span>`;
      } else if (seller.badge === 'store') {
        badgeHtml = `<span class="card-badge-tag" style="background: rgba(52, 211, 153, 0.2); color: #34d399; border: 1px solid #34d399;">🏢 Official Retailer</span>`;
      }

      // WhatsApp Pre-filled link
      const waText = encodeURIComponent(`Hi ${seller.name}, I saw your listing for "${product.title}" on Crawler Compare (₦${product.price.toLocaleString()}). Is it available in ${product.location}?`);
      const waUrl = `https://wa.me/${seller.whatsapp || '2348000000000'}?text=${waText}`;

      const card = document.createElement('article');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="card-img-wrap">
          <img src="${product.image}" alt="${product.title}" loading="lazy">
          ${badgeHtml}
          ${product.isSponsored ? '<span class="card-ad-tag">AD / SPONSORED</span>' : ''}
        </div>

        <div class="card-body">
          <div class="seller-info-row">
            <span class="seller-name">
              ${seller.name}
              <span style="font-size: 11px; opacity: 0.7;">(⭐ ${seller.rating})</span>
            </span>
            <span class="location-tag">📍 ${product.location}</span>
          </div>

          <h3 class="product-title">${product.title}</h3>

          <div class="price-row">
            <span class="price-amount">${formattedPrice}</span>
            <span class="price-condition">${product.condition}</span>
          </div>

          ${product.specs ? `
            <div class="specs-list">
              ${product.specs.map(s => `<span class="spec-chip">${s}</span>`).join('')}
            </div>
          ` : ''}

          <div style="font-size: 11px; color: var(--text-dim); margin-bottom: 14px;">
            Merit Rank Score: <strong style="color: var(--accent-gold);">${meritRankScore} pts</strong> • Source: ${product.source}
          </div>

          <div class="card-actions">
            <button class="upvote-btn ${isUpvoted ? 'upvoted' : ''}" data-id="${product.id}">
              <span class="upvote-arrow">▲</span>
              <span class="upvote-count">${product.upvotes}</span>
            </button>

            <a href="${waUrl}" target="_blank" rel="noopener" class="btn-whatsapp">
              💬 WhatsApp Seller
            </a>

            <button class="btn-reviews" data-seller="${seller.id}">
              ⭐ Reviews
            </button>
          </div>
        </div>
      `;

      productsGrid.appendChild(card);
    });

    attachCardEventListeners();
  }

  // Card Interactive Listeners
  function attachCardEventListeners() {
    // Upvote Button Handler
    document.querySelectorAll('.upvote-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        window.db.toggleUpvote(id);
        renderProducts();
      });
    });

    // Reviews Modal Handler
    document.querySelectorAll('.btn-reviews').forEach(btn => {
      btn.addEventListener('click', () => {
        const sellerId = btn.getAttribute('data-seller');
        openSellerReviewsModal(sellerId);
      });
    });
  }

  // Open Reviews Modal
  function openSellerReviewsModal(sellerId) {
    const seller = window.db.getSeller(sellerId);
    const reviews = window.db.getReviews(sellerId);

    if (!seller) return;

    reviewsModalContent.innerHTML = `
      <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color);">
        <div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--accent-gold)); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 20px;">
          ${seller.name[0]}
        </div>
        <div>
          <h3 style="font-size: 18px; font-weight: 800; color: #fff;">${seller.name}</h3>
          <p style="font-size: 13px; color: var(--text-muted);">${seller.badgeTitle} • 📍 ${seller.location}</p>
        </div>
      </div>

      <div style="display: flex; gap: 16px; margin-bottom: 20px; background: rgba(255,255,255,0.03); padding: 12px 16px; border-radius: 10px;">
        <div><strong>⭐ Rating:</strong> ${seller.rating} / 5.0</div>
        <div><strong>🏆 Upvotes:</strong> ${seller.upvotes}</div>
        <div><strong>✅ Deals Done:</strong> ${seller.salesCount}</div>
      </div>

      <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 20px; line-height: 1.4;">${seller.bio}</p>

      <h4 style="font-size: 15px; font-weight: 700; margin-bottom: 12px; color: #fff;">Community Reviews (${reviews.length})</h4>

      <div style="max-height: 250px; overflow-y: auto; margin-bottom: 20px;">
        ${reviews.length === 0 ? '<p style="color: var(--text-dim); font-size: 13px;">No community reviews yet. Be the first to review this seller!</p>' : ''}
        ${reviews.map(r => `
          <div class="review-item">
            <div class="review-header">
              <span class="review-author">${r.author} ${r.verifiedBuyer ? '<span style="color: var(--accent-store); font-size: 11px;">✔ Verified Buyer</span>' : ''}</span>
              <span class="review-stars">⭐ ${r.rating} / 5</span>
            </div>
            <p class="review-text">"${r.comment}"</p>
            <div style="font-size: 11px; color: var(--text-dim); margin-top: 6px;">${r.date}</div>
          </div>
        `).join('')}
      </div>

      <!-- Add Review Form -->
      <form id="addReviewForm" style="border-top: 1px solid var(--border-color); padding-top: 16px;">
        <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 10px; color: #fff;">Leave a Review for ${seller.name}</h4>
        
        <div class="form-group" style="display: flex; gap: 10px;">
          <input type="text" class="form-control" id="revAuthor" placeholder="Your Name (e.g. Tunde from Abuja)" required>
          <select class="form-control" id="revRating" style="width: 120px;" required>
            <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
            <option value="4">⭐⭐⭐⭐ (4/5)</option>
            <option value="3">⭐⭐⭐ (3/5)</option>
            <option value="2">⭐⭐ (2/5)</option>
            <option value="1">⭐ (1/5)</option>
          </select>
        </div>

        <div class="form-group">
          <textarea class="form-control" id="revComment" rows="2" placeholder="Share your experience (e.g., product condition, delivery speed)..." required></textarea>
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%;">Submit Verified Review</button>
      </form>
    `;

    reviewsModal.classList.add('active');

    // Attach Review Submit Listener
    document.getElementById('addReviewForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const author = document.getElementById('revAuthor').value;
      const rating = document.getElementById('revRating').value;
      const comment = document.getElementById('revComment').value;

      window.db.addReview(sellerId, author, rating, comment);
      openSellerReviewsModal(sellerId);
      renderProducts();
    });
  }

  // Filter Listeners
  searchInput.addEventListener('input', renderProducts);
  citySelect.addEventListener('change', renderProducts);
  categorySelect.addEventListener('change', renderProducts);
  sortSelect.addEventListener('change', renderProducts);

  // Badge Filter Pills
  badgePills.forEach(pill => {
    pill.addEventListener('click', () => {
      badgePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeBadgeFilter = pill.getAttribute('data-badge');
      renderProducts();
    });
  });

  // Modal Open/Close Logic
  openAddModalBtn.addEventListener('click', () => addModal.classList.add('active'));
  closeAddModal.addEventListener('click', () => addModal.classList.remove('active'));
  closeReviewsModal.addEventListener('click', () => reviewsModal.classList.remove('active'));

  addModal.addEventListener('click', (e) => {
    if (e.target === addModal) addModal.classList.remove('active');
  });
  reviewsModal.addEventListener('click', (e) => {
    if (e.target === reviewsModal) reviewsModal.classList.remove('active');
  });

  // Add Product Form Submission
  addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('formTitle').value;
    const price = parseFloat(document.getElementById('formPrice').value);
    const city = document.getElementById('formCity').value;
    const location = document.getElementById('formLocation').value;
    const sellerName = document.getElementById('formSellerName').value;
    const whatsapp = document.getElementById('formWhatsApp').value;

    // Create or find vendor
    const newSellerId = 'sel-' + Date.now();
    window.db.data.sellers.push({
      id: newSellerId,
      name: sellerName.replace('@', ''),
      handle: sellerName,
      city: city,
      location: location,
      phone: whatsapp,
      whatsapp: whatsapp,
      instagram: `https://instagram.com/${sellerName.replace('@', '')}`,
      badge: 'blue',
      badgeTitle: '🔵 ID Verified Vendor',
      upvotes: 1,
      rating: 5.0,
      salesCount: 1,
      joinedYear: '2026',
      isVerified: true,
      bio: `Verified local vendor based in ${location}.`
    });

    window.db.addProduct({
      title,
      category: 'phones',
      price,
      currency: 'NGN',
      condition: 'New Vendor Listing',
      sellerId: newSellerId,
      city,
      location,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
      source: 'Direct Vendor Submission',
      isSponsored: false,
      specs: ['Local Verified Vendor', 'Instant WhatsApp Contact']
    });

    addProductForm.reset();
    addModal.classList.remove('active');
    renderProducts();
  });

  // Firecrawl Live Scrape Trigger
  triggerScrapeBtn.addEventListener('click', async () => {
    const query = searchInput.value || 'iPhone 15';
    const city = citySelect.value;

    liveScrapeBanner.style.display = 'block';
    triggerScrapeBtn.disabled = true;
    triggerScrapeBtn.style.opacity = '0.7';

    try {
      const liveResults = await window.firecrawlService.searchMarket(query, city);
      liveResults.forEach(prod => window.db.addProduct(prod));

      setTimeout(() => {
        liveScrapeBanner.style.display = 'none';
        triggerScrapeBtn.disabled = false;
        triggerScrapeBtn.style.opacity = '1';
        renderProducts();
      }, 1200);
    } catch (err) {
      console.error(err);
      liveScrapeBanner.style.display = 'none';
      triggerScrapeBtn.disabled = false;
    }
  });

  // Initial Render
  renderProducts();
});
