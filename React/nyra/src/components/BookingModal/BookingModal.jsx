import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useBookings } from '../../context/BookingContext';
import { useProducts } from '../../context/ProductContext';
import './BookingModal.css';

export default function BookingModal({ product, onClose }) {
  const { addBooking } = useBookings();
  const { updateProductStatus } = useProducts();
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Backward compat pricing
  const displayPrice = product.newPrice ?? product.price ?? 0;
  const displayImage = product.images?.[0] ?? product.image;

  const validate = () => {
    const newErrors = {};
    if (!formData.customerName.trim()) newErrors.customerName = 'Name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{7,15}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    // Email is optional but validate format if provided
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);

    // Simulate a brief delay
    setTimeout(() => {
      addBooking({
        productId: product.id,
        productName: product.name,
        productPrice: displayPrice,
        productImage: displayImage,
        customerName: formData.customerName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || '',
        address: formData.address.trim()
      });

      updateProductStatus(product.id, 'pending');

      toast.success('Booking submitted successfully! We will contact you shortly.', {
        duration: 4000
      });

      setSubmitting(false);
      onClose();
    }, 800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <FiX />
        </button>

        <div className="modal-header">
          <h2>Book This Dress</h2>
          <p className="modal-product-name">{product.name}</p>
          <p className="modal-product-price">৳{displayPrice.toLocaleString()}</p>
        </div>

        <form className="booking-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="customerName">Full Name *</label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={errors.customerName ? 'error' : ''}
            />
            {errors.customerName && (
              <span className="field-error">{errors.customerName}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g., 01712345678"
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && (
              <span className="field-error">{errors.phone}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address <span className="optional-tag">(optional)</span></label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g., name@example.com"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && (
              <span className="field-error">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="address">Full Address *</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your complete delivery address"
              rows={3}
              className={errors.address ? 'error' : ''}
            />
            {errors.address && (
              <span className="field-error">{errors.address}</span>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? (
              <span className="spinner" />
            ) : (
              'Confirm Booking'
            )}
          </button>

          <p className="form-note">
            * We will contact you via phone to confirm your booking. No payment required now.
          </p>
        </form>
      </div>
    </div>
  );
}
