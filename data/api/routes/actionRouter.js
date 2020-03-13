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
    console.log(`router post ${req.body}`);
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

router;

router
  .route("/:id")
  .get(validateActionID, (req, res) => {
    res.status(200).json(req.action);
  })
  .delete(validateActionID, async (req, res) => {
    const action = Actions.remove(req.params.id)
      .then((removed) => {
        res.status(200).json(removed);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: "The action could not be removed" });
      });
  });

router.put("/:id", validateActionID, validateAction, (req, res) => {
  Actions.update(req.params.id, req.body)
    .then((action) => {
      res.status(200).json(action);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Action cannot be updated" });
    });
});

function validateAction(req, res, next) {
  console.log(
    `middleware validate action ${req.body.project_id} ${req.body.description} ${req.body.notes}`
  );
  if (!req.body.project_id || !req.body.description || !req.body.notes) {
    res.status(400).json({
      message: "Action does not have a description or an associated project ID"
    });
  } else {
    next();
  }
}

function validateActionID(req, res, next) {
  Actions.get(req.params.id)
    .then((action) => {
      action
        ? (req.action = action) & next()
        : res.status(400).json({ message: "Error retrieving the action" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Error retrieving the action" });
    });
}
