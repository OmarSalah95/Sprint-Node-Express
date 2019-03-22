const server = require('express')()

const projectsRouter = require('./data/Routers/projectsRouter')
const actionsRouter = require('./data/Routers/actionsRouter')

server.use(require('express').json())
server.use('/api/projects', projectsRouter)
server.use('/api/actions', actionsRouter)

server.get('/', (req, res) => {
    // Sanity Check
    res.send(`Server Home directory active.`);
  });
  
  module.exports = server;