const {assert} = require('chai');
const request = require('supertest');

const app = require('../../app');

const {parseTextFromHTML, seedItemToDatabase} = require('../test-utils');
const {connectDatabaseAndDropData, disconnectDatabase} = require('../setup-teardown-utils');

describe('Server path: /items/:id/delete', () => {
  beforeEach(connectDatabaseAndDropData);

  afterEach(disconnectDatabase);

  // Write your test blocks below:
  describe('POST', () => {
    it('deletes the item with the specified id', async() => {
      //setup
      const newItem = await seedItemToDatabase();

      //exercise
      const response = await request(app)
        .post(`/items/${newItem._id}/delete`);

      //verify
      assert.equal(response.status, 303);
      assert.equal(response.headers.location, '/');
    });

    it('responds with an error if item is not found or id is invalid', async() => {
      //setup
      const itemId = '0';

      //excercise
      const response = await(request(app))
        .post(`/items/${itemId}/delete`);

      //verify
      assert.equal(response.status, 404);
    });
  });
});
