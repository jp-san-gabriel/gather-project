const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../../app');

const {parseTextFromHTML, seedItemToDatabase, buildItemObject} = require('../test-utils');
const {connectDatabaseAndDropData, disconnectDatabase} = require('../setup-teardown-utils');
const Item = require('../../models/item');

describe('Server path: /items/:id/update', () => {
  beforeEach(connectDatabaseAndDropData);

  afterEach(disconnectDatabase);

  // Write your test blocks below:
  describe('GET', () => {
    it('displays item for updating', async () => {
      //setup
      const itemToUpdate = await seedItemToDatabase();

      //exercise
      const response = await request(app)
        .get(`/items/${itemToUpdate._id}/update`)
        .send();

      //verify
      const doc = jsdom(response.text);

      assert.equal(response.status, 200);
      assert.equal(doc.querySelector('#title-input').value, itemToUpdate.title);
      assert.equal(doc.querySelector('#description-input').value, itemToUpdate.description);
      assert.equal(doc.querySelector('#imageUrl-input').value, itemToUpdate.imageUrl);
    });

    it('responds with error if id is invalid', async () => {
      //Setup
      const unsavedItem = buildItemObject();
      unsavedItem._id = 'invalid id';

      //EXERCISE
      const response = await request(app)
        .get(`/items/${unsavedItem._id}/update`)
        .send();

      //VERIFY
      assert.equal(response.status, 404);
    });
  });

  describe('POST', () => { //POST request to /items/:id/update

    //POST - /items/:id/update
    it('updates item', async () => {
    //SETUP
      let itemToUpdate = await seedItemToDatabase();

      //convert itemToUpdate into an ordinary javascript object,
      //since it is returned as a mongoose document from seedItemToDatabase.
      itemToUpdate = itemToUpdate.toObject();

      //change the values
      itemToUpdate.title = 'New Title';
      itemToUpdate.description = 'New Description';


    //EXERCISE
      const response = await request(app)
        .post('/items/' + itemToUpdate._id + '/update')
        .type('form')
        .send(itemToUpdate);


    //VERIFY
      let updatedItem = await Item.findById(itemToUpdate._id);

      //convert updatedItem to an ordinary javascript object
      //for deepEqual comparison with itemToUpdate
      updatedItem = updatedItem.toObject();

      assert.deepEqual(updatedItem, itemToUpdate);
    });

    //POST - /items/:id/update
    it('responds with an error if id is invalid', async () => {
      //Setup
      const item = buildItemObject();
      item._id = 'invalid id';

      //Exercise
      const response = await request(app)
        .post(`/items/${item._id}/update`)
        .type('form')
        .send(item);

      //Verify
      assert.equal(response.status, 404);
    });
  });
});
