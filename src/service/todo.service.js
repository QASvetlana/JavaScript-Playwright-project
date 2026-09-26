import { API_URL } from "./config";

export class ToDoService {
    constructor(request) {
        this.request = request;
    }


    async get(token){
        const response = await this.request.get(`${API_URL}todo`, {headers: {
            "x-challenger": token },
        });
        return response;
    }
}
