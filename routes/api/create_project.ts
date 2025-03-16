import { FreshContext } from "$fresh/server.ts";
import project from "../../interfaces/project.ts";
import * as db from "../../utils/database.ts"
import * as sdk from "https://deno.land/x/appwrite/mod.ts";
import { send_error, send_log } from "./send_debug_log.ts";
import { isValidNumber } from "$std/semver/_shared.ts";
import { user } from "../../interfaces/user.ts";

export const handler = async (_req: Request, _ctx: FreshContext): Promise<Response> => {
    try {

        const url = new URL(_req.url);
        const params = url.searchParams;
    
        const project_name = params.get("project_name")
        const project_description = params.get("project_description")
        const user_token = params.get("token")

        if (!project_name || !project_description || !user_token) {
            return new Response(JSON.stringify({ "error": "Missing parameters" }), { status: 400 });
        }

        const target_id = await db.get_next_available_project_id()
        if (!isValidNumber(target_id)) {
            send_error("[API/create_project] Error getting next available project id: " + target_id);
            return new Response(JSON.stringify({ "error": `Internal server error ${target_id}` }), { status: 400 });
        }

        const user = await db.get_user_by_value("token", user_token)
        if (!user) {
            send_error("[API/create_project] Error getting user: " + user);
            return new Response(JSON.stringify({ "error": `Internal server error ${user}` }), { status: 400 });
        }

        const project: project = {
            name: project_name,
            description: project_description,
            id: target_id,
            urlid: "",
            inputs_jsons: [],
            code: "",
            approved: false,
            views: 0,
            created_at: Date.now(),
            user_id: (user as user).id
        }

        const response = await db.create_project(project)

        if (response.error) {
            send_error("[API/create_project] Error creating project: " + response.error);
            return new Response(JSON.stringify({ "error": `Internal server error ${response.error}` }), { status: 400 });
        }
    
        return new Response(JSON.stringify(project), { status: 200 });
    }
    catch (e) {
        send_error("[API/create_project] Error creating project: " + e);
        return new Response(JSON.stringify({ "error": `Internal server error ${e}` }), { status: 400 });
    }
}