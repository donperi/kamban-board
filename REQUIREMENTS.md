# Kanban Test Setup.

Implement unit tests and integrations to components in this project.

## Unit Testing

For unit testing use [Jest](https://jestjs.io/]) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

Store files inside `client/tests` and match the tested component folder structure to the test one.

Ex: `client/components/SomeComponent.js -> client/components/SomeComponent.test.js`

### Requirements

- Test `client/services/kanban.js` checking if that functions are making the correct API requests.
- Test `client/module/kanban.js` checking that actions are mutation the state correctly.
- Test `client/comopnents/kanban/TaskForm.js` checking that the submittion handler is triggering correctly.
- Test `client/components/kanban/Task.js` checking that:
  - Delete button is triggering correct action
  - Tags are being rendered
  - Edit button is sending us to the correct URL.
  - `onTaskSelection` prop is being called.

Bonus

- Test `/components/kanban/Kanban.js` checking that dragging a Task to different stage Stage is triggering the correct Stage callback.

## Integration Testing.

Use whatever tool you feel confortable with (Cypress, Selenium, Puppeteer).

This should be interacting with the APi.

### Requirements

- Test that creating a new task is working.
- Test that deleting a task is working.
- Test that the filter form is working.
- Test that dragging a task to another stage is working.
- Test that reordering a task in the same stage is working.

## Bonus

Add API tests.
