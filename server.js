'use strict';

const path = require('path');
const express = require('express');
const fetch = require('node-fetch');

const config = require('./config/config');

const app = express();
const PORT = process.env.PORT || 3000;
const API_BASE_URL = 'https://www.behance.net/v2';
const BEHANCE_CLIENT_ID = process.env.BEHANCE_CLIENT_ID || (config.behance && config.behance.clientId) || '';
const PUBLIC_DIR = path.join(__dirname, 'public');

const buildEndpoint = (suffix) => {
    const url = new URL(`${API_BASE_URL}${suffix}`);
    url.searchParams.set('api_key', BEHANCE_CLIENT_ID);
    return url.toString();
};

const forwardBehanceRequest = async (req, res) => {
    const user = (req.query.user || '').trim();

    if (!user) {
        return res.status(400).json({
            http_code: 400,
            error: 'Query parameter "user" is required.'
        });
    }

    if (!BEHANCE_CLIENT_ID) {
        return res.status(500).json({
            http_code: 500,
            error: 'Behance client ID not provided. Update config/config.js or set BEHANCE_CLIENT_ID.'
        });
    }

    try {
        const safeUser = encodeURIComponent(user);
        const profileEndpoint = buildEndpoint(`/users/${safeUser}`);
        const projectsEndpoint = buildEndpoint(`/users/${safeUser}/projects`);

        const [profileResponse, projectsResponse] = await Promise.all([
            fetch(profileEndpoint),
            fetch(projectsEndpoint)
        ]);

        if (!profileResponse.ok) {
            const body = await profileResponse.json().catch(() => ({}));
            return res.status(profileResponse.status).json(Object.assign({
                http_code: profileResponse.status
            }, body));
        }

        if (!projectsResponse.ok) {
            const body = await projectsResponse.json().catch(() => ({}));
            return res.status(projectsResponse.status).json(Object.assign({
                http_code: projectsResponse.status
            }, body));
        }

        const [profile, projects] = await Promise.all([
            profileResponse.json(),
            projectsResponse.json()
        ]);

        res.json(Object.assign({ http_code: 200 }, profile, projects));
    } catch (error) {
        console.error('Behance proxy error:', error);
        res.status(502).json({
            http_code: 502,
            error: 'There was a problem reaching the Behance API.'
        });
    }
};

const forwardProjectRequest = async (req, res) => {
    const projectId = (req.params.projectId || '').trim();

    if (!projectId) {
        return res.status(400).json({
            http_code: 400,
            error: 'Project ID is required.'
        });
    }

    if (!BEHANCE_CLIENT_ID) {
        return res.status(500).json({
            http_code: 500,
            error: 'Behance client ID not provided. Update config/config.js or set BEHANCE_CLIENT_ID.'
        });
    }

    try {
        const safeProjectId = encodeURIComponent(projectId);
        const endpoint = buildEndpoint(`/projects/${safeProjectId}`);
        const response = await fetch(endpoint);
        const body = await response.json().catch(() => ({}));

        if (!response.ok) {
            return res.status(response.status).json(Object.assign({
                http_code: response.status
            }, body));
        }

        res.json(Object.assign({ http_code: 200 }, body));
    } catch (error) {
        console.error('Behance project fetch error:', error);
        res.status(502).json({
            http_code: 502,
            error: 'There was a problem reaching the Behance API.'
        });
    }
};

app.get('/api/behance', forwardBehanceRequest);
app.get('/api/behance/projects/:projectId', forwardProjectRequest);

app.use(express.static(PUBLIC_DIR));

app.get('/about', (_, res) => {
    res.sendFile(path.join(PUBLIC_DIR, 'about.html'));
});

app.get('/contact', (_, res) => {
    res.sendFile(path.join(PUBLIC_DIR, 'contact.html'));
});

app.get('*', (_, res) => {
    res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Behance app listening on http://localhost:${PORT}`);
});
