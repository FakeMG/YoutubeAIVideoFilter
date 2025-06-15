document.addEventListener('DOMContentLoaded', function() {
  const apiKeyInput = document.getElementById('apiKey');
  const saveButton = document.getElementById('save');
  const toggleButton = document.getElementById('toggleVisibility');
  const statusDiv = document.getElementById('status');
  
  let isVisible = false;
  
  // Load existing API key
  chrome.storage.sync.get(['GEMINI_API_KEY'], function(result) {
    if (result.GEMINI_API_KEY) {
      apiKeyInput.value = result.GEMINI_API_KEY;
      showStatus('API key loaded', 'info');
    }
  });
  
  // Save API key
  saveButton.addEventListener('click', function() {
    const apiKey = apiKeyInput.value.trim();
    
    if (apiKey) {
      chrome.storage.sync.set({
        'GEMINI_API_KEY': apiKey
      }, function() {
        showStatus('API key saved successfully!', 'success');
      });
    } else {
      showStatus('Please enter an API key', 'error');
    }
  });
  
  // Toggle API key visibility
  toggleButton.addEventListener('click', function() {
    if (isVisible) {
      apiKeyInput.type = 'password';
      toggleButton.textContent = 'Show';
      isVisible = false;
    } else {
      apiKeyInput.type = 'text';
      toggleButton.textContent = 'Hide';
      isVisible = true;
    }
  });
  
  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = type;
    
    setTimeout(() => {
      statusDiv.textContent = '';
      statusDiv.className = '';
    }, 3000);
  }
});