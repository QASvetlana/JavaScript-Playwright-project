# Test info

- Name: API challenge >> 36.PUT /challenger/guid CREATE
- Location: /home/runner/work/JavaScript-Playwright-project/JavaScript-Playwright-project/tests/api.spec.js:450:2

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 201
Received: 200
    at /home/runner/work/JavaScript-Playwright-project/JavaScript-Playwright-project/tests/api.spec.js:460:32
```

# Test source

```ts
  360 |     headers: { 
  361 |       'x-challenger': token,
  362 |       'Accept': 'application/gzip'  
  363 |     }
  364 |   });
  365 |   expect(response.status()).toBe(406);
  366 | });
  367 |
  368 | test('31.POST /todos XML', {tag: ['@id_31', '@POST']}, async ({ request }) => {
  369 |   const todoData = `
  370 |     <todo>
  371 |       <doneStatus>true</doneStatus>
  372 |       <title>file paperwork today</title>
  373 |     </todo>
  374 |   `;
  375 |   let response = await request.post(`${URL}todos`, {
  376 |     headers: {
  377 |       "Accept": "application/xml",
  378 |       "Content-Type": "application/xml",
  379 |       "X-CHALLENGER": token
  380 |     },
  381 |     data: todoData
  382 |   });
  383 |   const body = await response.text();
  384 |   const contentType = response.headers()['content-type'];
  385 |   expect(response.status()).toBe(201);
  386 |   expect(contentType).toContain('application/xml');
  387 | });
  388 |
  389 | test('32.POST /todos JSON', {tag: ['@id_33', '@POST']}, async ({ request }) => {
  390 |   let response = await request.post(`${URL}todos`, {
  391 |     headers: {
  392 |       "Accept": "application/json",
  393 |       "Content-Type": "application/json",
  394 |       "x-challenger": token},
  395 |   data: {
  396 |         "title": "create todo process payroll",
  397 |         "doneStatus": true,
  398 |         "description": ""
  399 |       } });
  400 |   const body = await response.json();
  401 |   const contentType = response.headers()['content-type'];
  402 |   expect(response.status()).toBe(201);
  403 |   expect(contentType).toContain('application/json');
  404 | });
  405 |
  406 | test('33.POST /todos (415)', {tag: ['@id_33', '@POST']}, async ({ request }) => {
  407 |   let response = await request.post(`${URL}todos`, {
  408 |     headers: {
  409 |       "Content-Type": "bob",
  410 |       "x-challenger": token},
  411 |   data: {
  412 |         "title": "create todo process payroll",
  413 |         "doneStatus": true,
  414 |         "description": ""
  415 |       } });
  416 |   const body = await response.json();
  417 |   const contentType = response.headers()['content-type'];
  418 |   expect(response.status()).toBe(415);
  419 |   expect(contentType).toContain('application/json');
  420 | });
  421 |
  422 | test('34.GET /challenger/guid (existing X-CHALLENGER)', {tag: ['@id_34', '@GET']}, async ({ request }) => {
  423 |   let response = await request.get(`${URL}challenger/`+ token, {
  424 |     headers: {"x-challenger": token},
  425 | });
  426 |   let headers = await response.headers();
  427 |   const body = await response.json();
  428 |   expect(response.status()).toBe(200);
  429 |   expect(headers).toEqual(
  430 |     expect.objectContaining({ "x-challenger": expect.any(String) }),
  431 |   );
  432 | });
  433 |
  434 | test('35.PUT /challenger/guid RESTORE', {tag: ['@id_35', '@PUT']}, async ({ request }) => {
  435 |    const createResponse = await request.post(`${URL}challenger`);
  436 |    const tokenSecond = createResponse.headers()['x-challenger'];
  437 |    const getResponse = await request.get(`${URL}challenger/${tokenSecond}`, {
  438 |      headers: {"x-challenger": tokenSecond}
  439 |    });
  440 |    const progress = await getResponse.json();
  441 |    const response = await request.put(`${URL}challenger/${tokenSecond}`, {
  442 |      headers: {"x-challenger": tokenSecond},
  443 |      data: progress
  444 |    });
  445 |    const body = await response.json();
  446 |    expect(response.status()).toBe(200);
  447 |    expect(body).toMatchObject(progress);
  448 |  });
  449 |
  450 |  test('36.PUT /challenger/guid CREATE', {tag: ['@id_36', '@PUT']}, async ({ request }) => {
  451 |   const getResponse = await request.get(`${URL}challenger/${token}`, {
  452 |     headers: {"x-challenger": token,},
  453 |   });
  454 |   const body = await getResponse.json();
  455 |   const newToken = "00001234-1234-1234-1234-000000001234";
  456 |   body.xChallenger = newToken;
  457 |   const putResponse = await request.put(`${URL}challenger/${newToken}`, {
  458 |     headers: {"x-challenger": newToken,},
  459 |     data: body});
> 460 |   expect(putResponse.status()).toBe(201);
      |                                ^ Error: expect(received).toBe(expected) // Object.is equality
  461 |   expect(body.xChallenger).toBe(newToken);
  462 | });
  463 |
  464 | test('37.	GET /challenger/database/guid (200)', {tag: ['@id_37', '@GET']}, async ({ request }) => {
  465 |   const response = await request.get(`${URL}challenger/database/${token}`, {
  466 |   headers: {"x-challenger": token},
  467 |   });
  468 |   expect(response.status()).toBe(200);
  469 |   expect(await response.json()).toBeTruthy();
  470 | });
  471 |
  472 | test("38. PUT /challenger/database/guid (Update)", {tag: ['@id_38', '@PUT']}, async ({ request }) => {
  473 |   let response1 = await request.get(`${URL}challenger/database/${token}`, {
  474 |     headers: {
  475 |         "x-challenger": token,
  476 |       },
  477 |   });
  478 |   let body = await response1.json();
  479 |   let response2 = await request.put(`${URL}challenger/database/${token}`, {
  480 |       headers: {
  481 |           "x-challenger": token,
  482 |         },
  483 |         data: body
  484 |   });
  485 |   expect(response2.status()).toBe(204);
  486 | });
  487 |
  488 | test("39. POST /todos XML to JSON", {tag: ['@id_39', '@POST']}, async ({ request }) => {
  489 |   const todoData = `
  490 |   <todo>
  491 |     <doneStatus>true</doneStatus>
  492 |     <title>file paperwork today</title>
  493 |   </todo>
  494 | `;
  495 | let response = await request.post(`${URL}todos`, {
  496 |   headers: {
  497 |     "Accept": "application/json",
  498 |     "Content-Type": "application/xml",
  499 |     "X-CHALLENGER": token
  500 |   },
  501 |   data: todoData
  502 | });
  503 | const contentType = response.headers()['content-type'];
  504 | expect(response.status()).toBe(201);
  505 | expect(contentType).toContain('application/json');
  506 |
  507 | });
  508 |
  509 | test("40. POST /todos JSON to XML", {tag: ['@id_40', '@POST']}, async ({ request }) => {
  510 |   let response = await request.post(`${URL}todos`, {
  511 |     headers: {
  512 |       "Accept": "application/xml",
  513 |       "Content-Type": "application/json",
  514 |       "x-challenger": token},
  515 |   data: {
  516 |         "title": "create todo process payroll",
  517 |         "doneStatus": true,
  518 |         "description": ""
  519 |       } });
  520 |   const contentType = response.headers()['content-type'];
  521 |   expect(response.status()).toBe(201);
  522 |   expect(contentType).toContain('application/xml');
  523 | });
  524 | });
```