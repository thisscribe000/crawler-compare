// Crawler Compare - Nigerian Dataset & Storage Engine (Clean Minimalist Theme)

const INITIAL_DATA = {
  cities: [
    { id: 'all', name: 'All Nigeria' },
    { id: 'abuja', name: 'Abuja (FCT)' },
    { id: 'lagos', name: 'Lagos State' },
    { id: 'ph', name: 'Port Harcourt' },
    { id: 'kano', name: 'Kano' },
    { id: 'ibadan', name: 'Ibadan' }
  ],
  locations: {
    abuja: ['Banex Plaza, Wuse 2', 'Maitama', 'Gwarinpa', 'Utako Market', 'Central Area'],
    lagos: ['Computer Village, Ikeja', 'Lekki Phase 1', 'Yaba', 'Victoria Island', 'Surulere'],
    ph: ['Garrison, Aba Road', 'GRA Phase 2', 'Rumuokoro'],
    kano: ['Farm Centre', 'Sabon Gari'],
    ibadan: ['Dugbe', 'Bodija']
  },
  categories: [
    { id: 'all', name: 'All Products' },
    { id: 'phones', name: 'Smartphones & Tablets' },
    { id: 'laptops', name: 'Laptops & Computers' },
    { id: 'power', name: 'Generators & Solar Inverters' },
    { id: 'gaming', name: 'Gaming Consoles & Gear' },
    { id: 'appliances', name: 'Home Appliances' }
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
      instagram: 'https://instagram.com/abujagadgethub',
      badge: 'gold', // gold: Elite Merit, blue: ID Verified, store: Official Store
      badgeTitle: 'Gold Merit Vendor',
      upvotes: 184,
      rating: 4.9,
      salesCount: 142,
      joinedYear: '2022',
      isVerified: true,
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
      instagram: 'https://instagram.com/ikejatechmaster',
      badge: 'gold',
      badgeTitle: 'Gold Merit Vendor',
      upvotes: 231,
      rating: 4.85,
      salesCount: 310,
      joinedYear: '2021',
      isVerified: true,
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
      instagram: 'https://instagram.com/slot_ng',
      badge: 'store',
      badgeTitle: 'Official Retailer',
      upvotes: 95,
      rating: 4.5,
      salesCount: 1500,
      joinedYear: '2015',
      isVerified: true,
      bio: 'Official authorized distributor of mobile phones, electronics, and gadgets in Nigeria.'
    },
    {
      id: 'sel-4',
      name: 'SolarPowerDirect_PH',
      handle: '@solarpower_ph',
      city: 'ph',
      location: 'Aba Road near Garrison, Port Harcourt',
      phone: '2348067891234',
      whatsapp: '2348067891234',
      instagram: 'https://instagram.com/solarpower_ph',
      badge: 'blue',
      badgeTitle: 'ID Verified Vendor',
      upvotes: 67,
      rating: 4.7,
      salesCount: 45,
      joinedYear: '2023',
      isVerified: true,
      bio: 'Inverters, LFP Lithium Batteries, and Felicity Solar systems installation in PH & South-South.'
    },
    {
      id: 'sel-5',
      name: 'KanoGenEmpire',
      handle: '@kanogenempire',
      city: 'kano',
      location: 'Farm Centre Electronics Market, Kano',
      phone: '2348155554321',
      whatsapp: '2348155554321',
      instagram: 'https://instagram.com/kanogenempire',
      badge: 'blue',
      badgeTitle: 'ID Verified Vendor',
      upvotes: 42,
      rating: 4.6,
      salesCount: 29,
      joinedYear: '2023',
      isVerified: true,
      bio: 'Original Sumec Firman, Lutian, and Mikano soundproof generators in Kano.'
    }
  ],
  products: [
    {
      id: 'prod-1',
      title: 'iPhone 15 Pro Max 256GB - Natural Titanium',
      category: 'phones',
      price: 1580000,
      currency: 'NGN',
      condition: 'Brand New (Sealed)',
      sellerId: 'sel-1',
      city: 'abuja',
      location: 'Banex Plaza, Wuse 2',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
      source: 'Instagram / Local Shop',
      isSponsored: false,
      upvotes: 142,
      scrapedAt: '10 mins ago',
      specs: ['256GB Storage', 'A17 Pro Chip', 'Natural Titanium', '1 Year Apple Warranty']
    },
    {
      id: 'prod-2',
      title: 'Apple MacBook Pro 16" M3 Max (36GB RAM, 1TB SSD)',
      category: 'laptops',
      price: 3850000,
      currency: 'NGN',
      condition: 'Brand New (Space Black)',
      sellerId: 'sel-2',
      city: 'lagos',
      location: 'Computer Village, Ikeja',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
      source: 'Computer Village Shop',
      isSponsored: true,
      upvotes: 189,
      scrapedAt: 'Just now',
      specs: ['M3 Max 14-core CPU', '30-core GPU', '36GB Unified Memory', '1TB NVMe SSD']
    },
    {
      id: 'prod-3',
      title: 'Felicity 5KVA 48V Hybrid Solar Inverter + 5kWh Lithium Battery',
      category: 'power',
      price: 2450000,
      currency: 'NGN',
      condition: 'Brand New with Warranty',
      sellerId: 'sel-4',
      city: 'ph',
      location: 'Garrison, Port Harcourt',
      image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80',
      source: 'Direct Vendor',
      isSponsored: false,
      upvotes: 68,
      scrapedAt: '1 hour ago',
      specs: ['Pure Sine Wave', '48V System', '5.12kWh LiFePO4 Battery', '2 Year Warranty']
    },
    {
      id: 'prod-4',
      title: 'PlayStation 5 Slim (Disc Edition) + Extra Controller',
      category: 'gaming',
      price: 740000,
      currency: 'NGN',
      condition: 'Brand New (Japanese Version)',
      sellerId: 'sel-1',
      city: 'abuja',
      location: 'Wuse 2, Abuja',
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80',
      source: 'Instagram Vendor',
      isSponsored: false,
      upvotes: 95,
      scrapedAt: '25 mins ago',
      specs: ['1TB SSD Storage', 'Includes 2 DualSense Controllers', 'Slim Redesign']
    },
    {
      id: 'prod-5',
      title: 'Samsung Galaxy S24 Ultra 512GB (Titanium Gray)',
      category: 'phones',
      price: 1720000,
      currency: 'NGN',
      condition: 'Brand New (Dual SIM)',
      sellerId: 'sel-3',
      city: 'lagos',
      location: 'Slot Ikeja / Nationwide',
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
      source: 'Slot Systems (Official)',
      isSponsored: false,
      upvotes: 88,
      scrapedAt: '45 mins ago',
      specs: ['Snapdragon 8 Gen 3', '12GB RAM', '512GB Storage', 'S-Pen Included']
    },
    {
      id: 'prod-6',
      title: 'Sumec Firman 3.5KVA Key Start Generator (ECO3990ES)',
      category: 'power',
      price: 365000,
      currency: 'NGN',
      condition: 'Brand New 100% Copper',
      sellerId: 'sel-5',
      city: 'kano',
      location: 'Farm Centre, Kano',
      image: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=600&auto=format&fit=crop&q=80',
      source: 'Kano Local Store',
      isSponsored: false,
      upvotes: 54,
      scrapedAt: '2 hours ago',
      specs: ['100% Copper Coil', 'Electric Key Start + Recoil', 'Fuel Tank Capacity 15L']
    }
  ],
  reviews: [
    {
      id: 'rev-1',
      sellerId: 'sel-1',
      author: 'Chidi O. (Abuja)',
      rating: 5,
      date: '2 days ago',
      comment: 'Bought the iPhone 15 Pro Max from their Wuse 2 shop. Smooth deal, tested the IMEI on Apple site right there. Super genuine seller.',
      upvotes: 14,
      verifiedBuyer: true
    },
    {
      id: 'rev-2',
      sellerId: 'sel-1',
      author: 'Aisha M. (Maitama)',
      rating: 5,
      date: '1 week ago',
      comment: 'Dispatched via rider to my office in Maitama within 45 minutes of payment. Excellent communication on WhatsApp.',
      upvotes: 9,
      verifiedBuyer: true
    },
    {
      id: 'rev-3',
      sellerId: 'sel-2',
      author: 'Emeka K. (Lagos)',
      rating: 5,
      date: '3 days ago',
      comment: 'IkejaTechMaster is 100% legit. Handled my MacBook M3 Max purchase smoothly at Otigba street.',
      upvotes: 22,
      verifiedBuyer: true
    }
  ]
};

// Data Store Manager
class DataStore {
  constructor() {
    this.data = JSON.parse(localStorage.getItem('crawler_compare_db')) || INITIAL_DATA;
    this.userUpvotes = JSON.parse(localStorage.getItem('crawler_compare_upvotes')) || {};
  }

  save() {
    localStorage.setItem('crawler_compare_db', JSON.stringify(this.data));
    localStorage.setItem('crawler_compare_upvotes', JSON.stringify(this.userUpvotes));
  }

  getProducts(filters = {}) {
    let result = [...this.data.products];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.location.toLowerCase().includes(q) ||
        p.condition.toLowerCase().includes(q)
      );
    }

    if (filters.city && filters.city !== 'all') {
      result = result.filter(p => p.city === filters.city || p.city === 'all');
    }

    if (filters.category && filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category);
    }

    if (filters.badge && filters.badge !== 'all') {
      result = result.filter(p => {
        const seller = this.getSeller(p.sellerId);
        return seller && seller.badge === filters.badge;
      });
    }

    // Sort logic
    if (filters.sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'merit') {
      result.sort((a, b) => {
        const sellerA = this.getSeller(a.sellerId);
        const sellerB = this.getSeller(b.sellerId);
        const rankA = this.calculateMeritRank(sellerA, a);
        const rankB = this.calculateMeritRank(sellerB, b);
        return rankB - rankA;
      });
    } else { // default 'upvotes'
      result.sort((a, b) => b.upvotes - a.upvotes);
    }

    return result;
  }

  getSeller(sellerId) {
    return this.data.sellers.find(s => s.id === sellerId);
  }

  getReviews(sellerId) {
    return this.data.reviews.filter(r => r.sellerId === sellerId);
  }

  calculateMeritRank(seller, product) {
    if (!seller) return 0;
    let score = (product.upvotes * 2) + (seller.upvotes * 1.5) + (seller.rating * 10) + (seller.salesCount * 3);
    if (seller.badge === 'gold') score += 100;
    return Math.round(score);
  }

  toggleUpvote(productId) {
    const product = this.data.products.find(p => p.id === productId);
    if (!product) return false;

    const hasUpvoted = !!this.userUpvotes[productId];

    if (hasUpvoted) {
      product.upvotes -= 1;
      delete this.userUpvotes[productId];
    } else {
      product.upvotes += 1;
      this.userUpvotes[productId] = true;
      const seller = this.getSeller(product.sellerId);
      if (seller) seller.upvotes += 1;
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
      upvotes: 0,
      verifiedBuyer: true
    };
    this.data.reviews.unshift(newRev);

    const seller = this.getSeller(sellerId);
    if (seller) {
      const sellerRevs = this.getReviews(sellerId);
      const avg = sellerRevs.reduce((acc, r) => acc + r.rating, 0) / sellerRevs.length;
      seller.rating = parseFloat(avg.toFixed(1));
      seller.salesCount += 1;
    }

    this.save();
    return newRev;
  }

  addProduct(productData) {
    const newProd = {
      id: 'prod-' + Date.now(),
      upvotes: 1,
      scrapedAt: 'Just now',
      ...productData
    };
    this.data.products.unshift(newProd);
    this.save();
    return newProd;
  }
}

window.db = new DataStore();
