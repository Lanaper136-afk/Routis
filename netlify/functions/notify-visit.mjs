// Netlify serverless function: forwards a visit notification to a Telegram
// bot. The Telegram bot token and chat id are read from Netlify environment
// variables (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID) and are never sent to or
// readable by the browser — only this server-side function can see them.
export default async (request) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: {
        "Allow": "POST",
      },
    });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error("Telegram environment variables are missing.");
    return new Response("Server configuration error", {
      status: 500,
    });
  }

  let data = {};

  try {
    data = await request.json();
  } catch {
    return new Response("Invalid JSON", {
      status: 400,
    });
  }

  const page = typeof data.page === "string" ? data.page.slice(0, 200) : "/";
  const timestamp =
    typeof data.timestamp === "string"
      ? data.timestamp.slice(0, 50)
      : new Date().toISOString();

  const message =
    `🔔 Nouveau visiteur sur Routis\n\n` +
    `📄 Page : ${page}\n` +
    `🕐 Heure : ${timestamp}`;

  const telegramResponse = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    }
  );

  if (!telegramResponse.ok) {
    const errorText = await telegramResponse.text();
    console.error("Telegram API error:", errorText);

    return new Response("Telegram error", {
      status: 502,
    });
  }

  return new Response(
    JSON.stringify({ ok: true }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
