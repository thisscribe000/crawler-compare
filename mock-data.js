// Crawler Compare - Nigerian Dataset & Storage Engine (Multi-Role & Click Analytics)

const INITIAL_DATA = {
  activeRole: 'buyer', // 'buyer', 'seller', 'admin'
  cities: [
    { id: 'all', name: 'All Nigeria' },
    { id: 'abuja', name: 'Abuja (FCT)' },
    { id: 'lagos', name: 'Lagos State' },
    { id: 'ph', name: 'Port Harcourt' },
    { id: 'kano', name: 'Kano' },
    { id: 'ibadan', name: 'Ibadan' }
  ],
  categories: [
    { id: 'all', name: 'All Products' },
    { id: 'phones', name: 'Smartphones & Tablets' },
    { id: 'laptops', name: 'Laptops & Computers' },
    { id: 'power', name: 'Generators & Solar Inverters' },
    { id: 'gaming', name: 'Gaming Consoles & Gear' }
  ],
  sellers: [
    {
      id: 'sel-1',
      name: 'AbujaGadgetHub',
      handle: '@abujagadgethub',
      city: 'abuja',
      location: 'Suite B12, Banex Plaza, Wuse 2',
      phone: '2348039876543',
      whatsapp: '2348039876543',
      badge: 'gold',
      badgeTitle: 'Gold Merit Vendor',
      upvotes: 184,
      rating: 4.9,
      salesCount: 142,
      totalClicks: 428,
      status: 'verified',
      bio: 'Direct importers of UK/US pre-owned & brand new iPhones, MacBooks, and Samsung flagships in Abuja.'
    },
    {
      id: 'sel-2',
      name: 'IkejaTechMaster',
      handle: '@ikejatechmaster',
      city: 'lagos',
      location: 'No 14 Otigba St, Computer Village, Ikeja',
      phone: '2348123456789',
      whatsapp: '2348123456789',
      badge: 'gold',
      badgeTitle: 'Gold Merit Vendor',
      upvotes: 231,
      rating: 4.85,
      salesCount: 310,
      totalClicks: 890,
      status: 'verified',
      bio: 'Wholesale & retail computer village vendor. Laptops, MacBooks & Gaming Rigs.'
    },
    {
      id: 'sel-3',
      name: 'Slot Systems Nigeria',
      handle: '@slot_ng',
      city: 'all',
      location: 'Nationwide (Ikeja, Wuse 2, PH GRA)',
      phone: '2347007568647',
      whatsapp: '2348000007568',
      badge: 'store',
      badgeTitle: 'Official Retailer',
      upvotes: 95,
      rating: 4.5,
      salesCount: 1500,
      totalClicks: 1240,
      status: 'verified',
      bio: 'Official authorized distributor of mobile phones, electronics, and gadgets in Nigeria.'
    },
    {
      id: 'sel-4',
      name: 'Jumia Nigeria',
      handle: '@jumia_ng',
      city: 'all',
      location: 'Online Delivery Nationwide',
      phone: '23418881106',
      whatsapp: '23418881106',
      badge: 'store',
      badgeTitle: 'Official Retailer',
      upvotes: 120,
      rating: 4.4,
      salesCount: 5000,
      totalClicks: 2400,
      status: 'verified',
      bio: 'Leading e-commerce marketplace in Nigeria.'
    },
    {
      id: 'sel-5',
      name: 'NewAgeGadgets_Abuja',
      handle: '@newage_abj',
      city: 'abuja',
      location: 'Gwarinpa Plaza, Abuja',
      phone: '2348199998888',
      whatsapp: '2348199998888',
      badge: 'blue',
      badgeTitle: 'ID Verified Vendor',
      upvotes: 24,
      rating: 4.6,
      salesCount: 18,
      totalClicks: 65,
      status: 'pending',
      bio: 'Pre-owned devices and accessories in Gwarinpa.'
    }
  ],

  // Grouped Master Products (Product Comparison Model)
  productGroups: [
    {
      id: 'group-iphone15pm',
      title: 'iPhone 15 Pro Max (256GB)',
      category: 'phones',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
      minPrice: 1550000,
      maxPrice: 1720000,
      offersCount: 3,
      offers: [
        {
          id: 'offer-1',
          sellerId: 'sel-1',
          price: 1580000,
          condition: 'Brand New (Sealed)',
          city: 'abuja',
          location: 'Banex Plaza, Wuse 2',
          source: 'Instagram / Local Shop',
          outlink: 'https://instagram.com/abujagadgethub',
          clicks: 142
        },
        {
          id: 'offer-2',
          sellerId: 'sel-2',
          price: 1550000,
          condition: 'Open Box / Like New',
          city: 'lagos',
          location: 'Computer Village, Ikeja',
          source: 'Computer Village Shop',
          outlink: 'https://instagram.com/ikejatechmaster',
          clicks: 98
        },
        {
          id: 'offer-3',
          sellerId: 'sel-3',
          price: 1720000,
          condition: 'Brand New (Official Warranty)',
          city: 'all',
          location: 'Slot Ikeja / Wuse 2',
          source: 'Slot Official Site',
          outlink: 'https://slot.ng/iphone-15-pro-max',
          clicks: 210
        }
      ]
    },
    {
      id: 'group-macbookm3',
      title: 'Apple MacBook Pro 16" M3 Max (36GB RAM, 1TB SSD)',
      category: 'laptops',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
      minPrice: 3800000,
      maxPrice: 4100000,
      offersCount: 2,
      offers: [
        {
          id: 'offer-4',
          sellerId: 'sel-2',
          price: 3850000,
          condition: 'Brand New (Space Black)',
          city: 'lagos',
          location: 'Computer Village, Ikeja',
          source: 'IkejaTechMaster',
          outlink: 'https://instagram.com/ikejatechmaster',
          clicks: 189
        },
        {
          id: 'offer-5',
          sellerId: 'sel-4',
          price: 4100000,
          condition: 'Official Retail Stock',
          city: 'all',
          location: 'Jumia Online Direct',
          source: 'Jumia Nigeria',
          outlink: 'https://jumia.com.ng/macbook-pro-m3-max',
          clicks: 340
        }
      ]
    }
  ],

  // Click Tracking Analytics Log
  clickLogs: [
    { id: 'clk-1', sellerId: 'sel-1', offerId: 'offer-1', timestamp: '2026-09-02 08:15', city: 'abuja' },
    { id: 'clk-2', sellerId: 'sel-2', offerId: 'offer-2', timestamp: '2026-09-02 08:20', city: 'lagos' }
  ],

  reviews: [
    {
      id: 'rev-1',
      sellerId: 'sel-1',
      author: 'Chidi O. (Abuja)',
      rating: 5,
      date: '2 days ago',
      comment: 'Bought the iPhone 15 Pro Max from their Wuse 2 shop. Smooth deal, tested the IMEI on Apple site right there.',
      verifiedBuyer: true
    },
    {
      id: 'rev-2',
      sellerId: 'sel-2',
      author: 'Emeka K. (Lagos)',
      rating: 5,
      date: '3 days ago',
      comment: 'IkejaTechMaster is 100% legit. Handled my MacBook M3 Max purchase smoothly at Otigba street.',
      verifiedBuyer: true
    }
  ]
};

// Data Store Manager
class DataStore {
  constructor() {
    this.data = JSON.parse(localStorage.getItem('crawler_compare_v2_db')) || INITIAL_DATA;
    this.userUpvotes = JSON.parse(localStorage.getItem('crawler_compare_upvotes')) || {};
  }

  save() {
    localStorage.setItem('crawler_compare_v2_db', JSON.stringify(this.data));
    localStorage.setItem('crawler_compare_upvotes', JSON.stringify(this.userUpvotes));
  }

  setRole(role) {
    this.data.activeRole = role;
    this.save();
  }

  getRole() {
    return this.data.activeRole || 'buyer';
  }

  // Click Tracking Engine
  recordOutlinkClick(sellerId, offerId) {
    const seller = this.getSeller(sellerId);
    if (seller) {
      seller.totalClicks = (seller.totalClicks || 0) + 1;
    }

    this.data.clickLogs.unshift({
      id: 'clk-' + Date.now(),
      sellerId,
      offerId,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      city: seller ? seller.city : 'unknown'
    });

    this.save();
    console.log(`[Analytics] Tracked Outbound Click for Seller: ${seller ? seller.name : sellerId}`);
  }

  getProductGroups(filters = {}) {
    let result = [...this.data.productGroups];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(g => 
        g.title.toLowerCase().includes(q) ||
        g.offers.some(o => o.location.toLowerCase().includes(q) || o.condition.toLowerCase().includes(q))
      );
    }

    if (filters.category && filters.category !== 'all') {
      result = result.filter(g => g.category === filters.category);
    }

    if (filters.city && filters.city !== 'all') {
      result = result.filter(g => 
        g.offers.some(o => o.city === filters.city || o.city === 'all')
      );
    }

    return result;
  }

  getSeller(sellerId) {
    return this.data.sellers.find(s => s.id === sellerId);
  }

  getReviews(sellerId) {
    return this.data.reviews.filter(r => r.sellerId === sellerId);
  }

  calculateMeritRank(seller, offer) {
    if (!seller) return 0;
    let score = (seller.upvotes * 2) + (seller.rating * 10) + (seller.salesCount * 3) + (seller.totalClicks * 0.5);
    if (seller.badge === 'gold') score += 100;
    return Math.round(score);
  }

  toggleUpvote(offerId) {
    const hasUpvoted = !!this.userUpvotes[offerId];

    if (hasUpvoted) {
      delete this.userUpvotes[offerId];
    } else {
      this.userUpvotes[offerId] = true;
    }

    this.save();
    return !hasUpvoted;
  }

  addReview(sellerId, author, rating, comment) {
    const newRev = {
      id: 'rev-' + Date.now(),
      sellerId,
      author: author || 'Verified Buyer',
      rating: parseFloat(rating),
      date: 'Just now',
      comment,
      verifiedBuyer: true
    };
    this.data.reviews.unshift(newRev);

    const seller = this.getSeller(sellerId);
    if (seller) {
      const sellerRevs = this.getReviews(sellerId);
      const avg = sellerRevs.reduce((acc, r) => acc + r.rating, 0) / sellerRevs.length;
      seller.rating = parseFloat(avg.toFixed(1));
    }

    this.save();
    return newRev;
  }

  verifySeller(sellerId, badgeType) {
    const seller = this.getSeller(sellerId);
    if (seller) {
      seller.status = 'verified';
      seller.badge = badgeType || 'blue';
      seller.badgeTitle = badgeType === 'gold' ? 'Gold Merit Vendor' : 'ID Verified Vendor';
      this.save();
    }
  }
}

window.db = new DataStore();
