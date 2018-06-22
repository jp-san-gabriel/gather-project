const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

describe('User visits an item\'s page', () => {

    it('displays the created item\'s description', () => {
      //setup
      const itemToCreate = buildItemObject();
      browser.url('/items/create');
      browser.setValue('#title-input', itemToCreate.title);
      browser.setValue('#description-input', itemToCreate.description);
      browser.setValue('#imageUrl-input', itemToCreate.imageUrl);
      browser.click('#submit-button');

      //exercise
      browser.click('.item-card a');

      //verify
      assert.include(browser.getText('body'), itemToCreate.description );

    });

    describe('can navigate', () => {

      it('back to root', () => {
        //setup
        const itemToCreate = buildItemObject();
        browser.url('/items/create');
        browser.setValue('#title-input', itemToCreate.title);
        browser.setValue('#description-input', itemToCreate.description);
        browser.setValue('#imageUrl-input', itemToCreate.imageUrl);
        browser.click('#submit-button');

        //exercise
        browser.click('.item-card a');

        //verify
        assert.isOk(browser.element('a[href="/"]'))
      });

      it('to update item page', () => {
        // SETUP
        const itemToCreate = buildItemObject();
        browser.url('/items/create');
        browser.setValue('#title-input', itemToCreate.title);
        browser.setValue('#description-input', itemToCreate.description);
        browser.setValue('#imageUrl-input', itemToCreate.imageUrl);
        browser.click('#submit-button');
        browser.click('.item-card a');

        // EXERCISE
        browser.click('a=Update');

        // VERIFY
        //check that the item's attributes are displayed on input fields
        assert.equal(browser.getValue('#title-input'), itemToCreate.title);
        assert.equal(browser.getValue('#description-input'), itemToCreate.description);
        assert.equal(browser.getValue('#imageUrl-input'), itemToCreate.imageUrl);
      });
    });
});
