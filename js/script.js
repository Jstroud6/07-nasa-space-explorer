// NASA API key
const apiKey = 'g2mTkp59bryXhTfe4IagwHM4LzcZZjzTK7BNVS8d';

// Array of fun "Did You Know?" space facts
const spaceFacts = [
  "Did you know? The Sun is 400 times larger than the Moon but also 400 times farther away from Earth.",
  "Did you know? One day on Venus is longer than one year on Venus.",
  "Did you know? Neutron stars can spin at a rate of 600 times per second.",
  "Did you know? There are more stars in the universe than grains of sand on Earth.",
  "Did you know? Jupiter has 92 known moons!",
  "Did you know? The footprints on the Moon will remain for millions of years.",
  "Did you know? Saturn could float in water because it’s mostly made of gas.",
  "Did you know? A spoonful of a neutron star would weigh about a billion tons.",
  "Did you know? The largest volcano in the solar system is on Mars—Olympus Mons.",
  "Did you know? Space is completely silent—there’s no air to carry sound."
];

// Function to show a random space fact
function showRandomFact() {
  // Pick a random index from the facts array
  const randomIndex = Math.floor(Math.random() * spaceFacts.length);
  // Get the fact
  const fact = spaceFacts[randomIndex];
  // Find the "Did You Know?" section
  const factSection = document.getElementById('didYouKnow');
  // Insert the fact into the section using a template literal
  factSection.innerHTML = `<div class="fact-card"><span class="fact-icon">🌟</span> ${fact}</div>`;
}

// Show a random fact when the page loads
showRandomFact();

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

// Function to display images and videos in the gallery
function displayImages(images) {
  // Clear the gallery
  gallery.innerHTML = '';
  if (images.length === 0) {
    // Show a message if no images found
    gallery.innerHTML = `<div class="placeholder"><div class="placeholder-icon">🔭</div><p>No images found for this date range.</p></div>`;
    return;
  }
  // Loop through each image or video and create a gallery item
  images.forEach(image => {
    // Create a div for each gallery item
    const item = document.createElement('div');
    item.className = 'gallery-item';

    // Check if the entry is an image
    if (image.media_type === 'image') {
      // Show the image
      item.innerHTML = `
        <img src="${image.url}" alt="${image.title}" />
        <p><strong>${image.title}</strong></p>
        <p>${image.date}</p>
        <p>${image.explanation}</p>
      `;
    } else if (image.media_type === 'video') {
      // Check if it's a YouTube video
      let videoContent = '';
      if (image.url.includes('youtube.com') || image.url.includes('youtu.be')) {
        // Extract YouTube video ID for embedding
        let videoId = '';
        const match = image.url.match(/(?:youtube\.com\/.*v=|youtu\.be\/)([^&?/]+)/);
        if (match && match[1]) {
          videoId = match[1];
        }
        if (videoId) {
          // Embed YouTube video
          videoContent = `
            <div class="video-embed">
              <iframe width="100%" height="200" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
            </div>
          `;
        } else {
          // If can't extract ID, show a link
          videoContent = `
            <a href="${image.url}" target="_blank" rel="noopener">
              <div class="video-link">Watch Video</div>
            </a>
          `;
        }
      } else {
        // For other videos, show a link to the video
        videoContent = `
          <a href="${image.url}" target="_blank" rel="noopener">
            <div class="video-link">Watch Video</div>
          </a>
        `;
      }
      // Add video content and details
      item.innerHTML = `
        ${videoContent}
        <p><strong>${image.title}</strong></p>
        <p>${image.date}</p>
        <p>${image.explanation}</p>
      `;
    }
    // Add the item to the gallery
    gallery.appendChild(item);
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
