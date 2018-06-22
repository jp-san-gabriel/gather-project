const {assert} = require('chai');
const request = require('supertest');

const app = require('../../app');

const {parseTextFromHTML, seedItemToDatabase} = require('../test-utils');
const {connectDatabaseAndDropData, disconnectDatabase} = require('../setup-teardown-utils');

describe('Server path: /items/:id', () => {
  beforeEach(connectDatabaseAndDropData);

  afterEach(disconnectDatabase);

  // Write your test blocks below:
  it('GET - renders the item with the specified id', async() => {
    //setup
    const newItem = await seedItemToDatabase();

    //exercise
    const response = await request(app)
      .get(`/items/${newItem._id}`);

    //verify
    assert.include(parseTextFromHTML(response.text, '#item-title'), newItem.title);
    assert.include(parseTextFromHTML(response.text, '#item-description'), newItem.description);
  });

  it('GET - responds with NOT FOUND (404) error when id parameter is invalid', async() => {
    //setup
    const _id = 'invalid-id';

    //exercise
    const response = await request(app)
      .get(`/items/${_id}`);

    //verify
    assert.equal(response.status, 404);
  });
});
