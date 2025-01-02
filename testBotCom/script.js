document.addEventListener('DOMContentLoaded', () => {
    // Sidebar active link handling
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            sidebarLinks.forEach(item => item.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Scroll to the bottom of the chat area
    const scrollToBottom = () => {
        const chatArea = document.querySelector('.chatbox');
        chatArea.scrollTop = chatArea.scrollHeight;
    };

    // Function to send a message for ChatGPT
    const sendMessage = async () => {
        const inputField = document.querySelector('.input');
        const messageText = inputField.value.trim();

        if (messageText) {
            // Create user message
            const userMessage = document.createElement('div');
            userMessage.classList.add('message', 'user');
            userMessage.textContent = messageText;

            // Append user message to chat area
            document.querySelector('.chatbox').appendChild(userMessage);

            // Clear input field
            inputField.value = '';

            // Scroll to the bottom
            scrollToBottom();

            // Get response from ChatGPT
            try {
                const response = await fetch('https://api.openai.com/v1/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer YOUR_OPENAI_API_KEY'
                    },
                    body: JSON.stringify({
                        model: 'gpt-3.5-turbo',  // Use GPT-3.5 or GPT-4 if applicable
                        messages: [{ role: 'user', content: messageText }]
                    })
                });
                const data = await response.json();
                const botMessageText = data.choices[0].message.content;

                // Create bot response
                const botMessage = document.createElement('div');
                botMessage.classList.add('message', 'bot');
                botMessage.textContent = botMessageText;

                // Append bot message to chat area
                document.querySelector('.chatbox').appendChild(botMessage);

                // Scroll to the bottom after bot's response
                scrollToBottom();
            } catch (error) {
                console.error('Error fetching ChatGPT response:', error);
                const errorMessage = document.createElement('div');
                errorMessage.classList.add('message', 'bot');
                errorMessage.textContent = 'Sorry, I am unable to process your request at the moment.';
                document.querySelector('.chatbox').appendChild(errorMessage);
                scrollToBottom();
            }
        }
    };

    // Event listener for the send button
    const sendButton = document.querySelector('.send-btn');
    sendButton.addEventListener('click', sendMessage);

    // Event listener for the Enter key to send message
    const inputField = document.querySelector('.input');
    inputField.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});
