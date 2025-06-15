//wait for 5 seconds
setTimeout(async () => {
  console.log("5 seconds passed");

  // Observer to watch for changes in the DOM
  const observer = new MutationObserver(async () => {
    await processVideos();
  });

  // Start observing the section where videos are loaded
  const targetNode = document.querySelector('ytd-rich-grid-renderer');
  if (targetNode) {
    observer.observe(targetNode, { childList: true, subtree: true });
    console.log("Observer started");
  }

  await processVideos();
}, 5000);

const API_DELAY = 4000;
const BATCH_SIZE = 10; // Number of videos to process in each batch
let lastAPICallTime = 0;
let requestQueue = [];
let isProcessingQueue = false;
let processedVideos = new Set(); // Track videos that have been processed or are in queue

async function processVideos() {
  const videoInfos = getVideoInfos();

  // Add videos to queue instead of processing immediately
  for (const videoInfo of videoInfos) {
    const videoKey = `${videoInfo.title}|${videoInfo.channel}`; // Use title+channel as unique key
    if (!processedVideos.has(videoKey)) {
      requestQueue.push(videoInfo);
      processedVideos.add(videoKey); // Mark as queued
    }
  }

  // Start processing queue only if we have more than BATCH_SIZE videos and not already processing
  if (!isProcessingQueue && requestQueue.length > BATCH_SIZE) {
    processRequestQueue();
  }
}

function getVideoInfos() {
  const videoElements = Array.from(document.querySelectorAll('#video-title'))
    .filter(video => video.closest('ytd-rich-item-renderer')?.style.display !== 'none');
  const videoInfos = [];

  videoElements.forEach(video => {
    const titleText = video.innerText || video.textContent;

    // Find the channel name - it's usually in a nearby element
    const richItemRenderer = video.closest('ytd-rich-item-renderer');
    let channelName = 'Unknown Channel';

    if (richItemRenderer) {
      // Try multiple selectors for channel name
      const channelElement = richItemRenderer.querySelector('#channel-name #text') ||
        richItemRenderer.querySelector('#channel-name a') ||
        richItemRenderer.querySelector('ytd-channel-name #text') ||
        richItemRenderer.querySelector('ytd-channel-name a');

      if (channelElement) {
        channelName = channelElement.innerText || channelElement.textContent || 'Unknown Channel';
      }
    }

    videoInfos.push({
      element: video,
      title: titleText,
      channel: channelName.trim()
    });
  });

  return videoInfos;
}

async function processRequestQueue() {
  if (requestQueue.length === 0) {
    isProcessingQueue = false;
    return;
  }

  isProcessingQueue = true;

  while (requestQueue.length > 0) {
    // Take up to BATCH_SIZE videos for batch processing
    const batch = requestQueue.splice(0, Math.min(BATCH_SIZE, requestQueue.length));

    // Ensure minimum delay between API calls
    const timeSinceLastCall = Date.now() - lastAPICallTime;
    if (timeSinceLastCall < API_DELAY) {
      await new Promise(resolve => setTimeout(resolve, API_DELAY - timeSinceLastCall));
    }

    try {
      const results = await isNotAllowed(batch, getGeminiResponse);

      // Process results and hide videos as needed
      results.forEach((result, index) => {
        if (result.isNotAllowed) {
          batch[index].element.closest('ytd-rich-item-renderer').style.display = 'none';
        }
      });
    } catch (error) {
      console.error(`Failed to process batch of ${batch.length} videos, re-adding to queue:`, error);
      // Remove from processed set and re-add to queue for retry
      batch.forEach(video => {
        const videoKey = `${video.title}|${video.channel}`;
        processedVideos.delete(videoKey);
        requestQueue.push(video);
        processedVideos.add(videoKey);
      });
    }
  }

  isProcessingQueue = false;
}

async function isNotAllowed(videos, getAIresponse) {
  const allowedTopics = ['game dev', 'game dev news', 'programming', 'game design', 'art', 'sound design', 'steam', 'AI', 'self improvement', 'productivity', 'psychology', 'philosophy', 'science'];

  // Create batch prompt for multiple videos
  const videoList = videos.map((video, index) =>
    `${index + 1}. "${video.title}" from channel "${video.channel}"`
  ).join('\n');

  const prompt = `For each of the following videos, determine if they fit the topics ${JSON.stringify(allowedTopics)}? No entertainment videos, only educational videos. I'm trying to learn.

Videos:
${videoList}

Answer with only the numbers and "yes" or "no" for each video, like:
1. yes
2. no
3. yes
etc.

DO NOT include any other text.`;

  lastAPICallTime = Date.now(); // Track when API call is made
  const response = await getAIresponse(prompt);

  // console.log(`AI batch response for ${videos.length} videos:\n`, response);

  // Parse the response
  const lines = response.trim().split('\n');
  const results = [];

  videos.forEach((video, index) => {
    let isNotAllowedFlag = false; // Default to allowed if parsing fails

    // Try to find the answer for this video
    const line = lines.find(l => l.trim().startsWith(`${index + 1}.`));
    if (line) {
      const answer = line.toLowerCase().includes('no');
      isNotAllowedFlag = answer;
    }

    results.push({
      title: video.title,
      channel: video.channel,
      isNotAllowed: isNotAllowedFlag
    });

    // console.log(`Video "${video.title}" from "${video.channel}": ${isNotAllowedFlag ? 'FILTERED' : 'ALLOWED'}`);
  });

  return results;
}

async function getOllamaResponse(prompt) {
  // Direct fetch to Ollama (may not work due to CORS in content script)
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama3.2:3b',
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0.1,
        num_predict: 5
      }
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.response;
}

const GEMINI_API_KEY = 'AIzaSyAIJ9TBcQJ736zmyoCHaYiFlm3aaIdVvco';

async function getGeminiResponse(prompt) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        maxOutputTokens: 100,
        temperature: 0.1
      }
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}