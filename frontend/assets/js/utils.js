// Utility Functions
function showLoading(containerId = 'main-content') {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '<div class="flex items-center justify-center h-64"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>';
    }
}

function showError(message, containerId = 'main-content') {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `<div class="flex items-center justify-center h-64"><div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"><strong>Error!</strong> ${message}</div></div>`;
    }
}

function showToast(message, type = 'info', duration = 3000) {
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    };

    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), duration);
}

function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getCEFRBadgeColor(level) {
    const colors = {
        A0: 'bg-gray-400', A1: 'bg-green-400', A2: 'bg-green-500',
        B1: 'bg-blue-400', B2: 'bg-blue-500',
        C1: 'bg-purple-400', C2: 'bg-purple-500'
    };
    return colors[level] || 'bg-gray-400';
}

function getLanguageFlag(langCode) {
    const flags = {
        'fr': '🇫🇷', 'en': '🇬🇧', 'es': '🇪🇸',
        'de': '🇩🇪', 'it': '🇮🇹', 'pt-pt': '🇵🇹', 'pt-br': '🇧🇷'
    };
    return flags[langCode.toLowerCase()] || '🌍';
}

function getLanguageName(langCode) {
    const names = {
        'fr': 'French', 'en': 'English', 'es': 'Spanish',
        'de': 'German', 'it': 'Italian',
        'pt-pt': 'Portuguese (Portugal)', 'pt-br': 'Portuguese (Brazil)'
    };
    return names[langCode.toLowerCase()] || langCode;
}
