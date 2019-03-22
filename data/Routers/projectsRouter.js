const projectsRouter = require('express').Router()
const db = require('../helpers/projectModel.js')

// Returns an array of project objects upon get request.
projectsRouter.get('/', (req, res) => {
    db.get()
      .then(projects => {
        res.status(201).json(projects);
      })
      .catch(err => {
        res.status(500).json({ message: `Failed To Get projects \n ${err} \n` });
      });
});
// Returns a single project object
projectsRouter.get('/:id', async (req, res) => {
    try{
        const project = await db.get(req.params.id)
        project
            ? res.status(200).json(project) 
            : res.status(404).json({message: "Can NOT find user"})
        
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: `Failed To Get projects  ${err} ` });
    }
});
// Deletes a projects from the DB and returns count of deleted items
projectsRouter.delete('/:id', (req, res) => {
    db.get(req.params.id)
      .then(project => {
        project
          ?  db.remove(project.id).then(remCount => {res.status(200).json(`removed ${project}`, remCount)})
          :  res.status(404).json({ message: `Failed To find that project  ${err} ` });
      })
      .catch(err => {
        res.status(500).json({ message: `Failed to remove project.  ${err}` });
      });
});
// Add a new project to the Db and Returns the new DB resource
projectsRouter.post('/', (req, res) => {
    const newProject = req.body;
    req.body.name && req.body.description
        ? db.insert(newProject)
            .then(dbPost => {res.status(201).json(dbPost)})
            .catch(err => {res.status(400).json({ message: 'Failed to add Post' })})
        : res.status(500).json({Message: 'Please provide a name and description to the project.'});
});

module.exports = projectsRouter