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

async function sendMessage() {
  let userInput = document.getElementById('user-input').value;
  if (!userInput) return;

  addMessage('user', userInput);
  document.getElementById('user-input').value = ''; // Clear the input field

  try {
    const response = await fetch('https://einstein-ai-trust-layer-i3evmd.5sc6y6-4.usa-e2.cloudhub.io/tools', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ prompt: userInput }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.generation.generatedText;
    //updateIndicators(data.generation.contentQuality.scanToxicity.categories);

    addMessage('bot', formatReply(generatedText));
  } catch (error) {
    addMessage('bot', 'Error: Unable to communicate with the AI.');
    console.error('Error:', error);
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
}

function formatReply(reply) {
  // Assuming `reply` is a plain text string
  return reply.replace(/\n/g, '<br>');
}

// Function to add the introductory message from the bot
function addIntroMessage() {
  const introMessage = `
    Hi, I'm Einstein, an AI Agent built with MuleChain on the MuleSoft Anypoint Platform. 
    Every interaction with me is <b>secured</b> through the <b>Salesforce Trust Layer</b>! 
    Here are my key skills:
    - Check <b>SAP ECC</b> inventory
    - Retrieve <b>SAP S4H</b> order details
    - Access <b>Salesforce</b> CRM accounts details
    - Gather <b>Hubspot</b> sales leads
    - Display <b>Workday</b> employee info
    - Order laptops from your asset <b>portal</b>
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
