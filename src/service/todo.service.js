const URL = "https://apichallenges.herokuapp.com/";

export class ToDoService {
    constructor(request) {
        this.request = request;
    }


    async get(token){
        const response = await this.request.get(`${URL}todo`, {headers: {
            "x-challenger": token },
        });
        return response;
    }
}
