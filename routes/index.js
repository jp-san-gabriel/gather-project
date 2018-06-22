const router = require('express').Router();

const Item = require('../models/item');

const {log} = require('../test/test-utils');

router.get('/', async (req, res, next) => {
  const items = await Item.find({});
  res.render('index', {items});
});

router.get('/items/create', async (req, res, next) => {
  res.render('create');
});

router.post('/items/create', async (req, res, next) => {
  const {title, description, imageUrl} = req.body;
  const newItem = new Item({title, description, imageUrl});
  newItem.validateSync();
  if (newItem.errors) {
    res.status(400).render('create', {newItem: newItem});
  } else {
    await newItem.save();
    res.redirect('/');
  }

});


//Handles requests to view a single item
router.get('/items/:id', async (req, res, next) => {
  const id = req.params.id;

  //create a callback function
  const callback = (err, item) => {
    if(err || !item) {
      res.sendStatus(404);
    } else {
      res.status(200).render('single', {item});
    }
  }

  //try getting the item from the database. Catch cast errors.
  try {
    await Item.findById(id, callback);
  } catch(err) {
  }
});


//Handles requests to delete an item
router.post('/items/:id/delete', async (req, res, next) => {
  const _id = req.params.id;

  //create a callback function which redirects to '/' when successful
  //and sends 404 when there is an error
  const callback = (err) => {
    if(err) {
      res.sendStatus(404);
    } else {
      res.redirect(303, '/');
    }
  };

  //try deleting the item with the specified id. Catch cast errors.
  try {
    await Item.deleteOne({_id}, callback);
  } catch(error) {
  }
});

//Handles requests to display an item for updating
router.get('/items/:id/update', async (req, res, next) => {
  const id = req.params.id;

  const callback = (err, item) => {
    if(err || !item) {
      res.sendStatus(404);
    } else {
      res.status(200).render('create', {newItem:item});
    }
  };
  //get the item from the database
  try {
    await Item.findById(id, callback);
  } catch(error) {}
});


//Handles requests to update an item
router.post('/items/:id/update', async (req, res, next) => {
  const _id = req.params.id;
  const {title, description, imageUrl} = req.body;

  const callback = (err) => {
    if(err) {
      res.sendStatus(404);
    } else {
      res.redirect(`/items/${_id}`);
    }
  };

  //try updating item in the database. Catch other errors.
  try {
    await Item.updateOne({_id}, {_id, title, description, imageUrl}, callback);
  } catch(error) {}
});

module.exports = router;
