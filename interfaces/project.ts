export default interface project {
    id: number,
    name: string,
    urlid: string,
    description: string,
    inputs_jsons: string[],
    code: string,
    approved: boolean,
    views: number,
    created_at: number,
    user_id: string
}