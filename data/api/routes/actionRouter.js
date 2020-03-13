const express = require("express");

const Actions = require("../../helpers/actionModel");
const router = express.Router();

router
  .route("/")
  .get(async (req, res) => {
    try {
      const actions = await Actions.get();
      res.status(200).json(actions);
    } catch {
      console.log(err);
      res.status(500).json({ message: "Error retrieving the actions" });
    }
  })
  .post(validateAction, async (req, res) => {
    try {
      const action = await Actions.insert(req.body);
      res.status(201).json(action);
    } catch {
      console.log(err);
      res.status(500).json({
        message: "There was an error while saving this action to the database"
      });
    }
  });

router
  .route("/:id")
  .get(validateActionID, (req, res) => {
    res.status(200).json(req.action);
  })
  .delete(validateActionID, async (req, res) => {
    try {
      const removed = await Actions.remove(req.params.id);
      res.status(200).json(removed);
    } catch {
      console.log(err);
      res.status(500).json({ message: "The action could not be removed" });
    }
  })

  .put(validateActionID, validateAction, async (req, res) => {
    try {
      const action = await Actions.update(req.params.id, req.body);
      res.status(200).json(action);
    } catch {
      console.log(err);
      res.status(500).json({ message: "Action cannot be updated" });
    }
  });

function validateAction(req, res, next) {
  if (!req.body.project_id || !req.body.description || !req.body.notes) {
    res.status(400).json({
      message: "Action does not have a description or an associated project ID"
    });
  } else {
    next();
  }
}

async function validateActionID(req, res, next) {
  try {
    const action = await Actions.get(req.params.id);
    action
      ? (req.action = action) & next()
      : res.status(400).json({ message: "Error retrieving the action" });
  } catch {
    console.log(err);
    res.status(500).json({ message: "Error retrieving the action" });
  }
}

module.exports = router;
