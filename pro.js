let prompt = document.querySelector("#prompt");
let submitbtn = document.querySelector("#submit");
let imagebtn = document.querySelector("#image");
let imageinput = document.querySelector("#image input");
let chatContainer = document.querySelector("#chat-box");

// Add your actual API key here
const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBso1GA7cuamR3GRQrFq0SIrrZU2XKD50Q";

let user = {
    message: null,
    file: {
        mime_type: null,
        data: null
    }
};

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
        let response = await fetch(Api_Url, requestOption);
        let data = await response.json();
        let apiResponse = data.candidates[0].content.parts[0].text.replace(/\\(.?)\\*/g, "$1").trim();
        text.innerHTML = apiResponse;
    } catch (error) {
        console.log(error);
    } finally {
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
        image.src = "img.svg";
        image.classList.remove("choose");
        user.file = {};
    }
}

function createChatBox(html, classes) {
    let div = document.createElement("div");
    div.innerHTML = html;
    div.classList.add(classes);
    return div;
}

function handleChatResponse(userMessage) {
    user.message = userMessage;
    let html = `<div class="user-chat-box">
                    <div class="user-chat-area">
                        <img src="https://cdn-icons-png.freepik.com/256/16794/16794036.png?ga=GA1.1.1008463341.1739524921&semt=ais_hybrid" alt="userimage" id="userImage">
                        ${user.message}
                        ${user.file.data ? <img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" /> : ""}
                    </div>
                </div>`;
    prompt.value = "";
    let userChatBox = createChatBox(html, "user-chat-box");
    chatContainer.appendChild(userChatBox);
    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });

    setTimeout(() => {
        let typingHtml = `<div class="ai-chat-box">
                            <img src="https://cdn-icons-png.freepik.com/256/6172/6172907.png?ga=GA1.1.1008463341.1739524921&semt=ais_hybrid" alt="aiimage" id="aiImage" width="10%">
                            <div class="ai-chat-area">
                                <img src="loading.webp" alt="" class="load" width="50px">
                            </div>
                        </div>`;
        let aiChatBox = createChatBox(typingHtml, "ai-chat-box");
        chatContainer.appendChild(aiChatBox);
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });  // Ensure latest message is visible
        generateResponse(aiChatBox);
    }, 600);
}

prompt.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        handleChatResponse(prompt.value);
    }
});

submitbtn.addEventListener("click", () => {
    handleChatResponse(prompt.value);
});

imageinput.addEventListener("change", () => {
    const file = imageinput.files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = (e) => {
        let base64string = e.target.result.split(",")[1];
        user.file = {
            mime_type: file.type,
            data: base64string
        };
        image.src = data:${user.file.mime_type};base64,${user.file.data};
        image.classList.add("choose");
    };
    reader.readAsDataURL(file);
});

imagebtn.addEventListener("click", () => {
    imagebtn.querySelector("input").click();
});