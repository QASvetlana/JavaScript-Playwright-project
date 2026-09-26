import { test, expect } from '@playwright/test';
import { App } from '../src/service/app.service';

test.describe("API challenge", () => {
  let token;

  test.beforeAll(async ({ request }) => {
    const tempApp = new App(request);
    const response = await tempApp.challengerService.post();
    expect(response.status(), `POST /challenger вернул: ${await response.text()}`).toBe(201);
    token = response.headers()["x-challenger"];
    expect(token, "в ответе нет заголовка X-CHALLENGER").toBeTruthy();
  });

  test("2.Получить список заданий get /challenges", { tag: ['@id_2', '@GET'] }, async ({ request }) => {
    const app = new App(request);
    let response = await app.challengesService.get(token);
    let body = await response.json();
    expect(response.status()).toBe(200);
    expect(response.headers()).toEqual(expect.objectContaining({ "x-challenger": token }));
    expect(body.challenges.length).toBeGreaterThan(0);
  });

  test('3.GET /todos (200)', { tag: ['@id_3', '@GET'] }, async ({ request }) => {
    const app = new App(request);
    let response = await app.todosService.get(token);
    let body = await response.json();
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('todos');
  });

  test('4.GET /todo (404)', { tag: ['@id_4', '@GET'] }, async ({ request }) => {
    const app = new App(request);
    let response = await app.todoService.get(token);
    expect(response.status()).toBe(404);
  });

  test('5.GET /todos/{id} (200)', { tag: ['@id_5', '@GET'] }, async ({ request }) => {
    const app = new App(request);
    let response = await app.todosService.getWithId(token);
    let body = await response.json();
    expect(response.status()).toBe(200);
    expect(body).toEqual({ "todos": [{ "description": "", "doneStatus": false, "id": 2, "title": "file paperwork" }] });
  });

  test('6.GET /todos/{id} (404)', { tag: ['@id_6', '@GET'] }, async ({ request }) => {
    const app = new App(request);
    let response = await app.todosService.getWithNonExistentId(token);
    expect(response.status()).toBe(404);
  });

  test('7.GET /todos (200) ?filter', { tag: ['@id_7', '@GET'] }, async ({ request }) => {
    const app = new App(request);
    await app.todosService.postWithDoneStatuseFalse(token);
    await app.todosService.postWithDoneStatuseTrue(token);
    let response = await app.todosService.get(token);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.todos.some(todo => todo.doneStatus === true)).toBe(true);
  });

  test('22.HEAD /todos (200)', { tag: ['@id_22', '@HEAD'] }, async ({ request }) => {
    const app = new App(request);
    let response = await app.todosService.head(token);
    expect(response.status()).toBe(200);
    expect((await response.body()).length).toBe(0);
  });

  test('23.POST /todos (201)', { tag: ['@id_23', '@POST'] }, async ({ request }) => {
    const app = new App(request);
    let response = await app.todosService.post(token);
    const body = await response.json();
    expect(response.status()).toBe(201);
    expect(body.doneStatus).toBe(true);
  });

  test('24.POST /todos (422) doneStatus', { tag: ['@id_24', '@POST'] }, async ({ request }) => {
    const app = new App(request);
    let response = await app.todosService.postWrongDoneStatus(token);
    const body = await response.json();
    expect(response.status()).toBe(422);
    expect(body.doneStatus).toBeUndefined();
  });

  test('25. POST /todos (422) title too long', { tag: ['@id_25', '@POST'] }, async ({ request }) => {
    const app = new App(request);
    let response = await app.todosService.postTitleToLong(token);
    const body = await response.json();
    expect(response.status()).toBe(422);
    expect(body).toEqual({
      errorMessages: [
        'Failed Validation: Maximum allowable length exceeded for title - maximum allowed is 50'
      ]
    });
  });

  test('26. POST /todos (422) description too long', { tag: ['@id_26', '@POST'] }, async ({ request }) => {
    const app = new App(request);
    let response = await app.todosService.postDescriptionToLong(token);
    const body = await response.json();
    expect(response.status()).toBe(422);
    expect(body).toEqual({
      errorMessages: [
        'Failed Validation: Maximum allowable length exceeded for description - maximum allowed is 200'
      ]
    });
  });

  test('27. POST /todos (201) max out content', { tag: ['@id_27', '@POST'] }, async ({ request }) => {
    const app = new App(request);
    let response = await app.todosService.postMaxContent(token);
    const body = await response.json();
    expect(response.status()).toBe(201);
  });

  test('28. POST /todos (413) content too long', { tag: ['@id_28', '@POST'] }, async ({ request }) => {
    const app = new App(request);
    let response = await app.todosService.postTooLongContent(token);
    const body = await response.json();
    expect(response.status()).toBe(413);
    expect(body).toEqual({
      errorMessages: [
        'Error: Request body too large, max allowed is 5000 bytes'
      ]
    });
  });

  test('29. POST /todos (422) extra', { tag: ['@id_29', '@POST'] }, async ({ request }) => {
    const app = new App(request);
    let response = await app.todosService.postWrongFieldInData(token);
    const body = await response.json();
    expect(response.status()).toBe(422);
    expect(body).toEqual({
      errorMessages: [
        'Could not find field: priority'
      ]
    });
  });

  test('30. PUT /todos/{id} (422)', { tag: ['@id_30', '@PUT'] }, async ({ request }) => {
    const app = new App(request);
    let response = await app.todosService.putWrong(token);
    const body = await response.json();
    expect(response.status()).toBe(422);
    expect(body).toEqual({
      errorMessages: [
        'Cannot create todo with PUT due to Auto fields id'
      ]
    });
  });

  test('31. POST /todos/{id} (200)', { tag: ['@id_31', '@POST'] }, async ({ request }) => {
    const app = new App(request);
    let response = await app.todosService.postWithNewTitleCorrectID(token);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.title).toBe("new title");
  });

  test('32. POST /todos/{id} (404)', { tag: ['@id_32', '@POST'] }, async ({ request }) => {
    const app = new App(request);
    let response = await app.todosService.postWithNewTitleIncorrectID(token);
    const body = await response.json();
    expect(response.status()).toBe(404);
    expect(body).toEqual({
      errorMessages: [
        'No such todo entity instance with id == 111 found'
      ]
    });
  });

  test('33. PUT /todos/{id} full (200)', { tag: ['@id_33', '@PUT'] }, async ({ request }) => {
    const app = new App(request);
    let response = await app.todosService.put(token);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.title).toBe("updated title");
    expect(body.doneStatus).toBe(true);
    expect(body.description).toBe("updated description");
  });

  test('34. PUT /todos/{id} partial (200)', { tag: ['@id_34', '@PUT'] }, async ({ request }) => {
    const app = new App(request);
    let response = await app.todosService.putPartialUpdate(token);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.title).toBe("partial update for title");
  });

  test('37. PUT /todos/{id} no title (422)', { tag: ['@id_37', '@PUT'] }, async ({ request }) => {
    const app = new App(request);
    let response = await app.todosService.putWithoutTitle(token);
    const body = await response.json();
    expect(response.status()).toBe(422);
    expect(body).toEqual({
      errorMessages: [
        'title : field is mandatory'
      ]
    });
  });

  test('40. PUT /todos/{id} no amend id (422)', { tag: ['@id_40', '@PUT'] }, async ({ request }) => {
    const app = new App(request);
    let response = await app.todosService.putDifferentId(token);
    const body = await response.json();
    expect(response.status()).toBe(422);
    expect(body).toEqual({
      errorMessages: [
        'Can not amend id from 2 to 3'
      ]
    });
  });

  test('41. DELETE /todos/{id} (204)', { tag: ['@id_41', '@DELETE'] }, async ({ request }) => {
    const app = new App(request);
    let response = await app.todosService.delete(token);
    expect(response.status()).toBe(204);
    let getResponse = await app.todosService.getWithId(token);
    expect(getResponse.status()).toBe(404);
  });

  test('48. OPTIONS /todos (200)', { tag: ['@id_48', '@OPTIONS'] }, async ({ request }) => {
    const app = new App(request);
    let response = await app.todosService.options(token);
    let headers = await response.headers();
    expect(response.status()).toBe(200);
    expect(headers['allow']).toContain('OPTIONS');
  });

  test('49.GET /todos (200) XML', { tag: ['@id_49', '@GET'] }, async ({ request }) => {
    const app = new App(request);
    let response = await app.todosService.getWithXml(token);
    const headers = response.headers();
    const contentType = headers['content-type'];
    expect(response.status()).toBe(200);
    expect(contentType).toContain('application/xml');
  });

  test('50.GET /todos (200) JSON', { tag: ['@id_50', '@GET'] }, async ({ request }) => {
    const app = new App(request);
    let response = await app.todosService.getWithJSON(token);
    const headers = response.headers();
    const contentType = headers['content-type'];
    expect(response.status()).toBe(200);
    expect(contentType).toContain('application/json');
  });

  test('51.GET /todos (200) ANY', { tag: ['@id_51', '@GET'] }, async ({ request }) => {
    const app = new App(request);
    let response = await app.todosService.getWithAny(token);
    const headers = response.headers();
    const contentType = headers['content-type'];
    expect(response.status()).toBe(200);
    expect(contentType).toContain('application/json');
  });

  test('52.GET /todos (200) XML pref', { tag: ['@id_52', '@GET'] }, async ({ request }) => {
    const app = new App(request);
    let response = await app.todosService.getWithPref(token);
    const headers = response.headers();
    const body = await response.text();
    const contentType = headers['content-type'];
    expect(response.status()).toBe(200);
    expect(contentType).toContain('application/xml');
  });

  test('53.GET /todos (200) no accept', { tag: ['@id_53', '@GET'] }, async ({ request }) => {
    const app = new App(request);
    let response = await app.todosService.getWithoutAccept(token);
    const headers = response.headers();
    const body = await response.text();
    const contentType = headers['content-type'];
    expect(response.status()).toBe(200);
    expect(contentType).toContain('application/json');
  });

  test('54.GET /todos (406)', { tag: ['@id_54', '@GET'] }, async ({ request }) => {
    const app = new App(request);
    let response = await app.todosService.getWithAcceptGzip(token);
    expect(response.status()).toBe(406);
  });
});