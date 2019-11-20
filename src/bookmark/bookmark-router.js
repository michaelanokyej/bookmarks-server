const express = require("express");

const bookmarkRouter = express.Router();
const bodyParser = express.json();
const uuid = require("uuid/v4");
const logger = require("../logger");
const bookmarkList = require("../store");

bookmarkRouter
  .route("/bookmark")
  .get((req, res) => {
    res.send(bookmarkList);
  })
  .post(bodyParser, (req, res) => {
    const { title, url, rating, desc } = req.body;

    // validate that title, url, rating and desc exist.
    if (!title) {
      logger.error(`Title is required`);
      return res.status(400).send("Invalid data");
    }

    if (!url) {
      logger.error(`Url is required`);
      return res.status(400).send("Invalid data");
    }

    if (!rating || rating < 1) {
      logger.error(`Rating is required`);
      return res.status(400).send("Invalid data");
    }

    if (!desc) {
      logger.error(`Description is required`);
      return res.status(400).send("Invalid data");
    }

    // If they do exist, then generate an ID
    // and push a bookmark object into the array.

    // get an id
    const id = uuid();

    const bookmark = {
      id,
      title,
      url,
      rating,
      desc
    };
    bookmarkList.push(bookmark);

    // Finally, log the bookmark creation and
    // send a response including a location header.

    logger.info(`bookmark with id ${id} created`);

    res
      .status(201)
      .location(`http://localhost:8000/bookmark/${id}`)
      .json(bookmarkList);
  });

bookmarkRouter
  .route("/bookmark/:id")
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = bookmarkList.find(c => c.id == id);

    // make sure we found a bookmark
    if (!bookmark) {
      logger.error(`bookmark with id ${id} not found.`);
      return res.status(404).send("bookmark Not Found");
    }

    res.json(bookmark);
  })
  .delete((req, res) => {
    const { id } = req.params;

    const bookmarkIndex = bookmarkList.findIndex(c => c.id == id);

    if (bookmarkIndex === -1) {
      logger.error(`bookmark with id ${id} not found.`);
      return res.status(404).send("Not found");
    }

    bookmarkList.splice(bookmarkIndex, 1);

    logger.info(`bookmark with id ${id} deleted.`);

    res.status(204).end();
  });

module.exports = bookmarkRouter;
