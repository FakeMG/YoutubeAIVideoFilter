# YouTube AI Video Filter

A Chrome extension that uses AI to filter YouTube videos based on your interests and learning goals.

## Features

- **AI-Powered Filtering**: Uses Google's Gemini AI to analyze video titles and channels
- **Educational Focus**: Filters content to show only educational videos related to your interests
- **Real-time Processing**: Automatically filters videos as you browse YouTube
- **Batch Processing**: Efficiently processes multiple videos to minimize API calls
- **Secure API Key Storage**: Safely stores your Gemini API key using Chrome's encrypted storage
- **Easy Configuration**: Simple popup interface for managing settings
- **Customizable Topics**: Currently configured for game development, programming, art, AI, self-improvement, and more

## How It Works

The extension:
1. Monitors YouTube's video grid for new content
2. Extracts video titles and channel names
3. Sends batches of videos to AI for analysis
4. Hides videos that don't match your educational interests
5. Maintains a clean, focused YouTube experience

## Allowed Topics

The current configuration filters for these educational topics:
- Game development and game design
- Programming and software development
- Art and sound design
- AI and technology
- Self-improvement and productivity
- Psychology and philosophy
- Science
- Steam gaming news

## Installation

1. Clone this repository
2. Get a Gemini API key from [Google AI Studio](https://ai.google.dev/)
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode"
5. Click "Load unpacked" and select the extension folder
6. Click on the extension icon in the toolbar
7. Enter your Gemini API key in the popup and click "Save"
8. The extension will automatically start filtering YouTube videos

## Configuration

### Setting Up Your API Key
1. Click the extension icon in your Chrome toolbar
2. Enter your Gemini API key in the input field
3. Click "Save" to securely store the key
4. Use the "Show/Hide" button to reveal or mask your API key

### Customizing Topics
To modify the topics:
1. Edit the `allowedTopics` array in `contentScript.js`
2. Reload the extension in Chrome

### API Settings
- **Batch Size**: Processes 10 videos at a time for efficiency
- **API Delay**: 4-second delay between API calls to respect rate limits
- **Model**: Uses Gemini 2.0 Flash for fast, accurate filtering

## License

This project is open source and available under the MIT License.
