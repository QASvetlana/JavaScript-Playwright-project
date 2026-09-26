# Test info

- Name: API challenge >> 37. PUT /todos/{id} no title (422)
- Location: /home/runner/work/JavaScript-Playwright-project/JavaScript-Playwright-project/tests/api.spec.js:190:7

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 1

  Object {
    "errorMessages": Array [
-     "title : field is mandatory",
+     "Failed Validation: title : field is mandatory",
    ],
  }
    at /home/runner/work/JavaScript-Playwright-project/JavaScript-Playwright-project/tests/api.spec.js:195:18
```

# Test source

```ts
   95 |   });
   96 |
   97 |   test('26. POST /todos (422) description too long', { tag: ['@id_26', '@POST'] }, async ({ request }) => {
   98 |     const app = new App(request);
   99 |     let response = await app.todosService.postDescriptionToLong(token);
  100 |     const body = await response.json();
  101 |     expect(response.status()).toBe(422);
  102 |     expect(body).toEqual({
  103 |       errorMessages: [
  104 |         'Failed Validation: Maximum allowable length exceeded for description - maximum allowed is 200'
  105 |       ]
  106 |     });
  107 |   });
  108 |
  109 |   test('27. POST /todos (201) max out content', { tag: ['@id_27', '@POST'] }, async ({ request }) => {
  110 |     const app = new App(request);
  111 |     let response = await app.todosService.postMaxContent(token);
  112 |     const body = await response.json();
  113 |     expect(response.status()).toBe(201);
  114 |   });
  115 |
  116 |   test('28. POST /todos (413) content too long', { tag: ['@id_28', '@POST'] }, async ({ request }) => {
  117 |     const app = new App(request);
  118 |     let response = await app.todosService.postTooLongContent(token);
  119 |     const body = await response.json();
  120 |     expect(response.status()).toBe(413);
  121 |     expect(body).toEqual({
  122 |       errorMessages: [
  123 |         'Error: Request body too large, max allowed is 5000 bytes'
  124 |       ]
  125 |     });
  126 |   });
  127 |
  128 |   test('29. POST /todos (422) extra', { tag: ['@id_29', '@POST'] }, async ({ request }) => {
  129 |     const app = new App(request);
  130 |     let response = await app.todosService.postWrongFieldInData(token);
  131 |     const body = await response.json();
  132 |     expect(response.status()).toBe(422);
  133 |     expect(body).toEqual({
  134 |       errorMessages: [
  135 |         'Could not find field: priority'
  136 |       ]
  137 |     });
  138 |   });
  139 |
  140 |   test('30. PUT /todos/{id} (422)', { tag: ['@id_30', '@PUT'] }, async ({ request }) => {
  141 |     const app = new App(request);
  142 |     let response = await app.todosService.putWrong(token);
  143 |     const body = await response.json();
  144 |     expect(response.status()).toBe(422);
  145 |     expect(body).toEqual({
  146 |       errorMessages: [
  147 |         'Cannot create todo with PUT due to Auto fields id'
  148 |       ]
  149 |     });
  150 |   });
  151 |
  152 |   test('31. POST /todos/{id} (200)', { tag: ['@id_31', '@POST'] }, async ({ request }) => {
  153 |     const app = new App(request);
  154 |     let response = await app.todosService.postWithNewTitleCorrectID(token);
  155 |     const body = await response.json();
  156 |     expect(response.status()).toBe(200);
  157 |     expect(body.title).toBe("new title");
  158 |   });
  159 |
  160 |   test('32. POST /todos/{id} (404)', { tag: ['@id_32', '@POST'] }, async ({ request }) => {
  161 |     const app = new App(request);
  162 |     let response = await app.todosService.postWithNewTitleIncorrectID(token);
  163 |     const body = await response.json();
  164 |     expect(response.status()).toBe(404);
  165 |     expect(body).toEqual({
  166 |       errorMessages: [
  167 |         'No such todo entity instance with id == 111 found'
  168 |       ]
  169 |     });
  170 |   });
  171 |
  172 |   test('33. PUT /todos/{id} full (200)', { tag: ['@id_33', '@PUT'] }, async ({ request }) => {
  173 |     const app = new App(request);
  174 |     let response = await app.todosService.put(token);
  175 |     const body = await response.json();
  176 |     expect(response.status()).toBe(200);
  177 |     expect(body.title).toBe("updated title");
  178 |     expect(body.doneStatus).toBe(true);
  179 |     expect(body.description).toBe("updated description");
  180 |   });
  181 |
  182 |   test('34. PUT /todos/{id} partial (200)', { tag: ['@id_34', '@PUT'] }, async ({ request }) => {
  183 |     const app = new App(request);
  184 |     let response = await app.todosService.putPartialUpdate(token);
  185 |     const body = await response.json();
  186 |     expect(response.status()).toBe(200);
  187 |     expect(body.title).toBe("partial update for title");
  188 |   });
  189 |
  190 |   test('37. PUT /todos/{id} no title (422)', { tag: ['@id_37', '@PUT'] }, async ({ request }) => {
  191 |     const app = new App(request);
  192 |     let response = await app.todosService.putWithoutTitle(token);
  193 |     const body = await response.json();
  194 |     expect(response.status()).toBe(422);
> 195 |     expect(body).toEqual({
      |                  ^ Error: expect(received).toEqual(expected) // deep equality
  196 |       errorMessages: [
  197 |         'title : field is mandatory'
  198 |       ]
  199 |     });
  200 |   });
  201 |
  202 |   test('40. PUT /todos/{id} no amend id (422)', { tag: ['@id_40', '@PUT'] }, async ({ request }) => {
  203 |     const app = new App(request);
  204 |     let response = await app.todosService.putDifferentId(token);
  205 |     const body = await response.json();
  206 |     expect(response.status()).toBe(422);
  207 |     expect(body).toEqual({
  208 |       errorMessages: [
  209 |         'Can not amend id from 2 to 3'
  210 |       ]
  211 |     });
  212 |   });
  213 |
  214 |   test('41. DELETE /todos/{id} (204)', { tag: ['@id_41', '@DELETE'] }, async ({ request }) => {
  215 |     const app = new App(request);
  216 |     let response = await app.todosService.delete(token);
  217 |     expect(response.status()).toBe(204);
  218 |     let getResponse = await app.todosService.getWithId(token);
  219 |     expect(getResponse.status()).toBe(404);
  220 |   });
  221 |
  222 |   test('48. OPTIONS /todos (200)', { tag: ['@id_48', '@OPTIONS'] }, async ({ request }) => {
  223 |     const app = new App(request);
  224 |     let response = await app.todosService.options(token);
  225 |     let headers = await response.headers();
  226 |     expect(response.status()).toBe(200);
  227 |     expect(headers['allow']).toContain('OPTIONS');
  228 |   });
  229 |
  230 |   test('49.GET /todos (200) XML', { tag: ['@id_49', '@GET'] }, async ({ request }) => {
  231 |     const app = new App(request);
  232 |     let response = await app.todosService.getWithXml(token);
  233 |     const headers = response.headers();
  234 |     const contentType = headers['content-type'];
  235 |     expect(response.status()).toBe(200);
  236 |     expect(contentType).toContain('application/xml');
  237 |   });
  238 |
  239 |   test('50.GET /todos (200) JSON', { tag: ['@id_50', '@GET'] }, async ({ request }) => {
  240 |     const app = new App(request);
  241 |     let response = await app.todosService.getWithJSON(token);
  242 |     const headers = response.headers();
  243 |     const contentType = headers['content-type'];
  244 |     expect(response.status()).toBe(200);
  245 |     expect(contentType).toContain('application/json');
  246 |   });
  247 |
  248 |   test('51.GET /todos (200) ANY', { tag: ['@id_51', '@GET'] }, async ({ request }) => {
  249 |     const app = new App(request);
  250 |     let response = await app.todosService.getWithAny(token);
  251 |     const headers = response.headers();
  252 |     const contentType = headers['content-type'];
  253 |     expect(response.status()).toBe(200);
  254 |     expect(contentType).toContain('application/json');
  255 |   });
  256 |
  257 |   test('52.GET /todos (200) XML pref', { tag: ['@id_52', '@GET'] }, async ({ request }) => {
  258 |     const app = new App(request);
  259 |     let response = await app.todosService.getWithPref(token);
  260 |     const headers = response.headers();
  261 |     const body = await response.text();
  262 |     const contentType = headers['content-type'];
  263 |     expect(response.status()).toBe(200);
  264 |     expect(contentType).toContain('application/xml');
  265 |   });
  266 |
  267 |   test('53.GET /todos (200) no accept', { tag: ['@id_53', '@GET'] }, async ({ request }) => {
  268 |     const app = new App(request);
  269 |     let response = await app.todosService.getWithoutAccept(token);
  270 |     const headers = response.headers();
  271 |     const body = await response.text();
  272 |     const contentType = headers['content-type'];
  273 |     expect(response.status()).toBe(200);
  274 |     expect(contentType).toContain('application/json');
  275 |   });
  276 |
  277 |   test('54.GET /todos (406)', { tag: ['@id_54', '@GET'] }, async ({ request }) => {
  278 |     const app = new App(request);
  279 |     let response = await app.todosService.getWithAcceptGzip(token);
  280 |     expect(response.status()).toBe(406);
  281 |   });
  282 | });
```