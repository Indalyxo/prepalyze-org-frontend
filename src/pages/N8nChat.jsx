import { useEffect } from "react";

const N8nChat = () => {
  useEffect(() => {
    // Load CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css";
    document.head.appendChild(link);

    // Load Script
    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js";

    script.onload = async () => {
      const { createChat } = await import(
        "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js"
      );

      createChat({
        webhookUrl:
          "https://n8n.srv1240502.hstgr.cloud/webhook/01c9e33b-0381-432c-87b9-a4f16ae07e02/chat",
      });
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="n8n-chat" />;
};

export default N8nChat;