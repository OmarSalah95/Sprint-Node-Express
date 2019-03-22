const actionsRouter = require('express').Router()
const actionDb = require('../helpers/actionModel')
const projectDb = require('../helpers/projectModel')
// Returns an array of action objects upon get request.
actionsRouter.get('/', (req, res) => {
    actionDb.get()
      .then(actions => {
        res.status(201).json(actions);
      })
      .catch(err => {
        res.status(500).json({ message: `Failed To Get actions \n ${err} \n` });
      });
});
// Returns a single action object
actionsRouter.get('/:id', async (req, res) => {
    try{
        const action = await actionDb.get(req.params.id)
        action
            ? res.status(200).json(action) 
            : res.status(404).json({message: "Can NOT find user"})
        
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: `Failed To Get actions  ${err} ` });
    }
});
// Deletes a actions from the actionDb and returns count of deleted items
actionsRouter.delete('/:id', (req, res) => {
    actionDb.get(req.params.id)
      .then(action => {
        action
          ?  actionDb.remove(action.id)
                .then(remCount => {res.status(200).json(`removed ${action}`, remCount)})
                .catch(err => { res.status(404).json({ message: `Failed To delete that action  ${err} ` }) } )
          :  res.status(404).json({ message: `Failed To find that action  ${err} ` });
      })
      .catch(err => {
        res.status(500).json({ message: `Failed to remove action.  ${err}` });
      });
});
// Add a new action to the actionDb and Returns the new actionDb resource
actionsRouter.post('/', (req, res) => {
    const newAction = {...req.body}
    newAction.project_id && newAction.description && newAction.notes
        ? projectDb.get(newAction.project_id)
            .then(actionDb.insert(newAction)
                .then(dbAction => {res.status(201).json(dbAction)})
                .catch(err => {res.status(400).json({ message: `Failed to add actions  ${err}` })})
            ).catch(err => {res.status(404).json({message: `${err}`})})
        : res.status(500).json({Message: 'Please provide a project id, description, and notes to the action.'})
});
// Updates a action in the DB and Returns the number 1 if Successful
actionsRouter.put('/:id', (req, res) => {
    const changedAction = {...req.body}
    changedAction.description || changedAction.notes
        ? actionDb.get(req.params.id)
            .then(dbAction => {
                actionDb.update(dbAction.id, changedAction)
                    .then(dbUpdatedAction => res.status(200).json(dbUpdatedAction))
                    .catch(err => res.status(500).json({message: `Failed to updated  ${err}`}))
            })
            .catch(err => res.status(404).json({message: `That action doesn't exist  ${err}`}))
        : res.status(500).json({message: `Please enter updates to either the action description or notes`})
})






// actionsRouter.put('/:id', (req, res) => {
//     const { name, description } = req.body;

//     actionDb.get(req.params.id)
//         .then(action => {
//             action
//               ? name && description
//                     ?  actionDb.update(req.params.id, req.body)
//                         .then(action => {res.status(200).json(action)})
//                         .catch(err =>{})
//                     : res.status(404).json({message: 'Please provide a action to update'})
//             : res.status(404).json({ message: "That action doesn't exist" });
//         })
//         .catch(err => {
//             res.status(500).json({ message: 'Failed to update action' });
//         });
// });
module.exports = actionsRouter