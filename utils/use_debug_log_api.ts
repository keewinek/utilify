export function send_client_log(channel: string, message: string) {
    fetch(`/api/send_debug_log?channel=${channel}&message=${message}`).catch((err) => {
        console.error("[Debug API] Error sending message to Discord", err);
    });
}