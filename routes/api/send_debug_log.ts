import { FreshContext } from "$fresh/server.ts";

export function send_log(channel: string, message: string) {
    channel = channel.toUpperCase();

    const webhook_url = Deno.env.get("DISCORD_WEBHOOK_URL_" + channel.toUpperCase());

    if (!webhook_url) {
        console.error("[Debug API] No webhook URL found for channel " + channel);
        return "No webhook URL found for channel " + channel;
    }

    const message_object = {
        content: message,
    };

    fetch(webhook_url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(message_object),
    }).catch((err) => {
        console.error("[Debug API] Error sending message to Discord", err);
    });

    console.log(`[Debug API] Sent message to Discord channel ${channel}: ${message}`);
}

export function send_error(message: string) {
    console.error("[Debug API] Error: " + message);
    send_log("error", message);
}

export const handler = async (_req: Request, _ctx: FreshContext): Promise<Response> => {
    try {
        const url = new URL(_req.url);
        const params = url.searchParams;
    
        const message = params.get("message");
        const channel = params.get("channel");
    
        if (!message || !channel) {
            return new Response("No message or channel provided", { status: 400 });
        }
    
        send_log(channel, message);
    
        return new Response(JSON.stringify({sent: true}));
    }
    catch (e) {
        send_error(`[API/send_debug_log] Error sending debug log: ${e}`);
        return new Response(JSON.stringify({ error: `Internal server error ${e}` }));
    }
}