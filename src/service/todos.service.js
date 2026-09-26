import { faker } from '@faker-js/faker';

import { API_URL } from "./config";

export class ToDosService {
  constructor(request) {
    this.request = request;
  }

  async get(token) {
    const response = await this.request.get(`${API_URL}todos`, {
      headers: { "x-challenger": token },
    });
    return response;
  }

  async getWithId(token) {
    const response = await this.request.get(`${API_URL}todos/2`, {
      headers: { "x-challenger": token },
    });
    return response;
  }

  async getWithNonExistentId(token) {
    const response = await this.request.get(`${API_URL}todos/20`, {
      headers: { "x-challenger": token },
    });
    return response;
  }

  async postWithDoneStatuseTrue(token) {
    const response = await this.request.post(`${API_URL}todos`, {
      headers: { 'x-challenger': token },
      data: { title: 'Done', doneStatus: true }
    });
    return response;
  }

  async postWithDoneStatuseFalse(token) {
    const response = await this.request.post(`${API_URL}todos`, {
      headers: { 'x-challenger': token },
      data: { title: 'Done', doneStatus: false }
    });
    return response;
  }

  async head(token) {
    const response = await this.request.head(`${API_URL}todos`, {
      headers: { 'x-challenger': token }
    });
    return response;
  }
  
  async post(token) {
    const response = await this.request.post(`${API_URL}todos`, {
      headers: { "x-challenger": token },
      data: { title: 'Done', doneStatus: true }
    });
    return response;
  }

  async postWrongDoneStatus(token) {
    const response = await this.request.post(`${API_URL}todos`, {
      headers: { "x-challenger": token },
      data: { title: 'Done', doneStatus: "some string" }
    });
    return response;
  }

  async postTitleToLong(token) {
    let titleText = faker.string.alpha({ length: 51 });
    let response = await this.request.post(`${API_URL}todos`, {
      headers: { "x-challenger": token },
      data: { title: titleText } 
    });
    return response;
  }

  async postDescriptionToLong(token) {
    let descriptionText = faker.string.alpha({ length: 201 });
    let response = await this.request.post(`${API_URL}todos`, {
      headers: { "x-challenger": token },
      data: { title: "some text", description: descriptionText } 
    });
    return response;
  }

  async postMaxContent(token) {
    let titleMaxText = faker.string.alpha({ length: 50 });
    let descriptionMaxText = faker.string.alpha({ length: 200 });
    let response = await this.request.post(`${API_URL}todos`, {
      headers: { "x-challenger": token },
      data: { title: titleMaxText, description: descriptionMaxText } 
    });
    return response;
  }

  async postTooLongContent(token) {
    let descriptionMaxText = faker.string.alpha({ length: 5005 });
    let response = await this.request.post(`${API_URL}todos`, {
      headers: { "x-challenger": token },
      data: { description: descriptionMaxText } 
    });
    return response;
  }

  async postWrongFieldInData(token) {
    let response = await this.request.post(`${API_URL}todos`, {
      headers: { "x-challenger": token },
      data: { title: "a title", priority: "extra" } 
    });
    return response;
  }

  async putWrong(token) {
    let response = await this.request.put(`${API_URL}todos/111`, {
      headers: { "x-challenger": token },
      data: { title: "a title" } 
    });
    return response;
  }

  async postWithNewTitleCorrectID(token) {
    const response = await this.request.post(`${API_URL}todos/2`, {
      headers: { "x-challenger": token },
      data: { title: "new title" }
    });
    return response;
  }

  async postWithNewTitleIncorrectID(token) {
    const response = await this.request.post(`${API_URL}todos/111`, {
      headers: { "x-challenger": token },
      data: { title: "new title" }
    });
    return response;
  }

  async put(token) {
    let response = await this.request.put(`${API_URL}todos/2`, {
      headers: { "x-challenger": token },
      data: { 
        title: "updated title", 
        description: "updated description", 
        doneStatus: true 
      } 
    });
    return response;
  }

  async putPartialUpdate(token) {
    let response = await this.request.put(`${API_URL}todos/2`, {
      headers: { "x-challenger": token },
      data: { title: "partial update for title" } 
    });
    return response;
  }

  async putWithoutTitle(token) {
    let response = await this.request.put(`${API_URL}todos/2`, {
      headers: { "x-challenger": token },
      data: {
        id: 2,
        doneStatus: true,
        description: "updated description"
      } 
    });
    return response;
  }

  async putDifferentId(token) {
    let response = await this.request.put(`${API_URL}todos/2`, {
      headers: { "x-challenger": token },
      data: {
        id: 3,
        title: "updated title",
        doneStatus: true,
        description: "updated description"
      } 
    });
    return response;
  }

  async delete(token) {
    let response = await this.request.delete(`${API_URL}todos/2`, {
      headers: { "x-challenger": token },
    });
    return response;
  }

  async options(token) {
    const response = await this.request.fetch(`${API_URL}todos`, {
      method: 'OPTIONS',
      headers: { "x-challenger": token }
    });
    return response;
  }

  async getWithXml(token) {
    const response = await this.request.get(`${API_URL}todos`, {
      headers: { 
        'x-challenger': token, 
        'Accept': 'application/xml' 
      }
    });
    return response;
  }

  async getWithJSON(token) {
    const response = await this.request.get(`${API_URL}todos`, {
      headers: { 
        'x-challenger': token, 
        'Accept': 'application/json' 
      }
    });
    return response;
  }

  async getWithAny(token) {
    const response = await this.request.get(`${API_URL}todos`, {
      headers: { 
        'x-challenger': token, 
        'Accept': '*/*' 
      }
    });
    return response;
  }

  async getWithPref(token) {
    const response = await this.request.get(`${API_URL}todos`, {
      headers: { 
        'x-challenger': token, 
        'Accept': 'application/xml, application/json'
      }
    });
    return response;
  }

  async getWithoutAccept(token) {
    const response = await this.request.get(`${API_URL}todos`, {
      headers: { 
        'x-challenger': token, 
        'Accept': ''
      }
    });
    return response;
  }

  async getWithAcceptGzip(token) {
    const response = await this.request.get(`${API_URL}todos`, {
      headers: { 
        'x-challenger': token, 
        'Accept': 'application/gzip'  
      }
    });
    return response;
  }
}
