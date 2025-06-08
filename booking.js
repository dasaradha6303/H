// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const form = document.getElementById('bookingForm');
    const clearBtn = document.getElementById('clearForm');
    const tripTypeRadios = document.querySelectorAll('input[name="trip-type"]');
    const returnDetails = document.getElementById('return-details');
    const departureDate = document.getElementById('departure-date');
    const returnDate = document.getElementById('return-date');

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // You can add validation here if needed
        // For now, we'll just redirect to the next page
        window.location.href = 'confirmation.html';
    });
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    departureDate.min = today;
    returnDate.min = today;
    
    // Handle trip type change
    tripTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'round-trip') {
                returnDetails.style.display = 'block';
                returnDate.required = true;
            } else {
                returnDetails.style.display = 'none';
                returnDate.required = false;
                returnDate.value = '';
                document.getElementById('return-time').value = '';
            }
        });
    });
    
    // Update return date minimum when departure date changes
    departureDate.addEventListener('change', function() {
        const selectedDate = this.value;
        if (selectedDate) {
            returnDate.min = selectedDate;
            // Clear return date if it's before departure date
            if (returnDate.value && returnDate.value < selectedDate) {
                returnDate.value = '';
            }
        }
    });
    
    // Prevent selecting same city for from and to
    const fromSelect = document.getElementById('from');
    const toSelect = document.getElementById('to');
    
    function updateCityOptions() {
        const fromValue = fromSelect.value;
        const toValue = toSelect.value;
        
        // Enable all options first
        Array.from(toSelect.options).forEach(option => {
            option.disabled = false;
        });
        
        Array.from(fromSelect.options).forEach(option => {
            option.disabled = false;
        });
        
        // Disable selected options in the other select
        if (fromValue) {
            Array.from(toSelect.options).forEach(option => {
                if (option.value === fromValue) {
                    option.disabled = true;
                }
            });
        }
        
        if (toValue) {
            Array.from(fromSelect.options).forEach(option => {
                if (option.value === toValue) {
                    option.disabled = true;
                }
            });
        }
    }
    
    fromSelect.addEventListener('change', updateCityOptions);
    toSelect.addEventListener('change', updateCityOptions);
    
    // Form validation and submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic validation
        if (!validateForm()) {
            return;
        }
        
        // Collect form data
        const formData = new FormData(form);
        const bookingData = {};
        
        // Convert FormData to object
        for (let [key, value] of formData.entries()) {
            bookingData[key] = value;
        }
        
        // Add passenger count
        const adults = parseInt(document.getElementById('adults').value) || 0;
        const children = parseInt(document.getElementById('children').value) || 0;
        const infants = parseInt(document.getElementById('infants').value) || 0;
        bookingData.totalPassengers = adults + children + infants;
        
        // Store booking data in localStorage
        localStorage.setItem('bookingData', JSON.stringify(bookingData));
        
        // Redirect to payment page
        window.location.href = 'payment.html';
    });
    
    // Clear form function
    clearBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear all form data?')) {
            form.reset();
            returnDetails.style.display = 'none';
            returnDate.required = false;
            updateCityOptions();
            
            // Show clear message
            showMessage('Form cleared successfully!', 'info');
        }
    });
    
    // Form validation function
    function validateForm() {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        // Check required fields
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                clearFieldError(field);
            }
        });
        
        // Check if from and to cities are different
        const from = fromSelect.value;
        const to = toSelect.value;
        
        if (from && to && from === to) {
            showFieldError(toSelect, 'Destination must be different from departure city');
            isValid = false;
        }
        
        // Check email format
        const email = document.getElementById('email').value;
        if (email && !isValidEmail(email)) {
            showFieldError(document.getElementById('email'), 'Please enter a valid email address');
            isValid = false;
        }
        
        // Check phone format
        const phone = document.getElementById('phone').value;
        if (phone && !isValidPhone(phone)) {
            showFieldError(document.getElementById('phone'), 'Please enter a valid phone number');
            isValid = false;
        }
        
        // Check return date if round trip
        const tripType = document.querySelector('input[name="trip-type"]:checked').value;
        const depDate = new Date(departureDate.value);
        const retDate = new Date(returnDate.value);
        
        if (tripType === 'round-trip' && returnDate.value) {
            if (retDate <= depDate) {
                showFieldError(returnDate, 'Return date must be after departure date');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    // Show field error
    function showFieldError(field, message) {
        clearFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#ff4757';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '5px';
        
        field.parentNode.appendChild(errorDiv);
        field.style.borderColor = '#ff4757';
    }
    
    // Clear field error
    function clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        field.style.borderColor = '';
    }
    
    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Phone validation
    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }
    
    // Show success message
    function showSuccessMessage(data) {
        const modal = createModal();
        const modalContent = modal.querySelector('.modal-content');
        
        modalContent.innerHTML = `
            <div class="success-icon">✈️</div>
            <h2>Booking Request Submitted!</h2>
            <div class="booking-summary">
                <h3>Booking Summary:</h3>
                <p><strong>Route:</strong> ${getLocationName(data.from)} → ${getLocationName(data.to)}</p>
                <p><strong>Date:</strong> ${formatDate(data['departure-date'])}</p>
                ${data['trip-type'] === 'round-trip' ? `<p><strong>Return:</strong> ${formatDate(data['return-date'])}</p>` : ''}
                <p><strong>Passengers:</strong> ${data.totalPassengers}</p>
                <p><strong>Contact:</strong> ${data['full-name']} (${data.email})</p>
            </div>
            <p class="success-message">We'll contact you soon with flight options and pricing details.</p>
            <button class="modal-close" onclick="closeModal()">Close</button>
        `;
        
        document.body.appendChild(modal);
    }
    
    // Show general message
    function showMessage(message, type = 'success') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        
        const colors = {
            success: '#2ed573',
            error: '#ff4757',
            info: '#4db8ff'
        };
        
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            font-weight: 500;
            z-index: 1000;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }
    
    // Create modal
    function createModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            animation: fadeIn 0.3s ease-out;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.cssText = `
            background: rgba(0,0,0,0.9);
            padding: 40px;
            border-radius: 15px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            color: white;
            border: 1px solid rgba(255,255,255,0.1);
            box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        `;
        
        modal.appendChild(modalContent);
        return modal;
    }
    
    // Helper functions
    function getLocationName(value) {
        const locations = {
            'new-york': 'New York',
            'los-angeles': 'Los Angeles',
            'chicago': 'Chicago',
            'miami': 'Miami',
            'london': 'London',
            'paris': 'Paris',
            'tokyo': 'Tokyo'
        };
        return locations[value] || value;
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    // Global function to close modal
    window.closeModal = function() {
        const modal = document.querySelector('.modal');
        if (modal) {
            modal.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => modal.remove(), 300);
        }
    };
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        .success-icon {
            font-size: 3rem;
            margin-bottom: 20px;
        }
        
        .booking-summary {
            background: rgba(77, 184, 255, 0.1);
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: left;
        }
        
        .booking-summary h3 {
            color: #4db8ff;
            margin-bottom: 15px;
        }
        
        .booking-summary p {
            margin: 8px 0;
        }
        
        .success-message {
            color: #2ed573;
            font-weight: 500;
            margin: 20px 0;
        }
        
        .modal-close {
            background: linear-gradient(45deg, #ff6b35, #f7931e);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.3s ease;
            margin-top: 20px;
        }
        
        .modal-close:hover {
            transform: translateY(-2px);
        }
    `;
    
    document.head.appendChild(style);
    
    // Initialize form
    updateCityOptions();
    
    // Add smooth scrolling for better UX
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.2s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
    
    // Add loading animation for submit button
    const submitBtn = document.querySelector('.submit-btn');
    const originalSubmitText = submitBtn.textContent;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        submitBtn.innerHTML = '<span>Processing...</span>';
        submitBtn.disabled = true;
        
        try {
            // Get form data
            const formData = new FormData(form);
            const bookingData = {
                trip_type: formData.get('trip-type'),
                from: formData.get('from'),
                to: formData.get('to'),
                departure_date: formData.get('departure-date'),
                departure_time: formData.get('departure-time'),
                return_date: formData.get('return-date'),
                return_time: formData.get('return-time'),
                adults: parseInt(formData.get('adults')) || 0,
                children: parseInt(formData.get('children')) || 0,
                infants: parseInt(formData.get('infants')) || 0,
                name: formData.get('name'),
                email: formData.get('email')
            };

            // Send data to server
            const response = await fetch('api/create_booking.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookingData)
            });

            const result = await response.json();

            if (result.status === 'success') {
                // Show success message
                alert(`Booking successful! Your booking reference is: ${result.booking_reference}`);
                
                // Reset form
                form.reset();
            } else {
                throw new Error(result.error || 'Failed to create booking');
            }

        } catch (error) {
            console.error('Error:', error);
            alert('Error creating booking. Please try again.');
        } finally {
            // Re-enable button
            submitBtn.textContent = originalSubmitText;
            submitBtn.disabled = false;
        }
    });
});