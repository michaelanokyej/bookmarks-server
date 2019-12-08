const express = require("express");

const bookmarkRouter = express.Router();
const bodyParser = express.json();
const uuid = require("uuid/v4");
const logger = require("../logger");
const BookmarkService = require("./bookmarks-service");

bookmarkRouter
  .route("/bookmarks")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    BookmarkService.getAllBookmarks(knexInstance)
      .then(bookmarks => {
        res.json(bookmarks);
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const knexInstance = req.app.get("db");
    const { title, url_name, rating, url_desc } = req.body;

    // validate that title, url, rating and desc exist.
    if (!title) {
      logger.error(`Title is required`);
      return res.status(400).send("Invalid data");
    }

    if (!url_name) {
      logger.error(`Url is required`);
      return res.status(400).send("Invalid data");
    }

    if (!rating || rating < 1) {
      logger.error(`Rating is required`);
      return res.status(400).send("Invalid data");
    }

    // const newbookmark = {
    //   title,
    //   url_name,
    //   rating,
    //   url_desc
    // };

    // Spreading the request body so i dont have to explicitly state what is to be inserted
    const newbookmark = {
      ...req.body
    }

    BookmarkService.insertBookmark(knexInstance, newbookmark)
      .then(bookmark => {
        res
          .status(201)
          .location(`http://localhost:8000/bookmark/${bookmark.id}`)
          .json(bookmark);
        logger.info(`bookmark with id ${bookmark.id} created`);
      })
      .catch(next);
  });

bookmarkRouter
  .route("/bookmarks/:bookmark_id")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    const id = req.params.bookmark_id;
    BookmarkService.getById(knexInstance, id)
      .then(bookmark => {
        if (!bookmark) {
          return res.status(404).json({
            error: { message: `bookmark doesn't exist` }
          });
        }
        res.json(bookmark);
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    const id = req.params.bookmark_id;
    const newBookmarkFields = {
      ...req.body
    }
    const knexInstance = req.app.get("db");
    BookmarkService.getById(knexInstance, id)
      .then(bookmark => {
        if (!bookmark) {
          return res.status(404).json({
            error: { message: `bookmark doesn't exist` }
          });
        }
        return bookmark;
      })
      .then(bookmark => {
        const id = bookmark.id;
        BookmarkService.updateBookmark(knexInstance, id, newBookmarkFields).then(res =>
          console.log('updated', res)
        );
      })
      .catch(next);


    logger.info(`bookmark with id ${id} was updated.`);

    res
    .json(newBookmarkFields)
    .status(204).end();
  })
  .delete((req, res, next) => {
    const id = req.params.bookmark_id;
    const knexInstance = req.app.get("db");
    BookmarkService.getById(knexInstance, id)
      .then(bookmark => {
        if (!bookmark) {
          return res.status(404).json({
            error: { message: `bookmark doesn't exist` }
          });
        }
        return bookmark;
      })
      .then(bookmark => {
        console.log("bookmark", bookmark);
        const id = bookmark.id;
        BookmarkService.deleteBookmark(knexInstance, id).then(res =>
          console.log("resonse", res)
        );
      })
      .catch(next);


    logger.info(`bookmark with id ${id} deleted.`);

    res.status(204).end();
  });

module.exports = bookmarkRouter;
