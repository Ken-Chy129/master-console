import axios from "axios";


export async function getAppList(options?: { [key: string]: any }) {
    return axios.get("/api/app/list");
}