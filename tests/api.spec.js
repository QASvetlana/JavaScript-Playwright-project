const { test, expect } = require('@playwright/test');
import { ChallengerService } from '../src/service/challenger.service';
import { ChallengesService } from '../src/service/challenges.service';
import { ToDosService } from '../src/service/todos.service';
import { faker } from '@faker-js/faker';
import { ToDoService } from '../src/service/todo.service';


test.describe("API challenge", () => {
    let URL = "https://apichallenges.herokuapp.com/";
    let token, challengerService, challengesService, toDosService, toDoService;
  
    test.beforeAll(async ({ request }) => {
      challengerService = new ChallengerService(request);
      const response = await challengerService.post();
      let headers = await response.headers();
      token = headers["x-challenger"];
      expect(headers).toEqual(
        expect.objectContaining({ "x-challenger": expect.any(String) }),
      );
    });

    test("2.Получить список заданий get /challenges", {tag: ['@id_2', '@GET']}, async ({ request }) => {
        challengesService = new ChallengesService(request);
        let response = await challengesService.get(token);
        let body = await response.json();
        expect(response.status()).toBe(200);
        expect(response.headers()).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(body.challenges.length).toBe(59);
      });

  test('3.GET /todos (200)', {tag: ['@id_3', '@GET']}, async ({ request }) => {
    toDosService = new ToDosService(request);
    let response = await toDosService.get(token);
    let body = await response.json();
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('todos');
  });

  test('4.GET /todo (404)', {tag: ['@id_4', '@GET']}, async ({ request }) => {
   toDoService = new ToDoService(request);
    let response = await toDoService.get(token);
    expect(response.status()).toBe(404);
  });

  test('5.GET /todos/{id} (200)', {tag: ['@id_5', '@GET']}, async ({ request }) => {
   toDosService = new ToDosService(request);
    let response = await toDosService.getWithId(token);
    let body = await response.json();
    expect(response.status()).toBe(200);
    expect(body).toEqual({"todos": [{"description": "", "doneStatus": false, "id": 2, "title": "file paperwork"}]});
  });

  test('6.GET /todos/{id} (404)', {tag: ['@id_6', '@GET']}, async ({ request }) => {
   toDosService = new ToDosService(request);
    let response = await toDosService.getWithNonExistentId(token);
    expect(response.status()).toBe(404);
  });

  test('7.GET /todos (200) ?filter', {tag: ['@id_7', '@GET']}, async ({ request }) => {
    toDosService = new ToDosService(request);
    await toDosService.postWithDoneStatuseFalse(token);
    await toDosService.postWithDoneStatuseTrue(token);
    let response = await toDosService.get(token);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.todos.some(todo => todo.doneStatus === true)).toBe(true);
  });

test('8.HEAD /todos (200)', {tag: ['@id_8', '@HEAD']}, async ({ request }) => {
    toDosService = new ToDosService(request);
    let response = await toDosService.head(token);
    expect(response.status()).toBe(200);
    expect(await response.body()).toBeUndefined;
  });

  test('9.POST /todos (201)', {tag: ['@id_9', '@POST']}, async ({ request }) => {
    toDosService = new ToDosService(request);
    let response = await toDosService.post(token);
    const body = await response.json();
    expect(response.status()).toBe(201);
    expect(body.doneStatus).toBe(true);
  });

  test('10.POST /todos (400) doneStatus', {tag: ['@id_10', '@POST']}, async ({ request }) => {
    toDosService = new ToDosService(request);
    let response = await toDosService.postWrongDoneStatus(token);
    const body = await response.json();
    expect(response.status()).toBe(400);
    expect(body.doneStatus).toBeUndefined;
  });

  test('11.	POST /todos (400) title too long', {tag: ['@id_11', '@POST']}, async ({ request }) => {
toDosService = new ToDosService(request);
    let response = await toDosService.postTitleToLong(token);
      const body = await response.json();
    expect(response.status()).toBe(400);
    expect(body).toEqual({
      errorMessages: [
        'Failed Validation: Maximum allowable length exceeded for title - maximum allowed is 50'
      ]
    });
    });

  test('12.	POST /todos (400) description too long', {tag: ['@id_12', '@POST']}, async ({ request }) => {
   toDosService = new ToDosService(request);
    let response = await toDosService.postDescriptionToLong(token);
      const body = await response.json();
    expect(response.status()).toBe(400);
    expect(body).toEqual({
      errorMessages: [
        'Failed Validation: Maximum allowable length exceeded for description - maximum allowed is 200'
      ]
    });
  });

  test('13.	POST /todos (201) max out content', {tag: ['@id_13', '@POST']}, async ({ request }) => {
   toDosService = new ToDosService(request);
    let response = await toDosService.postMaxContent(token);
      const body = await response.json();
    expect(response.status()).toBe(201);
  });

  test('14.	POST /todos (413) content too long', {tag: ['@id_14', '@POST']}, async ({ request }) => {
  toDosService = new ToDosService(request);
    let response = await toDosService.postTooLongContent(token);
      const body = await response.json();
    expect(response.status()).toBe(413);
    expect(body).toEqual({
      errorMessages: [
        'Error: Request body too large, max allowed is 5000 bytes'
      ]
    });
  });

  test('15.	POST /todos (400) extra', {tag: ['@id_15', '@POST']}, async ({ request }) => {
    toDosService = new ToDosService(request);
    let response = await toDosService.postWrongFieldInData(token);
      const body = await response.json();
    expect(response.status()).toBe(400);
    expect(body).toEqual({
      errorMessages: [
        'Could not find field: priority'
      ]
    });
  });

  test('16. PUT /todos/{id} (400)', {tag: ['@id_16', '@PUT']}, async ({ request }) => {
    toDosService = new ToDosService(request);
    let response = await toDosService.putWrong(token);
      const body = await response.json();
    expect(response.status()).toBe(400);
    expect(body).toEqual({
      errorMessages: [
        'Cannot create todo with PUT due to Auto fields id'
      ]
    });
  });

  test('17. POST /todos/{id} (200)', {tag: ['@id_17', '@POST']}, async ({ request }) => {
     toDosService = new ToDosService(request);
    let response = await toDosService.postWithNewTitleCorrectID(token);
      const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.title).toBe("new title");
  });

  test('18. POST /todos/{id} (404)', {tag: ['@id_18', '@POST']}, async ({ request }) => {
    toDosService = new ToDosService(request);
    let response = await toDosService.postWithNewTitleIncorrectID(token);
      const body = await response.json();
    expect(response.status()).toBe(404);
    expect(body).toEqual({
      errorMessages: [
        'No such todo entity instance with id == 111 found'
      ]
    });
});

test('19. PUT /todos/{id} full (200)', {tag: ['@id_19', '@PUT']}, async ({ request }) => {
   toDosService = new ToDosService(request);
  let response = await toDosService.put(token)

    const body = await response.json();
  expect(response.status()).toBe(200);
  expect(body.title).toBe("updated title");
  expect(body.doneStatus).toBe(true);
  expect(body.description).toBe("updated description");
});

test('20. PUT /todos/{id} partial (200)', {tag: ['@id_20', '@PUT']}, async ({ request }) => {
toDosService = new ToDosService(request);
  let response = await toDosService.putPartialUpdate(token)
    const body = await response.json();
  expect(response.status()).toBe(200);
  expect(body.title).toBe("partial update for title");
});

test('21. PUT /todos/{id} no title (400)', {tag: ['@id_21', '@PUT']}, async ({ request }) => {
  toDosService = new ToDosService(request);
let response = await toDosService.putWithoutTitle(token)
    const body = await response.json();
  expect(response.status()).toBe(400);
  expect(body).toEqual({
    errorMessages: [
      'title : field is mandatory'
    ]
  });
});

test('22. PUT /todos/{id} no amend id (400)', {tag: ['@id_22', '@PUT']}, async ({ request }) => {
  toDosService = new ToDosService(request);
let response = await toDosService.putDifferentId(token)
    const body = await response.json();
  expect(response.status()).toBe(400);
  expect(body).toEqual({
    errorMessages: [
      'Can not amend id from 2 to 3'
    ]
  });
});

test('23. DELETE /todos/{id} (200)', {tag: ['@id_23', '@DELETE']}, async ({ request }) => {
   toDosService = new ToDosService(request);
let response = await toDosService.delete(token)
  expect(response.status()).toBe(200);
  let getResponse = await toDosService.getWithId(token)
  expect(getResponse.status()).toBe(404); 
});

test('24. OPTIONS /todos (200)', {tag: ['@id_24', '@OPTIONS']}, async ({ request }) => {
  toDosService = new ToDosService(request);
let response = await toDosService.options(token)
  let headers = await response.headers();
  expect(response.status()).toBe(200);
  expect(headers['allow']).toContain('OPTIONS');
});

test('25.GET /todos (200) XML', {tag: ['@id_25', '@GET']}, async ({ request }) => {
  toDosService = new ToDosService(request);
let response = await toDosService.getWithXml(token)
  const headers = response.headers();
  const contentType = headers['content-type'];
  expect(response.status()).toBe(200);
  expect(contentType).toContain('application/xml');
});

test('26.GET /todos (200) JSON', {tag: ['@id_26', '@GET']}, async ({ request }) => {
  toDosService = new ToDosService(request);
let response = await toDosService.getWithJSON(token)
  const headers = response.headers();
  const contentType = headers['content-type'];
  expect(response.status()).toBe(200);
  expect(contentType).toContain('application/json');

});

test('27.GET /todos (200) ANY', {tag: ['@id_27', '@GET']}, async ({ request }) => {
  toDosService = new ToDosService(request);
let response = await toDosService.getWithAny(token)
  const headers = response.headers();
  const contentType = headers['content-type'];
  expect(response.status()).toBe(200);
  expect(contentType).toContain('application/json');

});

test('28.GET /todos (200) XML pref', {tag: ['@id_28', '@GET']}, async ({ request }) => {
   toDosService = new ToDosService(request);
let response = await toDosService.getWithPref(token)
  const headers = response.headers();
  const body = await response.text();
  const contentType = headers['content-type'];
  expect(response.status()).toBe(200);
  expect(contentType).toContain('application/xml');
});

test('29.GET /todos (200) no accept', {tag: ['@id_29', '@GET']}, async ({ request }) => {
 toDosService = new ToDosService(request);
let response = await toDosService.getWithoutAccept(token)
  const headers = response.headers();
  const body = await response.text();
  const contentType = headers['content-type'];
  expect(response.status()).toBe(200);
  expect(contentType).toContain('application/json');
  
});

test('30.GET /todos (406)', {tag: ['@id_30', '@GET']}, async ({ request }) => {
  toDosService = new ToDosService(request);
let response = await toDosService.getWithAcceptGzip(token)
  expect(response.status()).toBe(406);
});


});