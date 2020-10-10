const express = require('express');
const { v4: uuid_v4 } = require('uuid');

const app = express();

app.use(express.json());

// http://localhost:3333/project?title=Node&owner=Charles

const projects = [];

function logRoutes(request, response, next) {

    const { method, url } = request;

    const route = `[${method.toUpperCase()}] ${url}`;

    console.log(route);

    return next();
}

//app.use(logRoutes);

app.get('/projects', logRoutes, (request, response) => {

    // const query = request.query;

    const { title } = request.query;

    const results = title
        ? projects.filter(project => project.title.includes(title))
        : projects;

    return response.json(results);
});

app.post('/projects', (request, response) => {

    const { title, owner } = request.body;

    const id = uuid_v4();

    const project = {
        id,
        title,
        owner
    };

    projects.push(project);

    return response.json(project);   
});

app.put('/projects/:id', (request, response) => {

    // app.put('/projects/:id/owner/:owner_id', (request, response) => { ## 2 ou mais parâmetros

    // const { id } = request.params;

    // console.log(id);

    const { id } = request.params;

    const { title, owner } = request.body;

    const projectIndex = projects.findIndex(project => project.id == id);

    if(projectIndex < 0) {
        return response.status(400).json({ error: 'Project not found.' });
    }

    const project = {
        id,
        title,
        owner
    };

    projects[projectIndex] = project;

    return response.json(project);   
});

app.delete('/projects/:id', (request, response) => {

    const { id } = request.params;

    const projectIndex = projects.findIndex(project => project.id == id);

    if(projectIndex < 0) {
        return response.status(400).json({ error: 'Project not found.' });
    }

    projects.splice(projectIndex, 1);

    return response.status(204).json([]);   
});

app.listen(3333, () => {
    console.log('Backend started!');
});