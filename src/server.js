'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();
const csv = require('csv-parser');
const fs = require('fs');
var employees;


server.connection({ port: 3000, host: 'localhost' });

 fs.createReadStream('../hapijs-endpoint-api/data/employees.csv')
        .pipe(csv())
        .on('data', function (data) {
           employees = data;
            console.log(employees);
        })


server.route({
    method: 'GET',
    path: '/',
    handler: (req, reply) => {
        reply(employees);
    }
});

server.route({
    method: 'GET',
    path: '/{name}',
    handler: (req, reply) => {
         var selected = employees.filter(employee => {
             return encodeURIComponent(req.params.name) === exployee.first_name;
         });
         reply(selected);
    }
});

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});