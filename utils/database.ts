import * as sdk from "https://deno.land/x/appwrite/mod.ts";
import { server } from "../interfaces/server.ts";
import { user } from "../interfaces/user.ts";
import { send_error, send_log } from "../routes/api/send_debug_log.ts";

const project_id = "676fefb60004f53f6f4b";

const database_id = "676fefd5002871d7ed1f";

const servers_id = "676ff36c0033f08900ff";
const users_id = "6770681f002309046fbb";

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

export function get_only_server_keys(server:server)
{
    //! THIS MAY CAUSE PROBLEMS!
    return {
        id: server.id,
        url_id: server.url_id,
        owner_token: server.owner_token,
        ip: server.ip,
        name: server.name,
        tags: server.tags,
        country: server.country,
        icon64: server.icon64,
        motd: server.motd,
        online_players: server.online_players,
        max_players: server.max_players,
        version: server.version,
        version_raw: server.version_raw,
        version_allowance: server.version_allowance,
        online: server.online,
        plugin_detected: server.plugin_detected,
        bumps: server.bumps,
        last_bumps: server.last_bumps,
        pending_bumps: server.pending_bumps,
        earn_per_bump: server.earn_per_bump,
        promoted: server.promoted,
        target_promoted_bumps: server.target_promoted_bumps,
        bumped_at: server.bumped_at,
        created_at: server.created_at,
        updated_at: server.updated_at,
    } as server
}

export function get_only_user_keys(user:user)
{
    //! THIS MAY CAUSE PROBLEMS!
    return {
        id: user.id,
        username: user.username,
        created_at: user.created_at,
        hash: user.hash,
        coins: user.coins,
        token: user.token,
    } as user
}

export async function get_server_by_value(value_name:string, value:string|boolean|number)
{
    connect_client()
    if (!good_rate_limit()) return null;

    let documents = await databases.listDocuments(
        database_id,
        servers_id,
        [
            sdk.Query.equal(value_name, value)
        ]
    );

    for (const document of documents.documents) {
        const doc = document as unknown as server;
        return get_only_server_keys(doc);
    }

    return null;
}

export async function get_servers_by_query(queries: string[])
{
    connect_client()
    if (!good_rate_limit()) return [];

    let documents = await databases.listDocuments(
        database_id,
        servers_id,
        queries,
    );

    let servers = [];

    for (const document of documents.documents) {
        let doc = document as unknown;
        servers.push(get_only_server_keys(doc as server));
    }

    return servers;
}

export async function update_server(server: server) {
    try {
        connect_client()
        if (!good_rate_limit()) return {"error" : "Self Rate limit exceeded."};
    
        const result = await databases.updateDocument(
            database_id, // databaseId
            servers_id, // collectionId
            server.id, // documentId
            server, // data (optional)
        );
    
        return result;
    }
    catch (e) {
        console.error(`[DB Servers] Failed to update server: ${e}`)
        return {"error" : e};
    }
}

export async function create_server(server: server)
{
    connect_client()
    if (!good_rate_limit()) return {"error" : "Self Rate limit exceeded."};

    console.log(`[DB Servers] 1 Creating server: ${server}`)

    if (await get_server_by_value("id", server.id) != null)
    {
        return {"error" : "Server already exists in database."};
    }

    console.log(`[DB Servers] 2 Creating server: ${server}`)

    const result = await databases.createDocument(
        database_id, // Database ID
        servers_id, // Collection ID
        server.id, // Document ID
        server
    )
    
    if (result.$id != null){
        return {"success" : true, "response" : result};
    }

    return {"error" : result};
}

export async function delete_server(server: server)
{
    connect_client()
    if (!good_rate_limit()) return {"error" : "Self Rate limit exceeded."};

    const result = await databases.deleteDocument(
        database_id, // Database ID
        servers_id, // Collection ID
        server.id, // Document ID
    )

    return {"success" : true, "response" : result};
}

export async function update_user(user: user) {
    try {
        connect_client()
        if (!good_rate_limit()) return {"error" : "Self Rate limit exceeded."};

        const result = await databases.updateDocument(
            database_id, // databaseId
            users_id, // collectionId
            user.id, // documentId
            user, // data (optional)
        );

        return result;
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

    let documents = await databases.listDocuments(
        database_id,
        users_id,
        [
            sdk.Query.equal(value_name, value)
        ]
    );

    for (const document of documents.documents) {
        let doc = document as unknown;
        // console.log(`[DB Users] User found: ${JSON.stringify(doc)}`);
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

    const result = await databases.createDocument(
        database_id, // Database ID
        users_id, // Collection ID
        user.id, // Document ID
        user
    )
    
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

    const result = await databases.deleteDocument(
        database_id, // Database ID
        users_id, // Collection ID
        user.id, // Document ID
    )

    return {"success" : true, "response" : result};
}