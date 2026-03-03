import { createContext, useContext, useState, useEffect } from 'react';
import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  onSnapshot, query, orderBy
} from 'firebase/firestore';
import {
  ref, uploadString, getDownloadURL, deleteObject
} from 'firebase/storage';
import { db, storage } from '../firebase';
import { CATEGORIES } from '../data/products';

const ProductContext = createContext();

/**
 * Validates that a product has all required fields to be displayed.
 */
const isValidProduct = (product) => {
  if (!product) return false;
  if (!product.name || !product.name.trim()) return false;
  if (!product.newPrice && product.newPrice !== 0) return false;
  if (Number(product.newPrice) <= 0) return false;
  const images = product.images || [];
  const hasValidImage = images.some(img => img && img.trim().length > 0);
  if (!hasValidImage) return false;
  return true;
};

/**
 * Upload a base64 image to Firebase Storage and return the download URL.
 */
const uploadImageToStorage = async (base64String, path) => {
  const storageRef = ref(storage, path);
  await uploadString(storageRef, base64String, 'data_url');
  return getDownloadURL(storageRef);
};

/**
 * Upload multiple base64 images and return array of download URLs.
 */
const uploadImages = async (images, productId) => {
  const urls = [];
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    // If already a URL (not base64), keep it
    if (img && !img.startsWith('data:')) {
      urls.push(img);
      continue;
    }
    if (img && img.startsWith('data:')) {
      const url = await uploadImageToStorage(img, `products/${productId}/image_${i}_${Date.now()}`);
      urls.push(url);
    }
  }
  return urls;
};

/**
 * Upload a base64 video to Firebase Storage and return the download URL.
 */
const uploadVideo = async (base64Video, productId) => {
  if (!base64Video) return null;
  if (!base64Video.startsWith('data:')) return base64Video; // Already a URL
  const storageRef = ref(storage, `products/${productId}/video_${Date.now()}`);
  await uploadString(storageRef, base64Video, 'data_url');
  return getDownloadURL(storageRef);
};

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Real-time listener to Firestore — all users see the same data
  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(d => ({
        ...d.data(),
        id: d.id
      }));
      setProducts(prods);
      setIsLoading(false);
    }, (error) => {
      console.error('Error fetching products:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getProduct = (id) => products.find(p => p.id === String(id));

  const updateProductStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, 'products', String(id)), { status });
    } catch (e) {
      console.error('Error updating product status:', e);
    }
  };

  const addProduct = async (product) => {
    try {
      const productId = `prod_${Date.now()}`;
      // Upload images to Firebase Storage
      const imageUrls = await uploadImages(product.images || [], productId);
      // Upload video if present
      const videoUrl = await uploadVideo(product.video, productId);

      const newProduct = {
        name: product.name,
        category: product.category,
        oldPrice: Number(product.oldPrice) || 0,
        newPrice: Number(product.newPrice),
        description: product.description,
        images: imageUrls,
        video: videoUrl,
        status: product.status || 'available',
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'products'), newProduct);
      return { ...newProduct, id: docRef.id };
    } catch (e) {
      console.error('Error adding product:', e);
      throw e;
    }
  };

  const editProduct = async (id, updates) => {
    try {
      const productId = String(id);
      let imageUrls = updates.images || [];
      let videoUrl = updates.video || null;

      // Upload any new base64 images
      const hasNewImages = imageUrls.some(img => img && img.startsWith('data:'));
      if (hasNewImages) {
        imageUrls = await uploadImages(imageUrls, productId);
      }

      // Upload new video if base64
      if (videoUrl && videoUrl.startsWith('data:')) {
        videoUrl = await uploadVideo(videoUrl, productId);
      }

      await updateDoc(doc(db, 'products', productId), {
        ...updates,
        images: imageUrls,
        video: videoUrl,
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      console.error('Error editing product:', e);
      throw e;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, 'products', String(id)));
    } catch (e) {
      console.error('Error deleting product:', e);
    }
  };

  const getAvailableProducts = () =>
    products.filter(p => p.status !== 'confirmed' && isValidProduct(p));

  const getAllProducts = () => products;

  const getCategories = () => {
    const cats = [...new Set([...CATEGORIES, ...products.map(p => p.category).filter(Boolean)])];
    return ['All', ...cats];
  };

  return (
    <ProductContext.Provider value={{
      products,
      setProducts,
      getProduct,
      updateProductStatus,
      addProduct,
      editProduct,
      deleteProduct,
      getAvailableProducts,
      getAllProducts,
      getCategories,
      isLoading,
      isValidProduct,
      CATEGORIES
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within ProductProvider');
  return ctx;
}

export { CATEGORIES };
