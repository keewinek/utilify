import { FreshContext } from "$fresh/server.ts";
import { user } from "../../interfaces/user.ts";
import * as db from "../../utils/database.ts"
import { hash_256, hash_password } from "../../utils/password_hash.ts";
import { send_error, send_log } from "./send_debug_log.ts";

export const handler = async (_req: Request, _ctx: FreshContext): Promise<Response> => {
    try {

        const url = new URL(_req.url);
        const params = url.searchParams;
    
        const username = params.get("username");
        let hash = params.get("hash");
        if (username === null || hash === null) {
            return new Response(JSON.stringify({ "error": "Missing username or hash argument" }), { status: 400 });
        }

        hash = hash_password(hash);
        
        if (await db.get_user_by_value("username", username) != null) {
            return new Response(JSON.stringify({ "error": "User with that username already exists" }), { status: 400 });
        }
    
        const user: user = {
            id: crypto.randomUUID(),
            username: username,
            hash: hash,
            token: crypto.randomUUID(),
            created_at: Date.now(),
        }
    
        let response = await db.create_user(user)
    
        if (response.error != null) {
            return new Response(JSON.stringify({ "error": response.error }), { status: 400 });
        }
        
        send_log("user_activity", `User ${user.username} created an account.`);
        console.log("[API] User created: " + user.username);
    
        return new Response(JSON.stringify(user), { status: 200 });
    }
    catch (e) {
        send_error("[API/create_user] Error creating user: " + e);
        return new Response(JSON.stringify({ "error": `Internal server error ${e}` }), { status: 400 });
    }
}