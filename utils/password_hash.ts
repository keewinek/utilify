import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

export async function hash_256(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
    return hashHex;
}

export function hash_password(password: string): string {
    return bcrypt.hashSync(password);
}

export function compare_password(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
}