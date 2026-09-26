import { API_URL } from "./config";

export class ChallengerService {
    constructor(request) {
        this.request = request;
    }
    async post() {
        const response = await this.request.post(`${API_URL}challenger`);
        return response;
    }
}