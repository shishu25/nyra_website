import { useState } from 'react';
import { FiX, FiShoppingCart, FiCheck } from 'react-icons/fi';
import './CheckoutModal.css';

export default function CheckoutModal({ items, deliveryZone, deliveryCost, onClose, onComplete }) {
  const [step, setStep] = useState('confirm'); // 'confirm' | 'contact'
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const itemsTotal = items.reduce((s, i) => s + (i.newPrice || 0), 0);
  const grandTotal = itemsTotal + (deliveryCost || 0);

  const validate = () => {
    const e = {};
    if (!formData.customerName.trim()) e.customerName = 'Name is required';
    if (!formData.phone.trim()) {
      e.phone = 'Phone number is required';
    } else if (!/^\d{7,15}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      e.phone = 'Enter a valid phone number';
    }
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      e.email = 'Enter a valid email';
    }
    if (!formData.address.trim()) e.address = 'Address is required';
    return e;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      onComplete({
        customerName: formData.customerName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim()
      });
    }, 600);
  };

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout-modal" onClick={e => e.stopPropagation()}>
        <button className="checkout-close" onClick={onClose}>
          <FiX />
        </button>

        {/* Step 1: Confirmation */}
        {step === 'confirm' && (
          <div className="checkout-confirm">
            <div className="checkout-icon-wrap">
              <FiShoppingCart />
            </div>
            <h2>Do you want to buy these products?</h2>
            <div className="checkout-summary-mini">
              <p>{items.length} dress{items.length !== 1 ? 'es' : ''}</p>
              <p className="checkout-subtotal">Subtotal: ৳{itemsTotal.toLocaleString()}</p>
              <p className="checkout-delivery-info">
                Delivery ({deliveryZone === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'}): ৳{deliveryCost}
              </p>
              <p className="checkout-total-mini">Total: ৳{grandTotal.toLocaleString()}</p>
            </div>
            <div className="checkout-confirm-actions">
              <button className="checkout-yes" onClick={() => setStep('contact')}>
                <FiCheck /> Yes, Proceed
              </button>
              <button className="checkout-no" onClick={onClose}>
                No, Go Back
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Contact Form */}
        {step === 'contact' && (
          <div className="checkout-contact">
            <h2>Contact Information</h2>
            <p className="checkout-form-sub">Fill in your details to complete the order</p>

            <div className="co-form">
              <div className="co-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={e => handleChange('customerName', e.target.value)}
                  placeholder="Enter your full name"
                  className={errors.customerName ? 'co-error' : ''}
                />
                {errors.customerName && <span className="co-err">{errors.customerName}</span>}
              </div>

              <div className="co-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => handleChange('phone', e.target.value)}
                  placeholder="e.g., 01712345678"
                  className={errors.phone ? 'co-error' : ''}
                />
                {errors.phone && <span className="co-err">{errors.phone}</span>}
              </div>

              <div className="co-group">
                <label>Email <span className="co-optional">(optional)</span></label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => handleChange('email', e.target.value)}
                  placeholder="name@example.com"
                  className={errors.email ? 'co-error' : ''}
                />
                {errors.email && <span className="co-err">{errors.email}</span>}
              </div>

              <div className="co-group">
                <label>Full Address *</label>
                <textarea
                  value={formData.address}
                  onChange={e => handleChange('address', e.target.value)}
                  placeholder="Your delivery address"
                  rows={3}
                  className={errors.address ? 'co-error' : ''}
                />
                {errors.address && <span className="co-err">{errors.address}</span>}
              </div>

              <button
                className="co-submit"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? <span className="co-spinner" /> : 'Place Order'}
              </button>

              <p className="co-note">
                No payment required now. We will contact you to confirm.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
