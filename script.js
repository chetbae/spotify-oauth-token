// Spotify OAuth Token Generator
// Configuration and global variables
const STORAGE_KEY = 'spotify_token_generator_config';
let appConfig = {
    clientId: '',
    redirectUri: window.location.href.split('#')[0], // Current URL without hash
    scopes: [],
    responseType: 'token' // Default to token for backward compatibility
};

// Available Spotify scopes with descriptions
const availableScopes = {
    // Listening History
    'user-read-recently-played': 'Access your recently played items',
    'user-top-read': 'Access your top artists and tracks',
    'user-read-playback-position': 'Read your playback position in content',
    
    // Spotify Connect
    'user-read-playback-state': 'Read your current playback state',
    'user-modify-playback-state': 'Control playback on your Spotify clients',
    'user-read-currently-playing': 'Read your currently playing content',
    
    // Playback
    'streaming': 'Play content via the Spotify web API',
    'app-remote-control': 'Communicate with the Spotify app on devices',
    
    // Users
    'user-read-email': 'Get your email address',
    'user-read-private': 'Access your subscription details',
    
    // Playlists
    'playlist-read-private': 'Access your private playlists',
    'playlist-read-collaborative': 'Access your collaborative playlists',
    'playlist-modify-private': 'Manage your private playlists',
    'playlist-modify-public': 'Manage your public playlists',
    
    // Library
    'user-library-modify': 'Manage your saved content',
    'user-library-read': 'Access your saved content',
    
    // Follow
    'user-follow-modify': 'Manage who you follow',
    'user-follow-read': 'Access your followers and who you follow'
};

// DOM Elements
const elements = {
    clientIdInput: document.getElementById('client-id'),
    redirectUriInput: document.getElementById('redirect-uri'),
    responseTypeToken: document.getElementById('response-token'),
    responseTypeCode: document.getElementById('response-code'),
    scopesGrid: document.getElementById('scopes-grid'),
    selectAllScopesBtn: document.getElementById('select-all-scopes'),
    deselectAllScopesBtn: document.getElementById('deselect-all-scopes'),
    saveConfigBtn: document.getElementById('save-config'),
    configSection: document.getElementById('config-section'),
    authorizeSection: document.getElementById('authorize-section'),
    tokenSection: document.getElementById('token-section'),
    loadingSection: document.getElementById('loading-section'),
    authorizeButton: document.getElementById('authorize-button'),
    newTokenButton: document.getElementById('new-token-button'),
    resetConfigButton: document.getElementById('reset-config-button'),
    copyAccessTokenButton: document.getElementById('copy-access-token'),
    copyRedirectUriButton: document.getElementById('copy-redirect-uri'),
    accessTokenElement: document.getElementById('access-token'),
    tokenTypeElement: document.getElementById('token-type'),
    expiresInElement: document.getElementById('expires-in'),
    scopeElement: document.getElementById('scope'),
    statusMessage: document.getElementById('status-message')
};

// Initialize the application
function init() {
    // Populate the redirect URI
    elements.redirectUriInput.value = appConfig.redirectUri;
    
    // Load configuration if available
    loadConfig();
    
    // Create scope checkboxes
    createScopeCheckboxes();
    
    // Set up event listeners
    setupEventListeners();
    
    // Check URL hash for token (for when page reloads after redirect)
    checkUrlForToken();
}

// Create scope checkboxes
function createScopeCheckboxes() {
    Object.entries(availableScopes).forEach(([scope, description]) => {
        const scopeItem = document.createElement('div');
        scopeItem.className = 'scope-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `scope-${scope}`;
        checkbox.name = 'scopes';
        checkbox.value = scope;
        checkbox.checked = appConfig.scopes.includes(scope);
        
        const label = document.createElement('label');
        label.setAttribute('for', `scope-${scope}`);
        label.textContent = description;
        label.title = scope;
        
        scopeItem.appendChild(checkbox);
        scopeItem.appendChild(label);
        elements.scopesGrid.appendChild(scopeItem);
    });
}

// Set up event listeners
function setupEventListeners() {
    // Config section
    elements.selectAllScopesBtn.addEventListener('click', selectAllScopes);
    elements.deselectAllScopesBtn.addEventListener('click', deselectAllScopes);
    elements.saveConfigBtn.addEventListener('click', saveConfig);
    elements.copyRedirectUriButton.addEventListener('click', copyRedirectUri);
    
    // Auth section
    elements.authorizeButton.addEventListener('click', startAuthFlow);
    
    // Token section
    elements.newTokenButton.addEventListener('click', startAuthFlow);
    elements.resetConfigButton.addEventListener('click', resetConfig);
    elements.copyAccessTokenButton.addEventListener('click', copyAccessToken);
    
    // Listen for hash changes (for token redirect)
    window.addEventListener('hashchange', checkUrlForToken);
}

// Select all scopes
function selectAllScopes() {
    document.querySelectorAll('input[name="scopes"]').forEach(checkbox => {
        checkbox.checked = true;
    });
}

// Deselect all scopes
function deselectAllScopes() {
    document.querySelectorAll('input[name="scopes"]').forEach(checkbox => {
        checkbox.checked = false;
    });
}

// Save configuration
function saveConfig() {
    const clientId = elements.clientIdInput.value.trim();
    
    if (!clientId) {
        showStatus('Please enter your Spotify Client ID.', 'error');
        return;
    }
    
    // Get selected scopes
    const selectedScopes = Array.from(
        document.querySelectorAll('input[name="scopes"]:checked')
    ).map(checkbox => checkbox.value);
    
    if (selectedScopes.length === 0) {
        showStatus('Please select at least one scope.', 'error');
        return;
    }

    // Get selected response type
    const responseType = elements.responseTypeToken.checked ? 'token' : 'code';
    
    // Update config
    appConfig.clientId = clientId;
    appConfig.scopes = selectedScopes;
    appConfig.responseType = responseType;
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appConfig));
    
    // Update authorize section text based on response type
    const responseTypeText = responseType === 'token' ? 'access token' : 'authorization code';
    elements.authorizeSection.querySelector('h2').textContent = `Get Your ${responseTypeText === 'access token' ? 'Access Token' : 'Authorization Code'}`;
    elements.authorizeSection.querySelector('p').textContent = `Click the button below to start the Spotify OAuth flow. After authorizing, you'll be automatically redirected back here with your ${responseTypeText}.`;
    
    // Show authorization section
    elements.configSection.classList.add('hidden');
    elements.authorizeSection.classList.remove('hidden');
    
    showStatus('Configuration saved. You can now start the authorization flow.', 'success');
}

// Load configuration from localStorage
function loadConfig() {
    const savedConfig = localStorage.getItem(STORAGE_KEY);
    
    if (savedConfig) {
        appConfig = JSON.parse(savedConfig);
        
        // Populate form fields
        elements.clientIdInput.value = appConfig.clientId;
        
        // Set response type radio button
        if (appConfig.responseType === 'code') {
            elements.responseTypeCode.checked = true;
        } else {
            elements.responseTypeToken.checked = true;
        }
        
        // If config exists, show auth section by default
        if (appConfig.clientId && appConfig.scopes.length > 0) {
            elements.configSection.classList.add('hidden');
            elements.authorizeSection.classList.remove('hidden');
        }
    }
}

// Reset configuration
function resetConfig() {
    localStorage.removeItem(STORAGE_KEY);
    appConfig = {
        clientId: '',
        redirectUri: window.location.href.split('#')[0],
        scopes: [],
        responseType: 'token' // Default to token for backward compatibility
    };
    
    // Clear form
    elements.clientIdInput.value = '';
    document.querySelectorAll('input[name="scopes"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Show config section
    elements.configSection.classList.remove('hidden');
    elements.authorizeSection.classList.add('hidden');
    elements.tokenSection.classList.add('hidden');
    
    showStatus('Configuration reset. Please enter your details.', 'success');
}

// Start the OAuth flow
function startAuthFlow() {
    const authUrl = new URL('https://accounts.spotify.com/authorize');
    
    // Add query parameters
    authUrl.searchParams.append('client_id', appConfig.clientId);
    authUrl.searchParams.append('response_type', appConfig.responseType);
    authUrl.searchParams.append('redirect_uri', appConfig.redirectUri);
    authUrl.searchParams.append('scope', appConfig.scopes.join(' '));
    authUrl.searchParams.append('show_dialog', 'true'); // Force the user to approve the app again
    
    // Show loading spinner
    elements.authorizeButton.classList.add('hidden');
    elements.loadingSection.classList.remove('hidden');
    
    // Redirect to Spotify authorization page in the same window
    window.location.href = authUrl.toString();
}

// Check URL for token or code (after redirect)
function checkUrlForToken() {
    // Check for authorization code in URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
        displayAuthCode(code);
        return;
    }

    // Check for token in URL hash
    const hash = window.location.hash.substring(1);
    if (hash) {
        const tokenInfo = parseUrlFragment(window.location.href);
        if (tokenInfo && tokenInfo.access_token) {
            displayTokenInfo(tokenInfo);
        } else {
            showStatus('Authorization failed or was cancelled.', 'error');
        }
        // Clear the hash from the URL to prevent token leakage
        history.replaceState(null, null, window.location.pathname + window.location.search);
    }
    
    // Hide loading section if it's visible
    if (!elements.loadingSection.classList.contains('hidden')) {
        elements.loadingSection.classList.add('hidden');
        elements.authorizeButton.classList.remove('hidden');
    }
}

// Display authorization code
function displayAuthCode(code) {
    elements.accessTokenElement.textContent = code;
    elements.tokenTypeElement.textContent = 'Authorization Code';
    elements.expiresInElement.textContent = 'N/A - One-time use code';
    elements.scopeElement.textContent = appConfig.scopes.join(' ');
    
    elements.authorizeSection.classList.add('hidden');
    elements.configSection.classList.add('hidden');
    elements.tokenSection.classList.remove('hidden');
    
    showStatus('Authorization code received! Use this code to request an access token from your backend.', 'success');
}

// Parse URL fragment to extract token and related info
function parseUrlFragment(url) {
    try {
        // Extract the fragment (everything after #)
        const hashPosition = url.indexOf('#');
        if (hashPosition === -1) return null;
        
        const fragment = url.substring(hashPosition + 1);
        
        // Parse the fragment into key-value pairs
        return fragment.split('&').reduce((result, item) => {
            const parts = item.split('=');
            result[parts[0]] = decodeURIComponent(parts[1]);
            return result;
        }, {});
    } catch (error) {
        console.error('Error parsing URL:', error);
        return null;
    }
}

// Display token information
function displayTokenInfo(tokenInfo) {
    elements.accessTokenElement.textContent = tokenInfo.access_token;
    elements.tokenTypeElement.textContent = tokenInfo.token_type || 'bearer';
    elements.expiresInElement.textContent = tokenInfo.expires_in || '3600';
    elements.scopeElement.textContent = tokenInfo.scope || appConfig.scopes.join(' ');
    
    elements.authorizeSection.classList.add('hidden');
    elements.configSection.classList.add('hidden');
    elements.tokenSection.classList.remove('hidden');
    
    showStatus('Token extracted successfully! Your access token is ready to use.', 'success');
}

// Show status message
function showStatus(message, type) {
    elements.statusMessage.textContent = message;
    elements.statusMessage.className = `status ${type}`;
    elements.statusMessage.classList.remove('hidden');
}

// Copy access token to clipboard
function copyAccessToken() {
    const tokenText = elements.accessTokenElement.textContent;
    
    navigator.clipboard.writeText(tokenText)
        .then(() => {
            elements.copyAccessTokenButton.textContent = 'Copied!';
            setTimeout(() => {
                elements.copyAccessTokenButton.textContent = 'Copy';
            }, 2000);
        })
        .catch(err => {
            console.error('Could not copy text: ', err);
            alert('Failed to copy to clipboard. Please select and copy manually.');
        });
}

// Copy redirect URI to clipboard
function copyRedirectUri() {
    const redirectUri = elements.redirectUriInput.value;
    
    navigator.clipboard.writeText(redirectUri)
        .then(() => {
            elements.copyRedirectUriButton.textContent = 'Copied!';
            setTimeout(() => {
                elements.copyRedirectUriButton.textContent = 'Copy';
            }, 2000);
        })
        .catch(err => {
            console.error('Could not copy text: ', err);
            alert('Failed to copy to clipboard. Please select and copy manually.');
        });
}

// Initialize the app when DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);