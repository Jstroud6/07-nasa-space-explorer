// NASA API key
const apiKey = 'g2mTkp59bryXhTfe4IagwHM4LzcZZjzTK7BNVS8d';

// Get references to DOM elements
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const getImagesButton = document.querySelector('.filters button');
const gallery = document.getElementById('gallery');

// Function to fetch images from NASA APOD API
async function fetchImages(startDate, endDate) {
  // Build the API URL with the date range and API key
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`;
  try {
    // Fetch data from NASA API
    const response = await fetch(url);
    const data = await response.json();
    // Check if we got an array of images
    if (Array.isArray(data)) {
      return data;
    } else if (data && data.url) {
      // If only one image is returned
      return [data];
    } else {
      return [];
    }
  } catch (error) {
    // If there is an error, log it and return empty array
    console.error('Error fetching images:', error);
    return [];
  }
}

// Function to display images in the gallery
function displayImages(images) {
  // Clear the gallery
  gallery.innerHTML = '';
  if (images.length === 0) {
    // Show a message if no images found
    gallery.innerHTML = `<div class="placeholder"><div class="placeholder-icon">🔭</div><p>No images found for this date range.</p></div>`;
    return;
  }
  // Loop through each image and create a gallery item
  images.forEach(image => {
    // Only show images (not videos)
    if (image.media_type === 'image') {
      // Create HTML for each image
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.innerHTML = `
        <img src="${image.url}" alt="${image.title}" />
        <p><strong>${image.title}</strong></p>
        <p>${image.date}</p>
        <p>${image.explanation}</p>
      `;
      gallery.appendChild(item);
    }
  });
}

// When the button is clicked, fetch and show images
getImagesButton.addEventListener('click', async () => {
  // Get the selected start and end dates
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;
  // Check if both dates are selected
  if (!startDate || !endDate) {
    alert('Please select both start and end dates.');
    return;
  }
  // Show loading message
  gallery.innerHTML = `<div class="placeholder"><div class="placeholder-icon">🚀</div><p>Loading images...</p></div>`;
  // Fetch images and display them
  const images = await fetchImages(startDate, endDate);
  displayImages(images);
});
// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);
