// Sky Way Payment JavaScript
// Complete payment form functionality with validation and dynamic pricing

class SkyWayPayment {
    constructor() {
        this.basePrice = 299.99;
        this.taxes = 45.50;
        this.fees = 15.99;
        this.additionalServices = {
            'travel-insurance': 49.99,
            'priority-boarding': 24.99,
            'extra-baggage': 39.99
        };
        
        // Sample booking data (would normally come from previous page)
        this.bookingData = {
            from: 'New York (JFK)',
            to: 'Los Angeles (LAX)',
            departure: '2024-06-15',
            return: '2024-06-22',
            passengers: 2,
            class: 'Economy',
            flightNumber: 'SW-1247'
        };
        
        this.init();
    }
    
    init() {
        this.populateBookingDetails();
        this.updatePricing();
        this.setupEventListeners();
        this.setupFormValidation();
    }
    
    populateBookingDetails() {
        const bookingDetailsContainer = document.getElementById('bookingDetails');
        const data = this.bookingData;
        
        bookingDetailsContainer.innerHTML = `
            <div class="detail-item">
                <div class="detail-label">Route</div>
                <div class="route-display">
                    <span>${data.from}</span>
                    <span class="route-arrow">✈</span>
                    <span>${data.to}</span>
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Departure</div>
                <div class="detail-value">${this.formatDate(data.departure)}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Return</div>
                <div class="detail-value">${this.formatDate(data.return)}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Passengers</div>
                <div class="detail-value">${data.passengers} Adult${data.passengers > 1 ? 's' : ''}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Class</div>
                <div class="detail-value">${data.class}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Flight</div>
                <div class="detail-value">${data.flightNumber}</div>
            </div>
        `;
    }
    
    updatePricing() {
        const pricingContainer = document.getElementById('pricingDetails');
        const totalContainer = document.getElementById('totalAmount');
        
        let additionalServicesTotal = 0;
        let selectedServices = [];
        
        // Calculate additional services
        Object.keys(this.additionalServices).forEach(serviceId => {
            const checkbox = document.getElementById(serviceId);
            if (checkbox && checkbox.checked) {
                additionalServicesTotal += this.additionalServices[serviceId];
                selectedServices.push({
                    name: this.getServiceName(serviceId),
                    price: this.additionalServices[serviceId]
                });
            }
        });
        
        const subtotal = this.basePrice;
        const total = subtotal + this.taxes + this.fees + additionalServicesTotal;
        
        // Update pricing details
        let pricingHTML = `
            <div class="price-item">
                <span class="price-label">Base Fare (${this.bookingData.passengers} passengers)</span>
                <span class="price-value">$${subtotal.toFixed(2)}</span>
            </div>
            <div class="price-item">
                <span class="price-label">Taxes & Fees</span>
                <span class="price-value">$${this.taxes.toFixed(2)}</span>
            </div>
            <div class="price-item">
                <span class="price-label">Service Fee</span>
                <span class="price-value">$${this.fees.toFixed(2)}</span>
            </div>
        `;
        
        // Add selected services
        selectedServices.forEach(service => {
            pricingHTML += `
                <div class="price-item">
                    <span class="price-label">${service.name}</span>
                    <span class="price-value">$${service.price.toFixed(2)}</span>
                </div>
            `;
        });
        
        pricingHTML += `
            <div class="price-item">
                <span class="price-label">Total Amount</span>
                <span class="price-value">$${total.toFixed(2)}</span>
            </div>
        `;
        
        pricingContainer.innerHTML = pricingHTML;
        
        // Update total display
        totalContainer.querySelector('.total-price').textContent = `$${total.toFixed(2)}`;
    }
    
    getServiceName(serviceId) {
        const names = {
            'travel-insurance': 'Travel Insurance',
            'priority-boarding': 'Priority Boarding',
            'extra-baggage': 'Extra Baggage'
        };
        return names[serviceId] || serviceId;
    }
    
    setupEventListeners() {
        // Service checkboxes
        Object.keys(this.additionalServices).forEach(serviceId => {
            const checkbox = document.getElementById(serviceId);
            if (checkbox) {
                checkbox.addEventListener('change', () => this.updatePricing());
            }
        });
        
        // Card number formatting
        const cardNumber = document.getElementById('card-number');
        cardNumber.addEventListener('input', this.formatCardNumber);
        
        // Expiry date formatting
        const expiryDate = document.getElementById('expiry-date');
        expiryDate.addEventListener('input', this.formatExpiryDate);
        
        // CVV validation
        const cvv = document.getElementById('cvv');
        cvv.addEventListener('input', this.formatCVV);
        
        // Form submission
        const paymentForm = document.getElementById('paymentForm');
        paymentForm.addEventListener('submit', (e) => this.handlePayment(e));
        
        // Back button
        const backBtn = document.getElementById('backBtn');
        backBtn.addEventListener('click', () => this.goBack());
        
        // Real-time validation
        this.setupRealTimeValidation();
    }
    
    formatCardNumber(e) {
        let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        
        e.target.value = formattedValue;
    }
    
    formatExpiryDate(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    }
    
    formatCVV(e) {
        e.target.value = e.target.value.replace(/[^0-9]/g, '').substring(0, 4);
    }
    
    setupRealTimeValidation() {
        const inputs = document.querySelectorAll('input[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }
    
    setupFormValidation() {
        // Custom validation messages
        const cardNumber = document.getElementById('card-number');
        const expiryDate = document.getElementById('expiry-date');
        const cvv = document.getElementById('cvv');
        
        cardNumber.addEventListener('invalid', (e) => {
            e.target.setCustomValidity('Please enter a valid card number');
        });
        
        expiryDate.addEventListener('invalid', (e) => {
            e.target.setCustomValidity('Please enter a valid expiry date (MM/YY)');
        });
        
        cvv.addEventListener('invalid', (e) => {
            e.target.setCustomValidity('Please enter a valid CVV');
        });
    }
    
    validateField(field) {
        this.clearFieldError(field);
        
        let isValid = true;
        let errorMessage = '';
        
        // Basic required field validation
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Specific field validations
        switch (field.id) {
            case 'card-number':
                if (field.value && !this.isValidCardNumber(field.value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid card number';
                }
                break;
                
            case 'expiry-date':
                if (field.value && !this.isValidExpiryDate(field.value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid expiry date';
                }
                break;
                
            case 'cvv':
                if (field.value && (field.value.length < 3 || field.value.length > 4)) {
                    isValid = false;
                    errorMessage = 'CVV must be 3 or 4 digits';
                }
                break;
                
            case 'cardholder-name':
                if (field.value && field.value.length < 2) {
                    isValid = false;
                    errorMessage = 'Please enter a valid name';
                }
                break;
                
            case 'billing-zip':
                if (field.value && !this.isValidZipCode(field.value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid ZIP/Postal code';
                }
                break;
        }
        
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
        field.classList.add('error-border');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }
    
    clearFieldError(field) {
        field.classList.remove('error-border');
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
        field.setCustomValidity('');
    }
    
    isValidCardNumber(cardNumber) {
        const cleaned = cardNumber.replace(/\s/g, '');
        return /^\d{13,19}$/.test(cleaned) && this.luhnCheck(cleaned);
    }
    
    luhnCheck(cardNumber) {
        let sum = 0;
        let isEven = false;
        
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber.charAt(i));
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        return sum % 10 === 0;
    }
    
    isValidExpiryDate(expiry) {
        const match = expiry.match(/^(\d{2})\/(\d{2})$/);
        if (!match) return false;
        
        const month = parseInt(match[1]);
        const year = parseInt('20' + match[2]);
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        
        if (month < 1 || month > 12) return false;
        if (year < currentYear || (year === currentYear && month < currentMonth)) return false;
        
        return true;
    }
    
    isValidZipCode(zip) {
        // US ZIP code or basic international postal code pattern
        return /^[\d\w\s-]{3,10}$/.test(zip);
    }
    
    async handlePayment(e) {
        e.preventDefault();
        
        // Validate all fields
        const allInputs = e.target.querySelectorAll('input[required], select[required]');
        let isFormValid = true;
        
        allInputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });
        
        // Check terms agreement
        const termsCheckbox = document.getElementById('terms-agreement');
        if (!termsCheckbox.checked) {
            alert('Please agree to the Terms and Conditions to continue.');
            return;
        }
        
        if (!isFormValid) {
            alert('Please correct the errors in the form before submitting.');
            return;
        }
        
        // Simulate payment processing
        const payBtn = document.getElementById('payBtn');
        const originalText = payBtn.textContent;
        
        payBtn.textContent = 'Processing...';
        payBtn.disabled = true;
        payBtn.classList.add('processing');
        
        try {
            // Simulate API call delay
            await this.sleep(2000);
            
            // Simulate random success/failure (95% success rate)
            if (Math.random() > 0.05) {
                this.showSuccessModal();
            } else {
                throw new Error('Payment failed. Please try again.');
            }
            
        } catch (error) {
            alert(error.message);
        } finally {
            payBtn.textContent = originalText;
            payBtn.disabled = false;
            payBtn.classList.remove('processing');
        }
    }
    
    showSuccessModal() {
        const modal = document.getElementById('successModal');
        const confirmationDetails = document.getElementById('confirmationDetails');
        
        // Generate confirmation details
        const confirmationNumber = 'SW' + Math.random().toString(36).substr(2, 9).toUpperCase();
        const totalAmount = document.querySelector('.total-price').textContent;
        
        confirmationDetails.innerHTML = `
            <h3>Booking Confirmed</h3>
            <p><strong>Confirmation Number:</strong> ${confirmationNumber}</p>
            <p><strong>Flight:</strong> ${this.bookingData.flightNumber}</p>
            <p><strong>Route:</strong> ${this.bookingData.from} → ${this.bookingData.to}</p>
            <p><strong>Departure:</strong> ${this.formatDate(this.bookingData.departure)}</p>
            <p><strong>Total Paid:</strong> ${totalAmount}</p>
            <p><strong>Passengers:</strong> ${this.bookingData.passengers}</p>
            <p style="margin-top: 15px; color: #4db8ff;">
                📧 Confirmation email sent to your registered email address
            </p>
        `;
        
        modal.style.display = 'flex';
        
        // Store confirmation for potential future reference
        const confirmationData = {
            confirmationNumber,
            bookingData: this.bookingData,
            totalAmount,
            timestamp: new Date().toISOString()
        };
        
        // In a real application, this would be sent to a server
        console.log('Payment Confirmation:', confirmationData);
    }
    
    goBack() {
        // Redirect to booking page
        window.location.href = 'booking.html';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('en-US', options);
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Global function for modal close
function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
    
    // In a real application, redirect to confirmation page
    alert('Thank you for choosing Sky Way! You will be redirected to your booking confirmation.');
}

// Initialize the payment system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SkyWayPayment();
});

// Additional utility functions for enhanced UX
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation to form submission
    const form = document.getElementById('paymentForm');
    if (form) {
        form.addEventListener('submit', function() {
            // Add subtle animation to indicate processing
            this.style.opacity = '0.8';
        });
    }
    
    // Add smooth scrolling to error fields
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('field-error')) {
            e.target.previousElementSibling.focus();
        }
    });
    
    // Keyboard navigation enhancements
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('successModal');
            if (modal && modal.style.display === 'flex') {
                closeSuccessModal();
            }
        }
    });
    
    // Auto-focus first input
    const firstInput = document.querySelector('#card-number');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 500);
    }
});