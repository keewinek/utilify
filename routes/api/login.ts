import { FreshContext } from "$fresh/server.ts";
import { user } from "../../interfaces/user.ts";
import * as sdk from "https://deno.land/x/appwrite/mod.ts";
import * as db from "../../utils/database.ts"
import { send_error, send_log } from "./send_debug_log.ts";
import { compare_password, hash_256, hash_password } from "../../utils/password_hash.ts";


export const handler = async (_req: Request, _ctx: FreshContext): Promise<Response> => {
    try {
        const url = new URL(_req.url);
        const params = url.searchParams;
    
        const username = params.get("username");
        let hash = params.get("hash");
        if (username === null || hash === null) {
            return new Response(JSON.stringify({ "error": "Missing username or hash argument" }), { status: 400 });
        }
    
        const user = await db.get_user_by_value("username", username) as user;
        if (user === null) {
            return new Response(JSON.stringify({ "error": "This user does not exists" }), { status: 400 });
        }
    
        if (!compare_password(hash, user.hash)) {
            return new Response(JSON.stringify({ "error": "Incorrect username or password" }), { status: 400 });
        }

        send_log("user_activity", `User ${user.username} logged in.`);
    
        return new Response(JSON.stringify(user), { status: 200 });
    }
    catch (e) {
        send_error("[API/login] Error logging in: " + e);
        return new Response(JSON.stringify({ "error": `Internal server error ${e}` }), { status: 400 });
    }
}