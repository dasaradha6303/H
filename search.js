// Flight Search JavaScript

// Sample flight data
const flightData = [
    {
        airline: "SkyWay Airlines",
        flightNumber: "SW123",
        departure: { time: "08:00", location: "New York", code: "JFK" },
        arrival: { time: "11:30", location: "Los Angeles", code: "LAX" },
        duration: "5h 30m",
        stops: "Non-stop",
        price: 450,
        status: "On Time",
        features: [
            { icon: "fas fa-wifi", text: "Free WiFi" },
            { icon: "fas fa-utensils", text: "Meal Included" },
            { icon: "fas fa-tv", text: "Entertainment" }
        ]
    },
    {
        airline: "Blue Sky Express",
        flightNumber: "BS456",
        departure: { time: "10:15", location: "New York", code: "JFK" },
        arrival: { time: "14:20", location: "Los Angeles", code: "LAX" },
        duration: "6h 05m",
        stops: "1 Stop",
        price: 380,
        status: "On Time",
        features: [
            { icon: "fas fa-wifi", text: "Free WiFi" },
            { icon: "fas fa-suitcase", text: "2 Bags Free" },
            { icon: "fas fa-child", text: "Family Friendly" }
        ]
    },
    {
        airline: "Eagle Airways",
        flightNumber: "EA789",
        departure: { time: "14:45", location: "New York", code: "LGA" },
        arrival: { time: "18:30", location: "Los Angeles", code: "LAX" },
        duration: "5h 45m",
        stops: "Non-stop",
        price: 520,
        status: "On Time",
        features: [
            { icon: "fas fa-star", text: "Premium Service" },
            { icon: "fas fa-wine-glass", text: "Drinks Included" },
            { icon: "fas fa-couch", text: "Extra Legroom" }
        ]
    },
    {
        airline: "Sunset Airlines",
        flightNumber: "SU321",
        departure: { time: "16:30", location: "New York", code: "JFK" },
        arrival: { time: "20:15", location: "Los Angeles", code: "LAX" },
        duration: "5h 45m",
        stops: "Non-stop",
        price: 395,
        status: "On Time",
        features: [
            { icon: "fas fa-wifi", text: "Free WiFi" },
            { icon: "fas fa-mobile-alt", text: "Mobile Check-in" },
            { icon: "fas fa-clock", text: "Flexible Booking" }
        ]
    },
    {
        airline: "Pacific Air",
        flightNumber: "PA654",
        departure: { time: "12:00", location: "New York", code: "JFK" },
        arrival: { time: "16:45", location: "Los Angeles", code: "LAX" },
        duration: "6h 45m",
        stops: "1 Stop",
        price: 320,
        status: "On Time",
        features: [
            { icon: "fas fa-dollar-sign", text: "Best Price" },
            { icon: "fas fa-suitcase", text: "1 Bag Free" },
            { icon: "fas fa-coffee", text: "Snacks Included" }
        ]
    },
    {
        airline: "Royal Wings",
        flightNumber: "RW987",
        departure: { time: "18:20", location: "New York", code: "LGA" },
        arrival: { time: "22:10", location: "Los Angeles", code: "LAX" },
        duration: "5h 50m",
        stops: "Non-stop",
        price: 580,
        status: "On Time",
        features: [
            { icon: "fas fa-crown", text: "Luxury Service" },
            { icon: "fas fa-bed", text: "Lie-flat Seats" },
            { icon: "fas fa-concierge-bell", text: "Priority Boarding" }
        ]
    },
    {
        airline: "Metro Express",
        flightNumber: "ME147",
        departure: { time: "07:30", location: "New York", code: "JFK" },
        arrival: { time: "12:15", location: "Los Angeles", code: "LAX" },
        duration: "6h 45m",
        stops: "1 Stop",
        price: 290,
        status: "Delayed 15 min",
        features: [
            { icon: "fas fa-tags", text: "Budget Friendly" },
            { icon: "fas fa-mobile-alt", text: "Mobile Boarding" },
            { icon: "fas fa-calendar-check", text: "Easy Reschedule" }
        ]
    }
];

// Additional flight data for different routes
const alternativeFlights = [
    {
        airline: "Northern Star",
        flightNumber: "NS456",
        departure: { time: "09:15", location: "Los Angeles", code: "LAX" },
        arrival: { time: "17:30", location: "New York", code: "JFK" },
        duration: "5h 15m",
        stops: "Non-stop",
        price: 485,
        status: "On Time",
        features: [
            { icon: "fas fa-wifi", text: "Free WiFi" },
            { icon: "fas fa-utensils", text: "Gourmet Meals" },
            { icon: "fas fa-headphones", text: "Noise-canceling" }
        ]
    },
    {
        airline: "Coastal Airways",
        flightNumber: "CA789",
        departure: { time: "13:45", location: "Los Angeles", code: "LAX" },
        arrival: { time: "22:20", location: "New York", code: "LGA" },
        duration: "6h 35m",
        stops: "1 Stop",
        price: 355,
        status: "On Time",
        features: [
            { icon: "fas fa-leaf", text: "Eco-Friendly" },
            { icon: "fas fa-suitcase", text: "2 Bags Free" },
            { icon: "fas fa-heart", text: "Health Conscious" }
        ]
    }
];

let currentFlights = [...flightData];
let isLoading = false;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    setDefaultDates();
    displayFlights();
    setupEventListeners();
});

// Set default dates (today and tomorrow)
function setDefaultDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };
    
    document.getElementById('departure-date').value = formatDate(today);
    document.getElementById('return-date').value = formatDate(tomorrow);
}

// Setup event listeners
function setupEventListeners() {
    // Add input animation effects
    const inputs = document.querySelectorAll('.input-with-icon input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
}

// Swap cities function
function swapCities() {
    const departure = document.getElementById('departure');
    const arrival = document.getElementById('arrival');
    
    // Add animation effect
    const swapIcon = document.querySelector('.swap-icon');
    swapIcon.style.transform = 'rotate(180deg) scale(1.2)';
    
    // Swap values with animation
    setTimeout(() => {
        const temp = departure.value;
        departure.value = arrival.value;
        arrival.value = temp;
        
        // Reset icon
        setTimeout(() => {
            swapIcon.style.transform = '';
        }, 200);
    }, 200);
    
    // Update flights if values are swapped
    if (departure.value && arrival.value) {
        setTimeout(() => {
            refreshFlights();
        }, 400);
    }
}

// Search flights function
function searchFlights() {
    const departure = document.getElementById('departure').value;
    const arrival = document.getElementById('arrival').value;
    const departureDate = document.getElementById('departure-date').value;
    
    if (!departure || !arrival || !departureDate) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    showLoading();
    
    // Simulate API call delay
    setTimeout(() => {
        hideLoading();
        displayFlights();
        showNotification('Flights updated successfully!', 'success');
    }, 2000);
}

// Refresh flights function
function refreshFlights() {
    if (isLoading) return;
    
    showLoading();
    
    // Simulate API call and get new flight data
    setTimeout(() => {
        // Mix original and alternative flights for variety
        const allFlights = [...flightData, ...alternativeFlights];
        currentFlights = shuffleArray(allFlights).slice(0, Math.floor(Math.random() * 3) + 5);
        
        // Randomize prices slightly
        currentFlights = currentFlights.map(flight => ({
            ...flight,
            price: flight.price + Math.floor(Math.random() * 100 - 50)
        }));
        
        hideLoading();
        displayFlights();
        showNotification('Flights refreshed successfully!', 'success');
    }, 1500);
}

// Show loading animation
function showLoading() {
    isLoading = true;
    const loading = document.getElementById('loading');
    const results = document.getElementById('flightResults');
    
    loading.classList.add('active');
    results.classList.remove('active');
}

// Hide loading animation
function hideLoading() {
    isLoading = false;
    const loading = document.getElementById('loading');
    const results = document.getElementById('flightResults');
    
    loading.classList.remove('active');
    results.classList.add('active');
}

// Display flights
function displayFlights() {
    const container = document.getElementById('flightsContainer');
    container.innerHTML = '';
    
    currentFlights.forEach((flight, index) => {
        const flightCard = createFlightCard(flight, index);
        container.appendChild(flightCard);
    });
}

// Create individual flight card
function createFlightCard(flight, index) {
    const card = document.createElement('div');
    card.className = 'flight-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const statusColor = flight.status === 'On Time' ? 'var(--success)' : 
                       flight.status.includes('Delayed') ? 'var(--warning)' : 'var(--danger)';
    
    card.innerHTML = `
        <div class="flight-header">
            <div class="airline-info">
                <div class="airline-logo">
                    ${flight.airline.charAt(0)}
                </div>
                <div class="airline-details">
                    <h3>${flight.airline}</h3>
                    <div class="flight-number">${flight.flightNumber}</div>
                </div>
            </div>
            <div class="price-info">
                <div class="price-main">${flight.price}</div>
                <div class="price-sub">per person</div>
            </div>
        </div>
        
        <div class="flight-route">
            <div class="route-point">
                <div class="route-time">${flight.departure.time}</div>
                <div class="route-location">${flight.departure.location}</div>
                <div class="route-code">${flight.departure.code}</div>
            </div>
            <div class="route-connector">
                <div class="route-line"></div>
                <div class="route-duration">${flight.duration}</div>
                <div class="route-stops">${flight.stops}</div>
            </div>
            <div class="route-point">
                <div class="route-time">${flight.arrival.time}</div>
                <div class="route-location">${flight.arrival.location}</div>
                <div class="route-code">${flight.arrival.code}</div>
            </div>
        </div>
        
        <div class="flight-features">
            ${flight.features.map(feature => `
                <div class="feature">
                    <i class="${feature.icon}"></i>
                    <span>${feature.text}</span>
                </div>
            `).join('')}
        </div>
        
        <div class="flight-actions">
            <div class="flight-status">
                <div class="status-dot" style="background-color: ${statusColor}"></div>
                <div class="status-text" style="color: ${statusColor}">${flight.status}</div>
            </div>
            <button class="select-flight-btn" onclick="selectFlight('${flight.flightNumber}')">
                <span>Select Flight</span>
                <i class="fas fa-arrow-right"></i>
            </button>
        </div>
    `;
    
    return card;
}

// Select flight function
function selectFlight(flightNumber) {
    const selectedFlight = currentFlights.find(flight => flight.flightNumber === flightNumber);
    
    if (selectedFlight) {
        showNotification(`Flight ${flightNumber} selected! Redirecting to booking...`, 'success');
        
        // Simulate redirect delay
        setTimeout(() => {
            // Here you would typically redirect to booking page
            console.log('Redirecting to booking page for flight:', selectedFlight);
        }, 2000);
    }
}

// Sort flights function
function sortFlights() {
    const sortBy = document.getElementById('sortBy').value;
    
    switch(sortBy) {
        case 'price':
            currentFlights.sort((a, b) => a.price - b.price);
            break;
        case 'duration':
            currentFlights.sort((a, b) => {
                const aDuration = parseFloat(a.duration.replace(/[^\d.]/g, ''));
                const bDuration = parseFloat(b.duration.replace(/[^\d.]/g, ''));
                return aDuration - bDuration;
            });
            break;
        case 'departure':
            currentFlights.sort((a, b) => {
                const aTime = a.departure.time.replace(':', '');
                const bTime = b.departure.time.replace(':', '');
                return aTime - bTime;
            });
            break;
        default:
            break;
    }
    
    displayFlights();
    showNotification(`Flights sorted by ${sortBy}`, 'info');
}

// Utility function to shuffle array
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Show notification function
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Get notification icon based on type
function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

// Get notification color based on type
function getNotificationColor(type) {
    switch(type) {
        case 'success': return '#28a745';
        case 'error': return '#dc3545';
        case 'warning': return '#ffc107';
        default: return '#17a2b8';
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-content i {
        font-size: 1.2rem;
    }
`;
document.head.appendChild(style);