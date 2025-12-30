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
          "https://muthudev.app.n8n.cloud/webhook/784e599b-98d2-4722-9dc3-12459f3b8be8/chat",
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