# YouTube AI Video Filter

A Chrome extension that uses AI to filter YouTube videos based on your interests and learning goals.

## Features

- **AI-Powered Filtering**: Uses Google's Gemini AI to analyze video titles and channels
- **Educational Focus**: Filters content to show only educational videos related to your interests
- **Real-time Processing**: Automatically filters videos as you browse YouTube
- **Batch Processing**: Efficiently processes multiple videos to minimize API calls
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

## Installation

1. Clone this repository
2. Get a Gemini API key from [Google AI Studio](https://ai.google.dev/)
3. Open `contentScript.js` and replace `YOUR_GEMINI_API_KEY_HERE` with your actual API key
4. Open Chrome and navigate to `chrome://extensions/`
5. Enable "Developer mode"
6. Click "Load unpacked" and select the extension folder
7. The extension will automatically start filtering YouTube videos

## Configuration

To modify the topics or AI model:
1. Edit the `allowedTopics` array in `contentScript.js`
2. Update the AI API endpoint or model if needed
3. Reload the extension in Chrome

## Requirements

- Chrome browser with extension support
- Internet connection for AI API calls
- YouTube access

## Privacy

This extension:
- Only processes video titles and channel names visible on YouTube
- Sends data to Google's Gemini AI for analysis
- Does not store personal data locally
- Does not track browsing history

## License

This project is open source and available under the MIT License.
