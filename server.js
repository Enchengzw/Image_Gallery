import dotenv from 'dotenv';
import fetch from 'node-fetch';
import express from 'express';

dotenv.config();
const apiURL= process.env.API_URL;
const accessKey= process.env.ACCESS_KEY;
const secretKey= process.env.SECRET_KEY;
const app = express();

app.use(express.static("Public"));

app.get('/photos/random', async (req, res) => {
    try {
        const response = await fetch(`${apiURL}/photos/random?client_id=${accessKey}&count=4`);
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
        if (!query) {
            res.status(400).send('Missing query parameter');
            return;
        }

        const response = await fetch(`${apiURL}/search/photos?query=${encodeURIComponent(query)}&client_id=${accessKey}&per_page=4`);
        if (!response.ok) {
            throw new Error('Failed to fetch data from API');
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Fetch error', error);
    }
});

app.listen(3000);