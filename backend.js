async function processDownload() {
    const inputUrl = document.getElementById("videoUrl").value.trim();
    const resultArea = document.getElementById("resultArea");
    const downloadBtn = document.getElementById("downloadBtn");

    // 1. चेक करें कि लिंक डाला है या नहीं
    if (!inputUrl) {
        alert("कृपया पहले वीडियो या रील का लिंक पेस्ट करें!");
        return;
    }

    // 2. स्क्रीन पर लोडिंग मैसेज दिखाना
    resultArea.innerHTML = "<p class='loading'>🔄 वीडियो डाउनलोड लिंक तैयार हो रहा है, कृपया रुकें...</p>";
    downloadBtn.disabled = true; 

    try {
        // 3. Cobalt API को रिक्वेस्ट भेजना (यह 100% फ्री डाउनलोडर API है)
        const response = await fetch("https://cobalt.tools", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                url: inputUrl,
                vQuality: "720",
                filenamePattern: "basic"
            })
        });

        const data = await response.json();

        // 4. अगर वीडियो लिंक मिल गया, तो ऑटो-डाउनलोड करना
        if (data.status === "redirect" || data.status === "stream") {
            const finalDownloadUrl = data.url;
            resultArea.innerHTML = "<p class='success'>🎉 डाउनलोड शुरू हो रहा है!</p>";

            // अदृश्य लिंक बनाकर ऑटोमैटिक डाउनलोड ट्रिगर करना
            const tempLink = document.createElement("a");
            tempLink.href = finalDownloadUrl;
            tempLink.setAttribute("download", "Zuvnelo_Video.mp4");
            tempLink.target = "_blank";
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);

        } else {
            resultArea.innerHTML = "<p class='error'>❌ माफ़ कीजिये, इस लिंक से वीडियो नहीं मिल पाया। लिंक दोबारा चेक करें।</p>";
        }

    } catch (error) {
        console.error("Error:", error);
        resultArea.innerHTML = "<p class='error'>⚠️ सर्ver से कनेक्ट करने में समस्या आई। बाद में प्रयास करें।</p>";
    } finally {
        downloadBtn.disabled = false;
    }
}

// ऑटो-पेस्ट डिटेक्शन: जैसे ही यूजर लिंक पेस्ट करेगा, डाउनलोड अपने आप शुरू हो जाएगा!
document.addEventListener("DOMContentLoaded", () => {
    const inputElement = document.getElementById("videoUrl");
    if (inputElement) {
        inputElement.addEventListener("paste", () => {
            // पेस्ट होने के ठीक 50 मिलीसेकंड बाद डाउनलोड फंक्शन को रन करना
            setTimeout(processDownload, 50);
        });
    }
});

