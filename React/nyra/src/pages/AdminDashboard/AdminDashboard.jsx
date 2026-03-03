import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiLogOut, FiPackage, FiClock, FiCheckCircle,
  FiCheck, FiX, FiTrash2, FiPlus, FiEdit2, FiMail,
  FiUpload, FiImage, FiVideo
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useProducts, CATEGORIES } from '../../context/ProductContext';
import { useBookings } from '../../context/BookingContext';
import './AdminDashboard.css';

/* ── File size limits ── */
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB per image
const MAX_VIDEO_SIZE = 2 * 1024 * 1024; // 2MB per video (stored in localStorage, must be small)
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];

/* ── Empty form template ── */
const emptyDressForm = {
  name: '',
  category: CATEGORIES[0] || '',
  oldPrice: '',
  newPrice: '',
  description: '',
  status: 'available'
};

export default function AdminDashboard() {
  const { logout } = useAuth();
  const { products, updateProductStatus, addProduct, editProduct, deleteProduct } = useProducts();
  const {
    bookings,
    getPendingBookings,
    getConfirmedBookings,
    updateBookingStatus,
    deleteBooking
  } = useBookings();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('pending');

  /* ── Dress Modal state ── */
  const [showDressModal, setShowDressModal] = useState(false);
  const [dressModalMode, setDressModalMode] = useState('add'); // 'add' | 'edit'
  const [dressForm, setDressForm] = useState({ ...emptyDressForm });
  const [editingId, setEditingId] = useState(null);
  const [dressErrors, setDressErrors] = useState({});

  /* ── File upload state ── */
  const [uploadedImages, setUploadedImages] = useState([]); // array of base64 data URLs
  const [uploadedVideo, setUploadedVideo] = useState(null); // base64 data URL or null
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  /* ── Handlers ── */
  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const handleConfirm = (booking) => {
    updateBookingStatus(booking.id, 'confirmed');
    updateProductStatus(booking.productId, 'confirmed');
    toast.success(`Booking for "${booking.productName}" confirmed!`);
  };

  const handleReject = (booking) => {
    updateBookingStatus(booking.id, 'rejected');
    updateProductStatus(booking.productId, 'available');
    toast.success(`Booking rejected. "${booking.productName}" is now available again.`);
  };

  const handleDeleteBooking = (booking) => {
    if (window.confirm('Are you sure you want to delete this booking record?')) {
      deleteBooking(booking.id);
      toast.success('Booking record deleted.');
    }
  };

  /* ── Dress CRUD ── */
  const openAddDress = () => {
    setDressModalMode('add');
    setDressForm({ ...emptyDressForm });
    setEditingId(null);
    setDressErrors({});
    setUploadedImages([]);
    setUploadedVideo(null);
    setShowDressModal(true);
  };

  const openEditDress = (product) => {
    const images = product.images || [product.image || ''];
    setDressModalMode('edit');
    setDressForm({
      name: product.name || '',
      category: product.category || CATEGORIES[0],
      oldPrice: product.oldPrice ?? product.price ?? '',
      newPrice: product.newPrice ?? product.price ?? '',
      description: product.description || '',
      status: product.status || 'available'
    });
    setUploadedImages(images.filter(Boolean));
    setUploadedVideo(product.video || null);
    setEditingId(product.id);
    setDressErrors({});
    setShowDressModal(true);
  };

  const validateDressForm = () => {
    const e = {};
    if (!dressForm.name.trim()) e.name = 'Name is required';
    if (!dressForm.newPrice || Number(dressForm.newPrice) <= 0) e.newPrice = 'Enter a valid new price';
    if (!dressForm.description.trim()) e.description = 'Description is required';
    if (uploadedImages.length === 0) e.images = 'At least one image is required';
    return e;
  };

  const handleDressFormChange = (field, value) => {
    setDressForm(prev => ({ ...prev, [field]: value }));
    if (dressErrors[field]) setDressErrors(prev => ({ ...prev, [field]: '' }));
  };

  /* ── Compress image via canvas ── */
  const compressImage = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  /* ── Image file handler ── */
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (uploadedImages.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    files.forEach(async (file) => {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        toast.error(`"${file.name}" is not a supported image format`);
        return;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        toast.error(`"${file.name}" exceeds 5MB limit`);
        return;
      }

      try {
        const compressed = await compressImage(file);
        setUploadedImages(prev => {
          if (prev.length >= 5) return prev;
          return [...prev, compressed];
        });
      } catch (err) {
        console.error('Image compression failed:', err);
        toast.error(`Failed to process "${file.name}"`);
      }
    });
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  /* ── Video file handler ── */
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      toast.error('Only MP4, WebM, or OGG video formats are supported');
      return;
    }
    if (file.size > MAX_VIDEO_SIZE) {
      toast.error('Video must be under 2MB (data is stored locally)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadedVideo(ev.target.result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removeVideo = () => {
    setUploadedVideo(null);
  };

  const handleDressSubmit = () => {
    const errs = validateDressForm();
    if (Object.keys(errs).length > 0) {
      setDressErrors(errs);
      return;
    }

    const payload = {
      name: dressForm.name.trim(),
      category: dressForm.category,
      oldPrice: Number(dressForm.oldPrice) || 0,
      newPrice: Number(dressForm.newPrice),
      description: dressForm.description.trim(),
      images: uploadedImages,
      video: uploadedVideo,
      status: dressForm.status
    };

    if (dressModalMode === 'add') {
      addProduct(payload);
      toast.success(`"${payload.name}" added successfully!`);
    } else {
      editProduct(editingId, payload);
      toast.success(`"${payload.name}" updated successfully!`);
    }

    setShowDressModal(false);
  };

  const handleDeleteDress = (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"? This cannot be undone.`)) {
      deleteProduct(product.id);
      toast.success(`"${product.name}" deleted.`);
    }
  };

  /* ── Data ── */
  const pendingBookings = getPendingBookings();
  const confirmedBookings = getConfirmedBookings();

  const stats = [
    { label: 'Total Dresses', value: products.length, icon: <FiPackage />, color: '#3b82f6' },
    { label: 'Pending', value: pendingBookings.length, icon: <FiClock />, color: '#f39c12' },
    { label: 'Confirmed', value: confirmedBookings.length, icon: <FiCheckCircle />, color: '#27ae60' },
  ];

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  /* ── Render ── */
  return (
    <div className="dashboard-page">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">NYRA</div>
        <p className="sidebar-subtitle">Admin Panel</p>

        <nav className="sidebar-nav">
          <button
            className={`sidebar-link ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            <FiClock />
            Pending Bookings
            {pendingBookings.length > 0 && (
              <span className="badge">{pendingBookings.length}</span>
            )}
          </button>
          <button
            className={`sidebar-link ${activeTab === 'confirmed' ? 'active' : ''}`}
            onClick={() => setActiveTab('confirmed')}
          >
            <FiCheckCircle />
            Confirmed Orders
          </button>
          <button
            className={`sidebar-link ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <FiPackage />
            Manage Dresses
          </button>
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          <FiLogOut />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <div className="header-stats">
            {stats.map((s, i) => (
              <div key={i} className="stat-card" style={{ '--accent': s.color }}>
                <div className="stat-icon">{s.icon}</div>
                <div>
                  <p className="stat-val">{s.value}</p>
                  <p className="stat-lbl">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </header>

        {/* ── Pending Tab ── */}
        {activeTab === 'pending' && (
          <section className="dashboard-section">
            <h2>Pending Bookings</h2>
            {pendingBookings.length === 0 ? (
              <div className="empty-state">
                <FiClock size={40} />
                <p>No pending bookings right now</p>
              </div>
            ) : (
              <div className="bookings-grid">
                {pendingBookings.map(b => (
                  <div key={b.id} className="booking-card">
                    <div className="booking-card-header">
                      <img src={b.productImage} alt={b.productName} className="booking-thumb" />
                      <div>
                        <h3>{b.productName}</h3>
                        <p className="booking-price">৳{b.productPrice?.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="booking-card-body">
                      <div className="booking-info">
                        <span className="info-label">Customer:</span>
                        <span>{b.customerName}</span>
                      </div>
                      <div className="booking-info">
                        <span className="info-label">Phone:</span>
                        <span>{b.phone}</span>
                      </div>
                      {b.email && (
                        <div className="booking-info">
                          <span className="info-label"><FiMail size={12} /> Email:</span>
                          <span className="booking-email">{b.email}</span>
                        </div>
                      )}
                      <div className="booking-info">
                        <span className="info-label">Address:</span>
                        <span>{b.address}</span>
                      </div>
                      <div className="booking-info">
                        <span className="info-label">Date:</span>
                        <span>{formatDate(b.createdAt)}</span>
                      </div>
                    </div>
                    <div className="booking-card-actions">
                      <button className="action-btn confirm" onClick={() => handleConfirm(b)}>
                        <FiCheck /> Confirm
                      </button>
                      <button className="action-btn reject" onClick={() => handleReject(b)}>
                        <FiX /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Confirmed Tab ── */}
        {activeTab === 'confirmed' && (
          <section className="dashboard-section">
            <h2>Confirmed Orders</h2>
            {confirmedBookings.length === 0 ? (
              <div className="empty-state">
                <FiCheckCircle size={40} />
                <p>No confirmed orders yet</p>
              </div>
            ) : (
              <div className="bookings-grid">
                {confirmedBookings.map(b => (
                  <div key={b.id} className="booking-card confirmed-card">
                    <div className="booking-card-header">
                      <img src={b.productImage} alt={b.productName} className="booking-thumb" />
                      <div>
                        <h3>{b.productName}</h3>
                        <p className="booking-price">৳{b.productPrice?.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="booking-card-body">
                      <div className="booking-info">
                        <span className="info-label">Customer:</span>
                        <span>{b.customerName}</span>
                      </div>
                      <div className="booking-info">
                        <span className="info-label">Phone:</span>
                        <span>{b.phone}</span>
                      </div>
                      {b.email && (
                        <div className="booking-info">
                          <span className="info-label"><FiMail size={12} /> Email:</span>
                          <span className="booking-email">{b.email}</span>
                        </div>
                      )}
                      <div className="booking-info">
                        <span className="info-label">Address:</span>
                        <span>{b.address}</span>
                      </div>
                      <div className="booking-info">
                        <span className="info-label">Date:</span>
                        <span>{formatDate(b.createdAt)}</span>
                      </div>
                      {b.confirmedAt && (
                        <div className="booking-info">
                          <span className="info-label">Confirmed:</span>
                          <span>{formatDate(b.confirmedAt)}</span>
                        </div>
                      )}
                    </div>
                    <div className="booking-card-actions">
                      <span className="confirmed-badge">
                        <FiCheckCircle /> Confirmed
                      </span>
                      <button className="action-btn delete" onClick={() => handleDeleteBooking(b)}>
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Products / Manage Dresses Tab ── */}
        {activeTab === 'products' && (
          <section className="dashboard-section">
            <div className="section-header-row">
              <h2>Manage Dresses</h2>
              <button className="add-dress-btn" onClick={openAddDress}>
                <FiPlus /> Add Dress
              </button>
            </div>
            <div className="products-table-wrapper">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Old Price</th>
                    <th>New Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
                        No dresses added yet. Click "Add Dress" to get started.
                      </td>
                    </tr>
                  ) : products.map(p => {
                    const img = p.images?.[0] ?? p.image ?? '';
                    const oPrice = Number(p.oldPrice) || Number(p.price) || 0;
                    const nPrice = Number(p.newPrice) || Number(p.price) || 0;
                    return (
                      <tr key={p.id}>
                        <td>
                          {img ? (
                            <img src={img} alt={p.name} className="table-thumb" />
                          ) : (
                            <div className="table-thumb-placeholder">No Image</div>
                          )}
                        </td>
                        <td className="table-name">{p.name}</td>
                        <td>{p.category}</td>
                        <td className="table-old-price">৳{oPrice.toLocaleString()}</td>
                        <td className="table-price">৳{nPrice.toLocaleString()}</td>
                        <td>
                          <span className={`table-status status-${p.status}`}>
                            {p.status}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              className="tbl-action-btn edit"
                              title="Edit"
                              onClick={() => openEditDress(p)}
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              className="tbl-action-btn delete"
                              title="Delete"
                              onClick={() => handleDeleteDress(p)}
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {/* ── Add / Edit Dress Modal ── */}
      {showDressModal && (
        <div className="dress-modal-overlay" onClick={() => setShowDressModal(false)}>
          <div className="dress-modal" onClick={e => e.stopPropagation()}>
            <button className="dress-modal-close" onClick={() => setShowDressModal(false)}>
              <FiX />
            </button>
            <h2>{dressModalMode === 'add' ? 'Add New Dress' : 'Edit Dress'}</h2>

            <div className="dress-form">
              {/* Name */}
              <div className="df-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={dressForm.name}
                  onChange={e => handleDressFormChange('name', e.target.value)}
                  placeholder="Dress name"
                  className={dressErrors.name ? 'df-error' : ''}
                />
                {dressErrors.name && <span className="df-err-msg">{dressErrors.name}</span>}
              </div>

              {/* Category */}
              <div className="df-group">
                <label>Category *</label>
                <select
                  value={dressForm.category}
                  onChange={e => handleDressFormChange('category', e.target.value)}
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Prices row */}
              <div className="df-row">
                <div className="df-group">
                  <label>Old Price (৳)</label>
                  <input
                    type="number"
                    value={dressForm.oldPrice}
                    onChange={e => handleDressFormChange('oldPrice', e.target.value)}
                    placeholder="e.g., 5000"
                  />
                </div>
                <div className="df-group">
                  <label>New Price (৳) *</label>
                  <input
                    type="number"
                    value={dressForm.newPrice}
                    onChange={e => handleDressFormChange('newPrice', e.target.value)}
                    placeholder="e.g., 3800"
                    className={dressErrors.newPrice ? 'df-error' : ''}
                  />
                  {dressErrors.newPrice && <span className="df-err-msg">{dressErrors.newPrice}</span>}
                </div>
              </div>

              {/* Description */}
              <div className="df-group">
                <label>Description *</label>
                <textarea
                  value={dressForm.description}
                  onChange={e => handleDressFormChange('description', e.target.value)}
                  rows={3}
                  placeholder="Brief description of the dress"
                  className={dressErrors.description ? 'df-error' : ''}
                />
                {dressErrors.description && <span className="df-err-msg">{dressErrors.description}</span>}
              </div>

              {/* Images Upload */}
              <div className="df-group">
                <label><FiImage style={{ marginRight: 6 }} />Upload Images (up to 5)</label>
                <div className={`df-upload-zone ${dressErrors.images ? 'df-upload-error' : ''}`} onClick={() => imageInputRef.current?.click()}>
                  <FiUpload size={20} />
                  <span>Click to select images</span>
                  <span className="df-hint">JPG, PNG, WebP, GIF — max 5MB each</span>
                </div>
                {dressErrors.images && <span className="df-err-msg">{dressErrors.images}</span>}
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                {uploadedImages.length > 0 && (
                  <div className="df-media-preview">
                    {uploadedImages.map((src, i) => (
                      <div key={i} className="df-preview-item">
                        <img src={src} alt={`Preview ${i + 1}`} className="df-preview-img" />
                        <button
                          type="button"
                          className="df-preview-remove"
                          onClick={() => removeImage(i)}
                        >
                          <FiX size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {uploadedImages.length > 0 && (
                  <span className="df-hint">{uploadedImages.length}/5 images selected</span>
                )}
              </div>

              {/* Video Upload */}
              <div className="df-group">
                <label><FiVideo style={{ marginRight: 6 }} />Upload Video (optional)</label>
                <div className="df-upload-zone" onClick={() => videoInputRef.current?.click()}>
                  <FiUpload size={20} />
                  <span>{uploadedVideo ? 'Replace video' : 'Click to select video'}</span>
                  <span className="df-hint">MP4, WebM, OGG — max 2MB</span>
                </div>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/ogg"
                  onChange={handleVideoUpload}
                  style={{ display: 'none' }}
                />
                {uploadedVideo && (
                  <div className="df-media-preview">
                    <div className="df-preview-item df-preview-video-item">
                      <video src={uploadedVideo} className="df-preview-video" controls muted />
                      <button
                        type="button"
                        className="df-preview-remove"
                        onClick={removeVideo}
                      >
                        <FiX size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="df-group">
                <label>Status</label>
                <select
                  value={dressForm.status}
                  onChange={e => handleDressFormChange('status', e.target.value)}
                >
                  <option value="available">Available</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Sold Out</option>
                </select>
              </div>

              <button className="df-submit" onClick={handleDressSubmit}>
                {dressModalMode === 'add' ? 'Add Dress' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
