const express = require("express");

const Projects = require("../../helpers/projectModel");
const router = express.Router();

router
  .route("/")
  .get(async (req, res) => {
    try {
      const projects = await Projects.get();
      res.status(200).json(projects);
    } catch {
      console.log(err);
      res.status(500).json({ message: "Error retrieving the projects" });
    }
  })
  .post(validateProject, async (req, res) => {
    try {
      const project = await Projects.insert(req.body);
      res.status(201).json(project);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "There was an error while saving this project to the database"
      });
    }
  });

router
  .route("/:id")
  .get(validateProjectID, (req, res) => {
    res.status(200).json(req.project);
  })
  .delete(validateProjectID, async (req, res) => {
    try {
      const removed = await Projects.remove(req.params.id);
      res.status(200).json(removed);
    } catch {
      console.log(err);
      res.status(500).json({ message: "The project could not be removed" });
    }
  })
  .put(validateProjectID, validateProject, async (req, res) => {
    try {
      const project = await Projects.update(req.params.id, req.body);
      res.status(200).json(project);
    } catch {
      console.log(err);
      res.status(500).json({ message: "Project cannot be updated" });
    }
  });

router.get("/:id/actions", validateProjectActionsID, (req, res) => {
  res.status(200).json(req.project);
});

router;

function validateProject(req, res, next) {
  console.log(
    `middleware validate project ${req.body.description} ${req.body.name}`
  );
  if (!req.body.description || !req.body.name) {
    res
      .status(400)
      .json({ message: "Project does not have a description or a name" });
  } else {
    next();
  }
}

async function validateProjectID(req, res, next) {
  try {
    const project = await Projects.get(req.params.id);
    project
      ? (req.project = project) & next()
      : res.status(400).json({ message: "Error retrieving the project" });
  } catch {
    console.log(err);
    res.status(500).json({ message: "Error retrieving the project" });
  }
}

async function validateProjectActionsID(req, res, next) {
  try {
    const project = await Projects.getProjectActions(req.params.id);
    project
      ? (req.project = project) & next()
      : res.status(400).json({ message: "Error retrieving the project" });
  } catch {
    console.log(err);
    res.status(500).json({ message: "Error retrieving the project" });
  }
}

module.exports = router;
