# Spotify OAuth Token Generator

A simple, client-side web application that helps developers get Spotify access tokens using the OAuth flow.

## Features

- No server required - works entirely in the browser
- Customizable Spotify API scopes
- Stores your configuration for convenience
- Simple copy-paste workflow for redirects
- Works with any Spotify Developer account
- Mobile-friendly interface

## Usage

1. Visit the [Spotify OAuth Token Generator](https://yourusername.github.io/spotify-token-generator)
2. Enter your Client ID from the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
3. Copy the provided Redirect URI and add it to your app's Redirect URIs in the Spotify Developer Dashboard
4. Select the scopes (permissions) your app needs
5. Click "Start Authorization Flow" and complete the Spotify authorization process
6. You'll be automatically redirected back with your access token
7. Copy the token and use it in your application

## Why Use This Tool?

This tool helps solve common challenges when working with Spotify's OAuth process:

- **Simple workflow**: Get tokens quickly without complex setup
- **Customizable scopes**: Experiment with different permission combinations
- **Educational**: Understand how OAuth flows work
- **No backend required**: Pure client-side implementation

## Self-Hosting

You can host this tool yourself:

1. Fork this repository
2. Enable GitHub Pages in your repository settings
3. Access your version at `https://yourusername.github.io/spotify-token-generator`

Or simply download the files and open `index.html` in your browser.

## Security Notes

- This application runs entirely in your browser
- No data is sent to any server other than Spotify's authorization servers
- Your Spotify credentials are never seen or stored by this tool
- Client IDs are stored in your browser's localStorage
- Access tokens are never stored persistently

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) documentation
- [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)