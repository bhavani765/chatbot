async function generateResponse(aiChatBox) {
    let text = aiChatBox.querySelector(".ai-chat-area");
    let requestOption = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "contents": [
                {
                    "parts": [
                        { "text": user.message },
                        ...(user.file.data ? [{ inline_data: user.file }] : [])
                    ]
                }
            ]
        })
    };

    try {
        console.log("Sending request:", requestOption);
        let response = await fetch(Api_Url, requestOption);
        console.log("Received response:", response);
        let data = await response.json();
        console.log("Response data:", data);

        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            let apiResponse = data.candidates[0].content.parts[0].text.replace(/\\(.?)\\*/g, "$1").trim();
            text.innerHTML = apiResponse;
        } else {
            text.innerHTML = "Sorry, I couldn't process your request.";
        }
    } catch (error) {
        console.error("Error:", error);
        text.innerHTML = "An error occurred. Please try again.";
    } finally {
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
        image.src = "img.svg";
        image.classList.remove("choose");
        user.file = {};
    }
}
