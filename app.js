// Crawler Compare - Main Application Logic (Product Hunt Style)

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

  // Render Products Function (Product Hunt Row Layout)
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
        <div style="text-align: center; padding: 48px 20px; background: #ffffff; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
          <h3 style="font-size: 16px; font-weight: 700; color: var(--text-dark); margin-bottom: 6px;">No Listings Found</h3>
          <p style="font-size: 13px; color: var(--text-muted);">Try adjusting your search query or click <strong>Firecrawl Live Search</strong> to pull live market data.</p>
        </div>
      `;
      return;
    }

    products.forEach(product => {
      const seller = window.db.getSeller(product.sellerId) || {
        name: 'Verified Vendor',
        handle: '@vendor',
        badge: 'blue',
        badgeTitle: 'ID Verified',
        rating: 4.5
      };

      const isUpvoted = !!window.db.userUpvotes[product.id];
      const meritRankScore = window.db.calculateMeritRank(seller, product);

      // Format Currency in NGN
      const formattedPrice = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(product.price);

      // Badge HTML styling (Clean, Product Hunt style pills, no emojis)
      let badgeHtml = '';
      if (seller.badge === 'gold') {
        badgeHtml = `<span class="trust-badge-tag gold">Gold Merit</span>`;
      } else if (seller.badge === 'blue') {
        badgeHtml = `<span class="trust-badge-tag blue">ID Verified</span>`;
      } else if (seller.badge === 'store') {
        badgeHtml = `<span class="trust-badge-tag store">Official Store</span>`;
      }

      // WhatsApp Pre-filled link
      const waText = encodeURIComponent(`Hi ${seller.name}, I saw your listing for "${product.title}" on Crawler Compare (${formattedPrice}). Is it available in ${product.location}?`);
      const waUrl = `https://wa.me/${seller.whatsapp || '2348000000000'}?text=${waText}`;

      const card = document.createElement('article');
      card.className = 'product-card';
      card.innerHTML = `
        <!-- Left Product Hunt Upvote Box -->
        <button class="upvote-box ${isUpvoted ? 'upvoted' : ''}" data-id="${product.id}">
          <span class="arrow">▲</span>
          <span class="count">${product.upvotes}</span>
        </button>

        <!-- Thumbnail Image -->
        <div class="card-img-wrap">
          <img src="${product.image}" alt="${product.title}" loading="lazy">
        </div>

        <!-- Main Product Details -->
        <div class="card-main-content">
          <div class="card-title-row">
            <a href="#" class="product-title">${product.title}</a>
            ${badgeHtml}
            ${product.isSponsored ? '<span style="font-size: 10px; font-weight: 700; padding: 2px 6px; background: #fee2e2; color: #dc2626; border-radius: 4px;">AD</span>' : ''}
          </div>

          <div class="card-meta-row">
            <span class="meta-price">${formattedPrice}</span>
            <span>•</span>
            <span class="meta-seller">${seller.name} (${seller.rating} rating)</span>
            <span>•</span>
            <span class="meta-location">${product.location}</span>
          </div>

          ${product.specs ? `
            <div class="specs-list">
              ${product.specs.map(s => `<span class="spec-chip">${s}</span>`).join('')}
              <span class="spec-chip" style="background: #fffbebfb; color: #b45309; font-weight: 600;">Merit Score: ${meritRankScore}</span>
            </div>
          ` : ''}
        </div>

        <!-- Right Side Actions -->
        <div class="card-right-actions">
          <button class="btn-reviews" data-seller="${seller.id}">
            Reviews (${window.db.getReviews(seller.id).length})
          </button>
          
          <a href="${waUrl}" target="_blank" rel="noopener" class="btn-whatsapp">
            Contact Seller
          </a>
        </div>
      `;

      productsGrid.appendChild(card);
    });

    attachCardEventListeners();
  }

  // Card Interactive Listeners
  function attachCardEventListeners() {
    // Upvote Button Handler
    document.querySelectorAll('.upvote-box').forEach(btn => {
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

    let badgePillHtml = seller.badge === 'gold' ? '<span class="trust-badge-tag gold">Gold Merit Vendor</span>' :
                        seller.badge === 'blue' ? '<span class="trust-badge-tag blue">ID Verified</span>' :
                        '<span class="trust-badge-tag store">Official Store</span>';

    reviewsModalContent.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color);">
        <div style="width: 44px; height: 44px; border-radius: 50%; background: #0f172a; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px;">
          ${seller.name[0]}
        </div>
        <div>
          <h3 style="font-size: 16px; font-weight: 700; color: var(--text-dark);">${seller.name}</h3>
          <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${seller.location} • ${badgePillHtml}</p>
        </div>
      </div>

      <div style="display: flex; gap: 16px; margin-bottom: 16px; background: #f8fafc; padding: 10px 14px; border-radius: var(--radius-sm); font-size: 13px;">
        <div><strong>Rating:</strong> ${seller.rating} / 5.0</div>
        <div><strong>Upvotes:</strong> ${seller.upvotes}</div>
        <div><strong>Completed Deals:</strong> ${seller.salesCount}</div>
      </div>

      <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 20px; line-height: 1.4;">${seller.bio}</p>

      <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 10px; color: var(--text-dark);">Community Reviews (${reviews.length})</h4>

      <div style="max-height: 220px; overflow-y: auto; margin-bottom: 20px;">
        ${reviews.length === 0 ? '<p style="color: var(--text-muted); font-size: 13px;">No community reviews yet. Be the first to review this seller.</p>' : ''}
        ${reviews.map(r => `
          <div class="review-item">
            <div class="review-header">
              <span class="review-author">${r.author} ${r.verifiedBuyer ? '<span style="color: #059669; font-size: 11px; font-weight: 600; margin-left: 4px;">Verified Buyer</span>' : ''}</span>
              <span class="review-stars">${r.rating} / 5 Rating</span>
            </div>
            <p class="review-text">"${r.comment}"</p>
            <div style="font-size: 11px; color: var(--text-dim); margin-top: 4px;">${r.date}</div>
          </div>
        `).join('')}
      </div>

      <!-- Add Review Form -->
      <form id="addReviewForm" style="border-top: 1px solid var(--border-color); padding-top: 14px;">
        <h4 style="font-size: 13px; font-weight: 700; margin-bottom: 10px; color: var(--text-dark);">Write a Review for ${seller.name}</h4>
        
        <div class="form-group" style="display: flex; gap: 8px;">
          <input type="text" class="form-control" id="revAuthor" placeholder="Your Name" required>
          <select class="form-control" id="revRating" style="width: 130px;" required>
            <option value="5">5 / 5 Rating</option>
            <option value="4">4 / 5 Rating</option>
            <option value="3">3 / 5 Rating</option>
            <option value="2">2 / 5 Rating</option>
            <option value="1">1 / 5 Rating</option>
          </select>
        </div>

        <div class="form-group">
          <textarea class="form-control" id="revComment" rows="2" placeholder="Describe your experience with this seller..." required></textarea>
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
      badgeTitle: 'ID Verified Vendor',
      upvotes: 1,
      rating: 5.0,
      salesCount: 1,
      joinedYear: '2026',
      isVerified: true,
      bio: `Verified vendor located in ${location}.`
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
      }, 1000);
    } catch (err) {
      console.error(err);
      liveScrapeBanner.style.display = 'none';
      triggerScrapeBtn.disabled = false;
    }
  });

  // Initial Render
  renderProducts();
});
