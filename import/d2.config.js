/** @type {import('@dhis2/cli-app-scripts').D2Config} */
const config = {
    type: 'app',

    entryPoints: {
        app: './src/App.jsx',
    },

    direction: 'auto',
    
    locales: ['en', 'km'],
    
    // App icon configuration
    icon: './dhis2-app-icon.png',
}

module.exports = config
