import * as sdk from "https://deno.land/x/appwrite/mod.ts";
import { user } from "../interfaces/user.ts";
import { send_error, send_log } from "../routes/api/send_debug_log.ts";

const project_id = "67d6a34a003a9c5addae";
const database_id = "67d6a36700250c314304";
const users_id = "67d6a3760032ca5b7368";

const client = new sdk.Client();
const databases = new sdk.Databases(client);

const max_requests_per_minute = 120;

let client_connected = false;

let request_count_in_minute = 0;
let current_minute = new Date().getMinutes();

function connect_client()
{
    if (client_connected) return;

    const appwrite_key = Deno.env.get("APPWRITE_API_KEY")
    
    if (appwrite_key == null) {
        console.error("[DB] APPWRITE_API_KEY environment variable is not set.");
        return
    }
    
    client
        .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
        .setProject(project_id) // Your project ID
        .setKey(appwrite_key) // Your secret API key
    ;

    client_connected = true;

    console.log("[DB] Connected to Appwrite client.");
}

function good_rate_limit() {
    const now = new Date();
    const minute = now.getMinutes();

    if (minute !== current_minute) {
        current_minute = minute;
        request_count_in_minute = 0;
    }

    if (request_count_in_minute >= max_requests_per_minute) {
        console.error(`[DB] Self Rate limit exceeded. ${request_count_in_minute} requests made in the current minute.`);
        send_log("error", `⛔ Database Self Rate limit exceeded. ${request_count_in_minute} requests made in the current minute.`);
        return false;
    }

    request_count_in_minute++;

    return true;
}

export function get_only_user_keys(user:user)
{
    //! THIS MAY CAUSE PROBLEMS!
    return {
        id: user.id,
        username: user.username,
        created_at: user.created_at,
        hash: user.hash,
        token: user.token,
    } as user
}



export async function update_user(user: user) {
    try {
        connect_client()
        if (!good_rate_limit()) return {"error" : "Self Rate limit exceeded."};
        return await databases.updateDocument(database_id ,users_id, user.id, user);
    }
    catch (e) {
        send_error(`[DB Users] Failed to update user: ${e}`)
        return {"error" : e};
    }
}

export async function get_user_by_value(value_name:string, value:string|boolean|number)
{
    connect_client()
    if (!good_rate_limit()) return {"error" : "Self Rate limit exceeded."};

    let documents = await databases.listDocuments( database_id, users_id, [sdk.Query.equal(value_name, value)]);

    for (const document of documents.documents) {
        let doc = document as unknown;
        return get_only_user_keys(doc as user);
    }

    return null;
}

export async function create_user(user: user)
{
    connect_client()
    if (!good_rate_limit()) return {"error" : "Self Rate limit exceeded."};

    if (await get_user_by_value("id", user.id) !== null) {
        return {"error" : "User already exists in database."};
    }

    if (await get_user_by_value("username", user.username) !== null) {
        return {"error" : "User with that username already exists in the database."};
    }

    const result = await databases.createDocument(database_id,users_id,user.id,user)
    if (result.$id != null){
        console.log(`[DB Users] User created: ${result}`);
        return {"success" : true, "response" : result};
    }

    console.error(`[DB Users] Failed to create an user. Result: ${result}`)
    return {"error" : result};
}

export async function delete_user(user: user)
{
    connect_client()
    if (!good_rate_limit()) return {"error" : "Self Rate limit exceeded."};

    const result = await databases.deleteDocument(database_id, users_id, user.id)
    return {"success" : true, "response" : result};
}