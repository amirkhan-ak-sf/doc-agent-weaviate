// Event listener for the send button
document.getElementById('send-btn').addEventListener('click', function () {
  sendMessage();
});

// Event listener for theme toggle
document.getElementById('theme-toggle').addEventListener('change', function () {
  document.body.classList.toggle('dark-theme');
});

// Event listener for pressing Enter key in the input field
document.getElementById('user-input').addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
});


let loadingMessages = [
  "Understanding the context...",
  "Max is searching the docs...",
  "Found section, now diving deeper to answer your question...",
  "Gathering information...",
  "Found it, formulating the answer...",
  "Working on it...",
  "Taking longer than expected..."
];
let currentMessageIndex = 0;

async function sendMessage() {
  let userInput = document.getElementById('user-input').value;
  if (!userInput) return;

  addMessage('user', userInput);
  document.getElementById('user-input').value = ''; // Clear the input field
  // Disable the input field and the send button
  document.getElementById('user-input').disabled = true;
  document.getElementById('send-btn').disabled = true;

  // Add the loading message and assign the returned message element to the loadingMessageElement variable
  loadingMessageElement = addMessage('bot', loadingMessages[currentMessageIndex]);

  // Start the loading message rotation
  loadingMessageInterval = setInterval(() => {
    currentMessageIndex = (currentMessageIndex + 1) % loadingMessages.length;
    loadingMessageElement.textContent = loadingMessages[currentMessageIndex];
  }, 5000);


  try {
    const response = await fetch('https://knowledgestore-n1pz6c.5sc6y6-2.usa-e2.cloudhub.io/prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ question: userInput }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    //const data = await response.json();
    const generatedText = await response.text();
    const parts = generatedText.split('`');

    const pElement = document.createElement('p');

    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        // Text outside backticks
        pElement.appendChild(document.createTextNode(parts[i]));
      } else {
        // Text inside backticks
        const codeElement = document.createElement('code');
        codeElement.style.backgroundColor = '#ffffff'; // Change the background color here
        codeElement.style.color = '#008000'; // Change the font color here
        codeElement.appendChild(document.createTextNode(parts[i]));
        pElement.appendChild(codeElement);
      }
    }

    const text = pElement.outerHTML.replace(/\n/g, '<br>')

    //updateIndicators(data.generation.contentQuality.scanToxicity.categories);
    console.log(text);

    clearInterval(loadingMessageInterval);
    //loadingMessageElement.remove();

    addMessage('bot', text);
  } catch (error) {
    addMessage('bot', 'Error: Unable to communicate with the AI.');
    console.error('Error:', error);
  } finally {
    // Enable the input field and the send button
    document.getElementById('user-input').disabled = false;
    document.getElementById('send-btn').disabled = false;
    document.getElementById('user-input').focus();
    currentMessageIndex = 0;
  }
}


function updateIndicators(categories) {
  categories.forEach(category => {
    const indicator = document.getElementById(`${category.categoryName.toLowerCase()}-indicator`);
    if (indicator) {
      if (category.score === 0) {
        indicator.classList.add('green');
        indicator.classList.remove('orange');
      } else {
        indicator.classList.add('orange');
        indicator.classList.remove('green');
      }
    }
  });
}

function addMessage(sender, message) {
  let outputDiv = document.getElementById('output');
  let messageDiv = document.createElement('div');
  messageDiv.classList.add(sender);
  messageDiv.innerHTML = message;
  outputDiv.appendChild(messageDiv);

  // Auto-scroll to the bottom
  messageDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
  // Return the created message element
  return messageDiv;
}

function formatReply(reply) {
  // Assuming `reply` is a plain text string
  return reply.replace(/\n/g, '<br>');
}

// Function to add the introductory message from the bot
function addIntroMessage() {
  const introMessage = `Hi, I'm Max, an AI Agent built with MuleChain on the MuleSoft Anypoint Platform. 
    I have been specialized on MuleSoft Documentation and trained to know almost everything from <b>docs.mulesoft.com</b>. 
  `;
  addMessage('bot', formatReply(introMessage));
}

// Add the introductory message when the page loads
window.onload = function () {
  addIntroMessage();
  initializeIndicators();
};

function initializeIndicators() {
  const categories = [
    'identity',
    'profanity',
    'hate',
    'violence',
    'sexual',
    'physical'
  ];

  categories.forEach(category => {
    const indicator = document.getElementById(`${category}-indicator`);
    if (indicator) {
      indicator.classList.add('green');
      indicator.classList.remove('orange');
    }
  });
}
