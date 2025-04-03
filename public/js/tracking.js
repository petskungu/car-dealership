document.addEventListener('DOMContentLoaded', async () => {
    const orderId = new URLSearchParams(window.location.search).get('id');
    
    if (!orderId) {
      window.location.href = '/';
      return;
    }
  
    try {
      const response = await fetch(`/api/v1/orders/${orderId}/tracking`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const { data: order } = await response.json();
      
      // Render timeline
      const timeline = document.getElementById('timeline');
      order.trackingUpdates.forEach(update => {
        timeline.innerHTML += `
          <div class="timeline-event ${update.status}">
            <div class="event-date">${new Date(update.timestamp).toLocaleDateString()}</div>
            <div class="event-status">${update.status.replace('_', ' ')}</div>
            <div class="event-message">${update.message || ''}</div>
            ${update.location ? `<div class="event-location">📍 ${update.location}</div>` : ''}
          </div>
        `;
      });
  
      // Render car details
      const carResponse = await fetch(`/api/v1/cars/${order.cars[0].car}`);
      const { data: car } = await carResponse.json();
      
      document.getElementById('car-details').innerHTML = `
        <img src="${car.image}" alt="${car.make} ${car.model}">
        <h3>${car.year} ${car.make} ${car.model}</h3>
        <p>VIN: ${car.vin || 'Pending'}</p>
        <p>Estimated Delivery: ${order.deliveryEstimate ? new Date(order.deliveryEstimate).toLocaleDateString() : 'Calculating...'}</p>
      `;
      
    } catch (err) {
      console.error('Error loading tracking data:', err);
      alert('Failed to load order tracking');
    }
  });