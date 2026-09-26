import { API_URL } from "./config";

export class ChallengesService {
    constructor(request) {
        this.request = request;
    }
    async get(token){
        const response = await this.request.get(`${API_URL}challenges`, {headers: {
            "x-challenger": token },
        });
        return response;
    }
}