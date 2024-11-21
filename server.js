import dotenv from 'dotenv';
import fetch from 'node-fetch';
import express from 'express';

dotenv.config();
const   apiURL= process.env.API_URL;
const   accessKey= process.env.ACCESS_KEY;
const   secretKey= process.env.SECRET_KEY;
const   app = express();
let     access_token = '';

app.use(express.static("Public"));

app.get('/photos/random', async (req, res) => {
    try {
        const page = req.query.page || 1;
        const response = await fetch(`${apiURL}/photos/random?client_id=${accessKey}&count=1&page=${page}`);
        if (!response.ok) {
            throw new Error('Failed to fetch data from API');
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Fetch error', error);
    }
});

app.get('/search/photos', async (req, res) => {
    try {
        const query = req.query.query;
        const page = req.query.page || 1;
        if (!query) {
            res.status(400).send('Missing query parameter');
            return;
        }

        const response = await fetch(`${apiURL}/search/photos?query=${encodeURIComponent(query)}&client_id=${accessKey}&per_page=1&page=${page}`);
        if (!response.ok) {
            throw new Error('Failed to fetch data from API');
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Fetch error', error);
    }
});

app.get('/oauth/authorize', (req, res) => {
    let redirect_uri = 'http://localhost:3000/oauth/callback';
    res.redirect(`https://unsplash.com/oauth/authorize?client_id=${accessKey}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=code&scope=public`);
});

app.get('/oauth/callback', (req, res) => {
    const authorizationCode = req.query.code;
    const clientID = accessKey;
    const clientSecret = secretKey;
    const redirectUri = 'http://localhost:3000/oauth/callback';

    fetch('https://unsplash.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: clientID,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            code: authorizationCode,
            grant_type: 'authorization_code',
        }),
    })
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch access token');
            return response.json();
        })
        .then(data => {
            console.log('Access Token:', data.access_token);
            access_token = data.access_token;
            res.redirect("http://localhost:3000");
        })
        .catch(error => {
            console.error('Error exchanging authorization code:', error);
            res.status(500).json({ success: false, error: error.message });
        });
});

app.get('/logout', (req, res) => {
    access_token = '';
    console.log('Logged out');
    res.json({ success: true });
});

app.listen(3000);