const { test, expect } = require('@playwright/test');
const { title } = require('process');
import { faker } from '@faker-js/faker';

test.describe("API challenge", () => {
    let URL = "https://apichallenges.herokuapp.com/";
    let token;
  
    test.beforeAll(async ({ request }) => {
      let response = await request.post(`${URL}challenger`);
      let headers = await response.headers();
      token = headers["x-challenger"];
      expect(headers).toEqual(
        expect.objectContaining({ "x-challenger": expect.any(String) }),
      );
    });

    test("2.Получить список заданий get /challenges", {tag: ['@id_2', '@GET']}, async ({ request }) => {
        let response = await request.get(`${URL}challenges`, {
          headers: { "x-challenger": token,},
        });
        let body = await response.json();
        let headers = await response.headers();
        expect(response.status()).toBe(200);
        expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(body.challenges.length).toBe(59);
      });

  test('3.GET /todos (200)', {tag: ['@id_3', '@GET']}, async ({ request }) => {
    let response = await request.get(`${URL}todos`, {
        headers: {"x-challenger": token,},
      });
      let body = await response.json();
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('todos');
  });

  test('4.GET /todo (404)', {tag: ['@id_4', '@GET']}, async ({ request }) => {
    const response = await request.get(`${URL}todo`, {
      headers: { 'x-challenger': token }
    });
    expect(response.status()).toBe(404);
  });

  test('5.GET /todos/{id} (200)', {tag: ['@id_5', '@GET']}, async ({ request }) => {
    const response = await request.get(`${URL}todos/1`, {
      headers: { 'x-challenger': token }
    });
    let body = await response.json();
    expect(response.status()).toBe(200);
    expect(body).toEqual({"todos": [{"description": "", "doneStatus": false, "id": 1, "title": "scan paperwork"}]});
  });

  test('6.GET /todos/{id} (404)', {tag: ['@id_6', '@GET']}, async ({ request }) => {
    const response = await request.get(`${URL}todos/20`, {
      headers: { 'x-challenger': token }
    });
    expect(response.status()).toBe(404);
  });

  test('7.GET /todos (200) ?filter', {tag: ['@id_7', '@GET']}, async ({ request }) => {
    await request.post(`${URL}todos`, {
      headers: { 'x-challenger': token },
      data: {title:'Done', doneStatus: true }
    });
    await request.post(`${URL}todos`, {
      headers: { 'x-challenger': token },
      data: {title:'NoteDone', doneStatus: false }
    });
    const response = await request.get(`${URL}todos?doneStatus=true`, {
      headers: { 'x-challenger': token },
    });
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.todos.some(todo => todo.doneStatus === true)).toBe(true);
  });

  test('8.HEAD /todos (200)', {tag: ['@id_8', '@HEAD']}, async ({ request }) => {
    let response = await request.head(`${URL}todos`, {
        headers: {"x-challenger": token}
      });
    expect(response.status()).toBe(200);
    expect(await response.body()).toBeUndefined;
  });

  test('9.POST /todos (201)', {tag: ['@id_9', '@POST']}, async ({ request }) => {
    let response = await request.post(`${URL}todos`, {
      headers: {"x-challenger": token},
      data: {title:'Done', doneStatus: true } });
      const body = await response.json();
    expect(response.status()).toBe(201);
    expect(body.doneStatus).toBe(true);
  });

  test('10.POST /todos (400) doneStatus', {tag: ['@id_10', '@POST']}, async ({ request }) => {
    let response = await request.post(`${URL}todos`, {
      headers: {"x-challenger": token},
      data: {title:'Notdone', doneStatus: "some string" } });
      const body = await response.json();
    expect(response.status()).toBe(400);
    expect(body.doneStatus).toBeUndefined;
  });

  test('11.	POST /todos (400) title too long', {tag: ['@id_11', '@POST']}, async ({ request }) => {
    let titleText = faker.string.alpha({ length: 51 })
    let response = await request.post(`${URL}todos`, {
      headers: {"x-challenger": token},
      data: {title:titleText} });
      const body = await response.json();
    expect(response.status()).toBe(400);
    expect(body).toEqual({
      errorMessages: [
        'Failed Validation: Maximum allowable length exceeded for title - maximum allowed is 50'
      ]
    });
  });

  test('12.	POST /todos (400) description too long', {tag: ['@id_12', '@POST']}, async ({ request }) => {
    let descriptionText = faker.string.alpha({ length: 201 })
    let response = await request.post(`${URL}todos`, {
      headers: {"x-challenger": token},
      data: {title:"some text", description: descriptionText } });
      const body = await response.json();
    expect(response.status()).toBe(400);
    expect(body).toEqual({
      errorMessages: [
        'Failed Validation: Maximum allowable length exceeded for description - maximum allowed is 200'
      ]
    });
  });

  test('13.	POST /todos (201) max out content', {tag: ['@id_13', '@POST']}, async ({ request }) => {
    let titleMaxText = faker.string.alpha({ length: 50 })
    let descriptionMaxText = faker.string.alpha({ length: 200 })
    let response = await request.post(`${URL}todos`, {
      headers: {"x-challenger": token},
      data: {title:titleMaxText, description: descriptionMaxText } });
      const body = await response.json();
    expect(response.status()).toBe(201);
    expect(body.description).toBe(descriptionMaxText);
  });

  test('14.	POST /todos (413) content too long', {tag: ['@id_14', '@POST']}, async ({ request }) => {
    let descriptionMaxText = faker.string.alpha({ length: 5005 })
    let response = await request.post(`${URL}todos`, {
      headers: {"x-challenger": token},
      data: {description: descriptionMaxText } });
      const body = await response.json();
    expect(response.status()).toBe(413);
    expect(body).toEqual({
      errorMessages: [
        'Error: Request body too large, max allowed is 5000 bytes'
      ]
    });
  });

  test('15.	POST /todos (400) extra', {tag: ['@id_15', '@POST']}, async ({ request }) => {
    let response = await request.post(`${URL}todos`, {
      headers: {"x-challenger": token},
      data: {title:"a title", priority:"extra"} });
      const body = await response.json();
    expect(response.status()).toBe(400);
    expect(body).toEqual({
      errorMessages: [
        'Could not find field: priority'
      ]
    });
  });

  test('16. PUT /todos/{id} (400)', {tag: ['@id_16', '@PUT']}, async ({ request }) => {
    let response = await request.put(`${URL}todos/111`, {
      headers: {"x-challenger": token},
      data: {title:"a title"} });
      const body = await response.json();
    expect(response.status()).toBe(400);
    expect(body).toEqual({
      errorMessages: [
        'Cannot create todo with PUT due to Auto fields id'
      ]
    });
  });

  test('17. POST /todos/{id} (200)', {tag: ['@id_17', '@POST']}, async ({ request }) => {
    let response = await request.post(`${URL}todos/2`, {
      headers: {"x-challenger": token},
      data: {title:"new title"} });
      const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.title).toBe("new title");
  });

  test('18. POST /todos/{id} (404)', {tag: ['@id_18', '@POST']}, async ({ request }) => {
    let response = await request.post(`${URL}todos/111`, {
      headers: {"x-challenger": token},
      data: {title:"new title"} });
      const body = await response.json();
    expect(response.status()).toBe(404);
    expect(body).toEqual({
      errorMessages: [
        'No such todo entity instance with id == 111 found'
      ]
    });
});

test('19. PUT /todos/{id} full (200)', {tag: ['@id_19', '@PUT']}, async ({ request }) => {
  let response = await request.put(`${URL}todos/2`, {
    headers: {"x-challenger": token},
    data: {
      id: 2,
      title: "updated title",
      doneStatus: true,
      description: "updated description"
    } });
    const body = await response.json();
  expect(response.status()).toBe(200);
  expect(body.title).toBe("updated title");
  expect(body.doneStatus).toBe(true);
  expect(body.description).toBe("updated description");
});

test('20. PUT /todos/{id} partial (200)', {tag: ['@id_20', '@PUT']}, async ({ request }) => {
  let response = await request.put(`${URL}todos/2`, {
    headers: {"x-challenger": token},
    data: {
     title: "partial update for title"
    } });
    const body = await response.json();
  expect(response.status()).toBe(200);
  expect(body.title).toBe("partial update for title");
});

test('21. PUT /todos/{id} no title (400)', {tag: ['@id_21', '@PUT']}, async ({ request }) => {
  let response = await request.put(`${URL}todos/2`, {
    headers: {"x-challenger": token},
    data: {
      id: 2,
      doneStatus: true,
      description: "updated description"
    } });
    const body = await response.json();
  expect(response.status()).toBe(400);
  expect(body).toEqual({
    errorMessages: [
      'title : field is mandatory'
    ]
  });
});

test('22. PUT /todos/{id} no amend id (400)', {tag: ['@id_22', '@PUT']}, async ({ request }) => {
  let response = await request.put(`${URL}todos/2`, {
    headers: {"x-challenger": token},
    data: {
      id: 3,
      title: "updated title",
      doneStatus: true,
      description: "updated description"
    } });
    const body = await response.json();
  expect(response.status()).toBe(400);
  expect(body).toEqual({
    errorMessages: [
      'Can not amend id from 2 to 3'
    ]
  });
});

test('23. DELETE /todos/{id} (200)', {tag: ['@id_23', '@DELETE']}, async ({ request }) => {
  let response = await request.delete(`${URL}todos/2`, {
    headers: {"x-challenger": token}
  });
  expect(response.status()).toBe(200);
  const getResponse = await request.get(`${URL}todos/2`, {
    headers: { "x-challenger": token }
  });
  expect(getResponse.status()).toBe(404); 
});

test('24. OPTIONS /todos (200)', {tag: ['@id_24', '@OPTIONS']}, async ({ request }) => {
  let response = await request.fetch(`${URL}todos`, {
    method: 'OPTIONS',
    headers: {"x-challenger": token}
  });
  let headers = await response.headers();
  expect(response.status()).toBe(200);
  expect(headers['allow']).toContain('OPTIONS');
});

test('25.GET /todos (200) XML', {tag: ['@id_25', '@GET']}, async ({ request }) => {
  const response = await request.get(`${URL}todos`, {
    headers: { 
      'x-challenger': token, 
      'Accept': 'application/xml' 
    }
  });
  const headers = response.headers();
  const contentType = headers['content-type'];
  expect(response.status()).toBe(200);
  expect(contentType).toContain('application/xml');
});

test('26.GET /todos (200) JSON', {tag: ['@id_26', '@GET']}, async ({ request }) => {
  const response = await request.get(`${URL}todos`, {
    headers: { 
      'x-challenger': token, 
      'Accept': 'application/json' 
    }
  });
  const headers = response.headers();
  const contentType = headers['content-type'];
  expect(response.status()).toBe(200);
  expect(contentType).toContain('application/json');

});

test('27.GET /todos (200) ANY', {tag: ['@id_27', '@GET']}, async ({ request }) => {
  const response = await request.get(`${URL}todos`, {
    headers: { 
      'x-challenger': token, 
      'Accept': '*/*' 
    }
  });
  const headers = response.headers();
  const contentType = headers['content-type'];
  expect(response.status()).toBe(200);
  expect(contentType).toContain('application/json');

});

test('28.GET /todos (200) XML pref', {tag: ['@id_28', '@GET']}, async ({ request }) => {
  const response = await request.get(`${URL}todos`, {
    headers: { 
      'x-challenger': token, 
      'Accept': 'application/xml, application/json'   
    }
  });
  const headers = response.headers();
  const body = await response.text();
  const contentType = headers['content-type'];
  expect(response.status()).toBe(200);
  expect(contentType).toContain('application/xml');
});

test('29.GET /todos (200) no accept', {tag: ['@id_29', '@GET']}, async ({ request }) => {
  const response = await request.get(`${URL}todos`, {
    headers: { 
      'x-challenger': token,
      'Accept': ''  
    }
  });
  const headers = response.headers();
  const body = await response.text();
  const contentType = headers['content-type'];
  expect(response.status()).toBe(200);
  expect(contentType).toContain('application/json');
  
});

test('30.GET /todos (406)', {tag: ['@id_30', '@GET']}, async ({ request }) => {
  const response = await request.get(`${URL}todos`, {
    headers: { 
      'x-challenger': token,
      'Accept': 'application/gzip'  
    }
  });
  expect(response.status()).toBe(406);
});

test('31.POST /todos XML', {tag: ['@id_31', '@POST']}, async ({ request }) => {
  const todoData = `
    <todo>
      <doneStatus>true</doneStatus>
      <title>file paperwork today</title>
    </todo>
  `;
  let response = await request.post(`${URL}todos`, {
    headers: {
      "Accept": "application/xml",
      "Content-Type": "application/xml",
      "X-CHALLENGER": token
    },
    data: todoData
  });
  const body = await response.text();
  const contentType = response.headers()['content-type'];
  expect(response.status()).toBe(201);
  expect(contentType).toContain('application/xml');
});

test('32.POST /todos JSON', {tag: ['@id_33', '@POST']}, async ({ request }) => {
  let response = await request.post(`${URL}todos`, {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "x-challenger": token},
  data: {
        "title": "create todo process payroll",
        "doneStatus": true,
        "description": ""
      } });
  const body = await response.json();
  const contentType = response.headers()['content-type'];
  expect(response.status()).toBe(201);
  expect(contentType).toContain('application/json');
});

test('33.POST /todos (415)', {tag: ['@id_33', '@POST']}, async ({ request }) => {
  let response = await request.post(`${URL}todos`, {
    headers: {
      "Content-Type": "bob",
      "x-challenger": token},
  data: {
        "title": "create todo process payroll",
        "doneStatus": true,
        "description": ""
      } });
  const body = await response.json();
  const contentType = response.headers()['content-type'];
  expect(response.status()).toBe(415);
  expect(contentType).toContain('application/json');
});

test('34.GET /challenger/guid (existing X-CHALLENGER)', {tag: ['@id_34', '@GET']}, async ({ request }) => {
  let response = await request.get(`${URL}challenger/`+ token, {
    headers: {"x-challenger": token},
});
  let headers = await response.headers();
  const body = await response.json();
  expect(response.status()).toBe(200);
  expect(headers).toEqual(
    expect.objectContaining({ "x-challenger": expect.any(String) }),
  );
});

test('35.PUT /challenger/guid RESTORE', {tag: ['@id_35', '@PUT']}, async ({ request }) => {
   const createResponse = await request.post(`${URL}challenger`);
   const tokenSecond = createResponse.headers()['x-challenger'];
   const getResponse = await request.get(`${URL}challenger/${tokenSecond}`, {
     headers: {"x-challenger": tokenSecond}
   });
   const progress = await getResponse.json();
   const response = await request.put(`${URL}challenger/${tokenSecond}`, {
     headers: {"x-challenger": tokenSecond},
     data: progress
   });
   const body = await response.json();
   expect(response.status()).toBe(200);
   expect(body).toMatchObject(progress);
 });

 /*test('36.PUT /challenger/guid CREATE', {tag: ['@id_36', '@PUT']}, async ({ request }) => {
  const getResponse = await request.get(`${URL}challenger/${token}`, {
    headers: {"x-challenger": token,},
  });
  const body = await getResponse.json();
  const newToken = "00001234-1234-1234-1234-000000001234";
  body.xChallenger = newToken;
  const putResponse = await request.put(`${URL}challenger/${newToken}`, {
    headers: {"x-challenger": newToken,},
    data: body});
  expect(putResponse.status()).toBe(201);
  expect(body.xChallenger).toBe(newToken);
});*/

test('37.	GET /challenger/database/guid (200)', {tag: ['@id_37', '@GET']}, async ({ request }) => {
  const response = await request.get(`${URL}challenger/database/${token}`, {
  headers: {"x-challenger": token},
  });
  expect(response.status()).toBe(200);
  expect(await response.json()).toBeTruthy();
});

test("38. PUT /challenger/database/guid (Update)", {tag: ['@id_38', '@PUT']}, async ({ request }) => {
  let response1 = await request.get(`${URL}challenger/database/${token}`, {
    headers: {
        "x-challenger": token,
      },
  });
  let body = await response1.json();
  let response2 = await request.put(`${URL}challenger/database/${token}`, {
      headers: {
          "x-challenger": token,
        },
        data: body
  });
  expect(response2.status()).toBe(204);
});

test("39. POST /todos XML to JSON", {tag: ['@id_39', '@POST']}, async ({ request }) => {
  const todoData = `
  <todo>
    <doneStatus>true</doneStatus>
    <title>file paperwork today</title>
  </todo>
`;
let response = await request.post(`${URL}todos`, {
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/xml",
    "X-CHALLENGER": token
  },
  data: todoData
});
const contentType = response.headers()['content-type'];
expect(response.status()).toBe(201);
expect(contentType).toContain('application/json');

});

test("40. POST /todos JSON to XML", {tag: ['@id_40', '@POST']}, async ({ request }) => {
  let response = await request.post(`${URL}todos`, {
    headers: {
      "Accept": "application/xml",
      "Content-Type": "application/json",
      "x-challenger": token},
  data: {
        "title": "create todo process payroll",
        "doneStatus": true,
        "description": ""
      } });
  const contentType = response.headers()['content-type'];
  expect(response.status()).toBe(201);
  expect(contentType).toContain('application/xml');
});
});