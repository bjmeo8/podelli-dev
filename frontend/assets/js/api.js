// API Client for Podelli Backend
class PodelliAPI {
    constructor() {
        this.baseURL = 'http://localhost:8000/api/v1';
        this.token = null;
    }

    setToken(token) {
        this.token = token;
    }

    getHeaders() {
        const headers = { 'Content-Type': 'application/json' };
        if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
        return headers;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: { ...this.getHeaders(), ...options.headers }
        };

        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'API request failed');
            }
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async getMissions(universeId) {
        return this.request(`/missions?universe_id=${universeId}`);
    }

    async getMission(missionId) {
        return this.request(`/missions/${missionId}`);
    }

    async getEpisodes(missionId) {
        return this.request(`/episodes?mission_id=${missionId}`);
    }

    async getEpisode(episodeId) {
        return this.request(`/episodes/${episodeId}`);
    }

    async getAction(actionId) {
        return this.request(`/actions/${actionId}`);
    }

    async getPode(podeId) {
        return this.request(`/podes/${podeId}`);
    }

    async getMissionPodes(missionId) {
        return this.request(`/podes?mission_id=${missionId}`);
    }

    async submitProgress(progressData) {
        return this.request('/progress', {
            method: 'POST',
            body: JSON.stringify(progressData)
        });
    }

    async getMissionProgress(missionId) {
        return this.request(`/progress/mission/${missionId}`);
    }

    async getUserProgress() {
        return this.request('/progress/me');
    }

    async getLeaderboard(limit = 50) {
        return this.request(`/leaderboard?limit=${limit}`);
    }

    async getProfile() {
        return this.request('/users/me');
    }

    async updateProfile(profileData) {
        return this.request('/users/me', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }

    async evaluateSpeaking(audioBlob, expectedText, language) {
        const formData = new FormData();
        formData.append('audio', audioBlob);
        formData.append('expected_text', expectedText);
        formData.append('language', language);

        const headers = this.getHeaders();
        delete headers['Content-Type'];

        return this.request('/speaking/evaluate', {
            method: 'POST',
            headers: headers,
            body: formData
        });
    }
}

const api = new PodelliAPI();
