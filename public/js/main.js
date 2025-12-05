// Configuration
const BASE_URL = window.location.origin;
let apiData = null;
let isRequestInProgress = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  initializeParticles();
  loadApis();
  setupEventListeners();
});

// Initialize App
function initializeApp() {
  // Load theme
  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
  }
  
  // Check API health
  checkHealth();
}

// Create particles
function initializeParticles() {
  const particlesContainer = document.getElementById('particles');
  const particleCount = 50;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 10 + 's';
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    particlesContainer.appendChild(particle);
  }
}

// Check API Health
async function checkHealth() {
  try {
    const response = await fetch(`${BASE_URL}/health`);
    if (response.ok) {
      console.log('✅ API is healthy');
    }
  } catch (error) {
    console.error('❌ API health check failed:', error);
    showToast('API connection failed', true);
  }
}

// Setup Event Listeners
function setupEventListeners() {
  // Search
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', debounce(handleSearch, 300));
  
  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', toggleTheme);
  
  // Filter button (placeholder)
  const filterBtn = document.getElementById('filterBtn');
  filterBtn.addEventListener('click', () => {
    showToast('Filters coming soon!');
  });
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Load APIs from JSON
async function loadApis() {
  try {
    const response = await fetch('/apis.json');
    if (!response.ok) throw new Error('Failed to load API data');
    
    apiData = await response.json();
    renderApiList();
    updateStats();
  } catch (error) {
    console.error('Error loading APIs:', error);
    document.getElementById('apiList').innerHTML = 
      '<p style="text-align: center; color: var(--error);">Failed to load API data</p>';
  }
}

// Update stats
function updateStats() {
  if (!apiData) return;
  
  let totalEndpoints = 0;
  apiData.categories.forEach(cat => {
    totalEndpoints += cat.items.length;
  });
  
  const counter = document.getElementById('totalEndpoints');
  animateCounter(counter, 0, totalEndpoints, 1000);
}

// Animate counter
function animateCounter(element, start, end, duration) {
  let startTime = null;
  
  function animate(currentTime) {
    if (!startTime) startTime = currentTime;
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = value;
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }
  
  requestAnimationFrame(animate);
}

// Render API List
function renderApiList() {
  const apiList = document.getElementById('apiList');
  if (!apiData || !apiData.categories) {
    apiList.innerHTML = '<p style="text-align: center;">No API data available</p>';
    return;
  }
  
  let html = '';
  
  apiData.categories.forEach((category, catIdx) => {
    const categoryIcon = getCategoryIcon(category.name);
    
    html += `
      <div class="category-card" data-category="${category.name}">
        <div class="category-header" onclick="toggleCategory(${catIdx})">
          <div class="category-info">
            <div class="category-icon">${categoryIcon}</div>
            <div class="category-text">
              <h3>${category.name}</h3>
              <p>${category.items.length} endpoints available</p>
            </div>
          </div>
          <svg class="category-toggle" id="cat-toggle-${catIdx}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
        <div class="category-content" id="cat-content-${catIdx}">
    `;
    
    category.items.forEach((item, epIdx) => {
      const statusClass = `status-${item.status || 'ready'}`;
      const statusText = (item.status || 'ready').toUpperCase();
      
      html += `
        <div class="endpoint-item" data-path="${item.path}" data-name="${item.name}" data-desc="${item.desc}">
          <div class="endpoint-header" onclick="toggleEndpoint(${catIdx}, ${epIdx})">
            <div class="endpoint-main">
              <span class="method-badge">GET</span>
              <div class="endpoint-details">
                <div class="endpoint-path">${item.path.split('?')[0]}</div>
                <div class="endpoint-meta">
                  <span class="endpoint-name">${item.name}</span>
                  <span class="status-badge ${statusClass}">${statusText}</span>
                </div>
              </div>
            </div>
            <svg class="endpoint-toggle" id="ep-toggle-${catIdx}-${epIdx}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
          <div class="endpoint-body" id="ep-body-${catIdx}-${epIdx}">
            <div class="endpoint-content">
              <p class="endpoint-description">${item.desc}</p>
              ${renderEndpointDetails(item, catIdx, epIdx)}
            </div>
          </div>
        </div>
      `;
    });
    
    html += `
        </div>
      </div>
    `;
  });
  
  apiList.innerHTML = html;
}

// Get category icon
function getCategoryIcon(categoryName) {
  if (categoryName.includes('AI')) return '🤖';
  if (categoryName.includes('DOWNLOADER')) return '📥';
  if (categoryName.includes('TOOLS')) return '🔧';
  return '📁';
}

// Render endpoint details
function renderEndpointDetails(item, catIdx, epIdx) {
  const path = item.path.split('?')[0];
  const fullUrl = `${BASE_URL}${path}`;
  
  let html = `
    <div class="endpoint-section">
      <div class="section-header">
        <h4 class="section-title">🔗 ENDPOINT</h4>
        <div style="display: flex; gap: 10px;">
          <button class="copy-btn" onclick="copyText('${path}', 'Path')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
            </svg>
            Copy Path
          </button>
          <button class="copy-btn" onclick="copyText('${fullUrl}', 'Full URL')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
            </svg>
            Copy URL
          </button>
        </div>
      </div>
      <div class="code-block">
        <code>${path}</code>
      </div>
    </div>
  `;
  
  if (item.status === 'ready' && item.params) {
    html += `
      <div class="endpoint-section">
        <h4 class="section-title">⚡ TRY IT OUT</h4>
        <form class="test-form" id="form-${catIdx}-${epIdx}" onsubmit="return handleSubmit(event, ${catIdx}, ${epIdx}, '${path}')">
    `;
    
    Object.keys(item.params).forEach(paramName => {
      const isRequired = true; // You can adjust this based on your needs
      html += `
        <div class="form-group">
          <label class="form-label">
            ${paramName} ${isRequired ? '<span class="required">*</span>' : ''}
          </label>
          <input 
            type="text" 
            name="${paramName}" 
            class="form-input" 
            placeholder="${item.params[paramName]}"
            ${isRequired ? 'required' : ''}
          >
        </div>
      `;
    });
    
    html += `
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">
              <span>EXECUTE</span>
            </button>
            <button type="button" class="btn btn-secondary" onclick="clearResponse(${catIdx}, ${epIdx})">
              <span>CLEAR</span>
            </button>
          </div>
        </form>
      </div>
      
      <div class="endpoint-section hidden" id="curl-section-${catIdx}-${epIdx}">
        <div class="section-header">
          <h4 class="section-title">📟 cURL COMMAND</h4>
          <button class="copy-btn" onclick="copyCurl(${catIdx}, ${epIdx})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
            </svg>
            Copy
          </button>
        </div>
        <div class="code-block">
          <code id="curl-code-${catIdx}-${epIdx}"></code>
        </div>
      </div>
      
      <div class="endpoint-section hidden" id="response-section-${catIdx}-${epIdx}">
        <h4 class="section-title">📄 RESPONSE</h4>
        <div class="response-content" id="response-content-${catIdx}-${epIdx}">
          <div class="cyber-loader" style="width: 60px; height: 60px; margin: 20px auto;"></div>
        </div>
      </div>
    `;
  } else {
    html += `
      <div class="endpoint-section">
        <div style="padding: 20px; background: rgba(255, 170, 0, 0.1); border: 1px solid var(--warning); border-radius: 8px; color: var(--warning); text-align: center;">
          ⚠️ This endpoint is not available for testing
        </div>
      </div>
    `;
  }
  
  return html;
}

// Toggle category
function toggleCategory(index) {
  const content = document.getElementById(`cat-content-${index}`);
  const toggle = document.getElementById(`cat-toggle-${index}`);
  
  content.classList.toggle('expanded');
  toggle.classList.toggle('rotated');
}

// Toggle endpoint
function toggleEndpoint(catIdx, epIdx) {
  const body = document.getElementById(`ep-body-${catIdx}-${epIdx}`);
  const toggle = document.getElementById(`ep-toggle-${catIdx}-${epIdx}`);
  
  body.classList.toggle('expanded');
  toggle.classList.toggle('rotated');
}

// Handle form submit
async function handleSubmit(event, catIdx, epIdx, path) {
  event.preventDefault();
  
  if (isRequestInProgress) {
    showToast('Please wait for current request', true);
    return false;
  }
  
  const form = event.target;
  const formData = new FormData(form);
  const params = new URLSearchParams();
  
  for (const [key, value] of formData.entries()) {
    if (value) params.append(key, value);
  }
  
  const fullUrl = `${BASE_URL}${path}?${params.toString()}`;
  
  // Show curl command
  const curlSection = document.getElementById(`curl-section-${catIdx}-${epIdx}`);
  const curlCode = document.getElementById(`curl-code-${catIdx}-${epIdx}`);
  curlCode.textContent = `curl -X GET "${fullUrl}"`;
  curlSection.classList.remove('hidden');
  
  // Show response section
  const responseSection = document.getElementById(`response-section-${catIdx}-${epIdx}`);
  const responseContent = document.getElementById(`response-content-${catIdx}-${epIdx}`);
  responseSection.classList.remove('hidden');
  responseContent.innerHTML = '<div class="cyber-loader" style="width: 60px; height: 60px; margin: 20px auto;"></div>';
  
  // Disable submit button
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  
  isRequestInProgress = true;
  showLoading();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    const response = await fetch(fullUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      responseContent.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
      responseContent.classList.remove('error');
    } else if (contentType?.startsWith('image/')) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      responseContent.innerHTML = `<div class="media-preview"><img src="${url}" class="media-image" alt="Response"></div>`;
      responseContent.classList.remove('error');
    } else if (contentType?.startsWith('video/')) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      responseContent.innerHTML = `
        <div class="media-preview">
          <video controls class="media-video">
            <source src="${url}" type="${contentType}">
          </video>
        </div>
      `;
      responseContent.classList.remove('error');
    } else {
      const text = await response.text();
      
      // Check if text is a URL
      if (isUrl(text)) {
        if (isImageUrl(text)) {
          responseContent.innerHTML = `<div class="media-preview"><img src="${text}" class="media-image" alt="Response"></div>`;
        } else if (isVideoUrl(text)) {
          responseContent.innerHTML = `
            <div class="media-preview">
              <video controls class="media-video">
                <source src="${text}">
              </video>
            </div>
          `;
        } else {
          responseContent.innerHTML = `<pre>${text}</pre>`;
        }
      } else {
        responseContent.innerHTML = `<pre>${text}</pre>`;
      }
      responseContent.classList.remove('error');
    }
    
    showToast('Request completed successfully!');
    
  } catch (error) {
    const errorMsg = error.name === 'AbortError' ? 'Request timeout (30s)' : error.message;
    responseContent.innerHTML = `<pre>Error: ${errorMsg}</pre>`;
    responseContent.classList.add('error');
    showToast('Request failed!', true);
  } finally {
    isRequestInProgress = false;
    hideLoading();
    submitBtn.disabled = false;
  }
  
  return false;
}

// Helper functions
function isUrl(string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

function isImageUrl(url) {
  return /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(url) || url.includes('image');
}

function isVideoUrl(url) {
  return /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(url) || url.includes('video');
}

// Copy functions
function copyText(text, type = 'Text') {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`${type} copied to clipboard!`);
  }).catch(() => {
    showToast('Failed to copy', true);
  });
}

function copyCurl(catIdx, epIdx) {
  const curlCode = document.getElementById(`curl-code-${catIdx}-${epIdx}`);
  copyText(curlCode.textContent, 'cURL command');
}

// Clear response
function clearResponse(catIdx, epIdx) {
  const responseSection = document.getElementById(`response-section-${catIdx}-${epIdx}`);
  const curlSection = document.getElementById(`curl-section-${catIdx}-${epIdx}`);
  
  responseSection.classList.add('hidden');
  curlSection.classList.add('hidden');
}

// Search handler
function handleSearch() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
  const noResults = document.getElementById('noResults');
  
  if (searchTerm === '') {
    // Show all
    document.querySelectorAll('.category-card').forEach(card => {
      card.style.display = 'block';
    });
    document.querySelectorAll('.endpoint-item').forEach(item => {
      item.style.display = 'block';
    });
    noResults.classList.add('hidden');
    return;
  }
  
  let hasResults = false;
  
  document.querySelectorAll('.category-card').forEach(card => {
    const categoryName = card.dataset.category.toLowerCase();
    const endpoints = card.querySelectorAll('.endpoint-item');
    let categoryHasVisibleEndpoints = false;
    
    endpoints.forEach(endpoint => {
      const path = endpoint.dataset.path.toLowerCase();
      const name = endpoint.dataset.name.toLowerCase();
      const desc = endpoint.dataset.desc.toLowerCase();
      
      const matches = path.includes(searchTerm) || 
                     name.includes(searchTerm) || 
                     desc.includes(searchTerm) ||
                     categoryName.includes(searchTerm);
      
      if (matches) {
        endpoint.style.display = 'block';
        categoryHasVisibleEndpoints = true;
        hasResults = true;
      } else {
        endpoint.style.display = 'none';
      }
    });
    
    card.style.display = categoryHasVisibleEndpoints ? 'block' : 'none';
  });
  
  if (hasResults) {
    noResults.classList.add('hidden');
  } else {
    noResults.classList.remove('hidden');
  }
}

// Theme toggle
function toggleTheme() {
  const body = document.body;
  const isLight = body.classList.toggle('light-theme');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

// Loading functions
function showLoading() {
  document.getElementById('loadingOverlay').classList.add('active');
}

function hideLoading() {
  document.getElementById('loadingOverlay').classList.remove('active');
}

// Toast function
function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  const toastIcon = document.getElementById('toastIcon');
  
  toastMessage.textContent = message;
  
  if (isError) {
    toastIcon.innerHTML = `
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
    `;
    toastIcon.parentElement.style.background = 'linear-gradient(135deg, var(--error), var(--accent))';
  } else {
    toastIcon.innerHTML = `
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
      </svg>
    `;
    toastIcon.parentElement.style.background = 'linear-gradient(135deg, var(--primary), var(--secondary))';
  }
  
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}