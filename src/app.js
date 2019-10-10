const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Set handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Levi'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Levi'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Levi',
        helpText: 'This is your help message.'
    });
});

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        res.send({
            error: 'You must provide an address!'
        });
        return;
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            res.send({
                error
            });
            return;
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                res.send({
                    error
                });
                return;
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            });
        });
    });
});

// app.get('/products', (req, res) => {
//     if (!req.query.search) {
//         res.send({
//             error: 'You must provide a search term!'
//         });
//         return;
//     }

//     console.log(req.query.search);
//     res.send({
//         products: []
//     });
// });

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Levi',
        errorText: 'Help article not found.'
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Levi',
        errorText: 'Page not found.'
    });
});

app.listen(port, () => {
    console.log('Server is up on port ' + port + '.');
});