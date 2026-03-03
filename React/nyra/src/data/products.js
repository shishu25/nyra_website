const products = [
  {
    id: 1,
    name: "Midnight Elegance Gown",
    oldPrice: 15000,
    newPrice: 12500,
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1562137369-1a1a0bc66744?w=600&h=800&fit=crop"
    ],
    video: null,
    description: "A stunning deep blue evening gown with intricate lacework and a flowing silhouette. Perfect for formal occasions and galas. Features a sweetheart neckline and floor-length hem with delicate beading throughout.",
    category: "Gowns",
    status: "available"
  },
  {
    id: 2,
    name: "Rose Petal Maxi Dress",
    oldPrice: 10500,
    newPrice: 8900,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=800&fit=crop"
    ],
    video: null,
    description: "A beautiful floral maxi dress in soft rose tones. Lightweight fabric makes it ideal for summer events. Features a wrap-style bodice and tiered skirt with romantic ruffle details.",
    category: "Maxi Dresses",
    status: "available"
  },
  {
    id: 3,
    name: "Velvet Dream Cocktail Dress",
    oldPrice: 11500,
    newPrice: 9500,
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop"
    ],
    video: null,
    description: "A luxurious velvet cocktail dress in deep burgundy. The perfect blend of classic and contemporary design with a fitted silhouette and off-shoulder neckline.",
    category: "Cocktail Dresses",
    status: "available"
  },
  {
    id: 4,
    name: "Ivory Lace Wedding Dress",
    oldPrice: 30000,
    newPrice: 25000,
    images: [
      "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1583396082781-33c7e1d0e508?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=600&h=800&fit=crop"
    ],
    video: null,
    description: "An exquisite ivory lace wedding dress with a cathedral train. Hand-sewn Chantilly lace overlay with a satin underlayer. Features long illusion sleeves and a V-back.",
    category: "Bridal",
    status: "available"
  },
  {
    id: 5,
    name: "Sapphire Sequin Mini",
    oldPrice: 8500,
    newPrice: 7200,
    images: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1562137369-1a1a0bc66744?w=600&h=800&fit=crop"
    ],
    video: null,
    description: "A dazzling sapphire blue sequin mini dress that catches every light. Perfect for parties and night events. Features a bodycon fit with adjustable spaghetti straps.",
    category: "Party Dresses",
    status: "available"
  },
  {
    id: 6,
    name: "Emerald Silk Wrap Dress",
    oldPrice: 13000,
    newPrice: 11000,
    images: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=600&h=800&fit=crop"
    ],
    video: null,
    description: "A graceful emerald green silk wrap dress with a flattering A-line cut. The flowing fabric drapes beautifully and features handmade tie details at the waist.",
    category: "Casual Elegance",
    status: "available"
  },
  {
    id: 7,
    name: "Crimson Ball Gown",
    oldPrice: 22000,
    newPrice: 18500,
    images: [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1562137369-1a1a0bc66744?w=600&h=800&fit=crop"
    ],
    video: null,
    description: "A show-stopping crimson ball gown with layers of tulle and organza. Features a corset bodice with crystal embellishments and a dramatic full skirt.",
    category: "Gowns",
    status: "available"
  },
  {
    id: 8,
    name: "Blush Pink Bridesmaid Dress",
    oldPrice: 8200,
    newPrice: 6800,
    images: [
      "https://images.unsplash.com/photo-1583396082781-33c7e1d0e508?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=600&h=800&fit=crop"
    ],
    video: null,
    description: "A lovely blush pink bridesmaid dress with a chiffon overlay. Features a halter neckline and a flowing A-line skirt perfect for outdoor ceremonies.",
    category: "Bridal",
    status: "available"
  },
  {
    id: 9,
    name: "Navy Blue Pencil Dress",
    oldPrice: 6800,
    newPrice: 5500,
    images: [
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=800&fit=crop"
    ],
    video: null,
    description: "A sleek navy blue pencil dress perfect for professional settings with a touch of elegance. Features a boat neckline and three-quarter sleeves with subtle seam detailing.",
    category: "Casual Elegance",
    status: "available"
  },
  {
    id: 10,
    name: "Gold Embroidered Anarkali",
    oldPrice: 18000,
    newPrice: 15000,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=800&fit=crop"
    ],
    video: null,
    description: "A magnificent gold-embroidered anarkali suit with rich zari work. Features a flared silhouette with intricate thread work and comes with matching dupatta.",
    category: "Traditional",
    status: "available"
  },
  {
    id: 11,
    name: "Burgundy Mermaid Gown",
    oldPrice: 17000,
    newPrice: 14200,
    images: [
      "https://images.unsplash.com/photo-1562137369-1a1a0bc66744?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop"
    ],
    video: null,
    description: "A breathtaking burgundy mermaid-style gown with a dramatic flared hem. Features a strapless sweetheart neckline and subtle ruching along the bodice.",
    category: "Gowns",
    status: "available"
  },
  {
    id: 12,
    name: "Lavender Tulle Party Dress",
    oldPrice: 9800,
    newPrice: 8200,
    images: [
      "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1583396082781-33c7e1d0e508?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop"
    ],
    video: null,
    description: "A whimsical lavender tulle party dress with layered skirts and delicate floral appliqués. Perfect for garden parties and festive celebrations.",
    category: "Party Dresses",
    status: "available"
  }
];

export const CATEGORIES = [
  "Kameez -3 Pieces",
  "Kameez -2 Pieces"

  
];

export default products;
