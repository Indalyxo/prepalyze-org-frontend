import { useEffect } from "react";

const PrepalyzeChat = () => {
  useEffect(() => {
    // Prevent loading script multiple times
    if (window.n8nChatLoaded) return;
    window.n8nChatLoaded = true;

    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://cdn.n8nchatui.com/v1/embed.js";

    script.onload = () => {
      window.Chatbot.init({
        n8nChatUrl:
          "https://n8n.srv1240502.hstgr.cloud/webhook/01c9e33b-0381-432c-87b9-a4f16ae07e02/chat",
        metadata: {},
        theme: {
          button: {
            backgroundColor: "#004eeb",
            right: 20,
            bottom: 20,
            size: 50,
            customIconSrc:
              "https://res.cloudinary.com/dfd3sbnvd/image/upload/v1768975578/prep_vqikmk.png",
            customIconSize: 59,
            customIconBorderRadius: 50,
            borderRadius: "circle",
          },
          tooltip: {
            showTooltip: true,
            tooltipMessage: "Help",
            tooltipBackgroundColor: "#4355e5",
            tooltipTextColor: "#ffffff",
          },
          chatWindow: {
            title: "Prepalyze ChatBot",
            welcomeMessage: "Hello I am Prepalyze, How Can I Help You...",
            height: 500,
            width: 400,
            botMessage: {
              backgroundColor: "#0f76d7",
              textColor: "#fafafa",
              showAvatar: true,
              avatarSrc:
                "https://res.cloudinary.com/dfd3sbnvd/image/upload/v1768975578/prep_vqikmk.png",
            },
            userMessage: {
              backgroundColor: "#002aff",
              textColor: "#ffffff",
              showAvatar: true,
              avatarSrc:
                "https://www.svgrepo.com/show/532363/user-alt-1.svg",
            },
            textInput: {
              placeholder: "Type Your Query...",
              maxChars: 50,
            },

          },
           theme: {
    chatWindow: {
      showBranding: false, // 👈 try this
    }
  }
        },
      });
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null; // Chat button floats automatically
};

export default PrepalyzeChat;