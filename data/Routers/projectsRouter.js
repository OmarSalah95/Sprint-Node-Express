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
            : res.status(404).json({message: "Can NOT find project"})
        
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: `Failed To Get projects  ${err} ` });
    }
});
// Return all Project actions
projectsRouter.get('/:id/actions', async (req, res) => {
    try{
        const project = await db.get(req.params.id)
        project
            ? res.status(200).json(project.actions) 
            : res.status(404).json({message: "Can NOT find project"})
        
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
          ?  db.remove(project.id)
            .then(remCount => {res.status(200).json(`removed ${project}`, remCount)})
            .catch(err => { res.status(404).json({ message: `Failed To delete that project  ${err} ` }) } )
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
            .catch(err => {res.status(400).json({ message: `Failed to projects  ${err}` })})
        : res.status(500).json({Message: 'Please provide a name and description to the project.'});
});
// Updates a project in the DB and Returns the number 1 if Successful
projectsRouter.put('/:id', (req, res) => {
    const { name, description } = req.body;

    db.get(req.params.id)
        .then(project => {
            project
              ? name && description
                    ?  db.update(req.params.id, req.body)
                        .then(project => {res.status(200).json(project)})
                        .catch(err =>{})
                    : res.status(404).json({message: 'Please provide a project to update'})
            : res.status(404).json({ message: "That project doesn't exist" });
        })
        .catch(err => {
            res.status(500).json({ message: 'Failed to update project' });
        });
});
module.exports = projectsRouter