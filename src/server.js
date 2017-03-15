'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();
const csv = require('csv-parser');
const fs = require('fs');
const JWT = require('jsonwebtoken');
var employees = [];


server.connection({ port: 3000, host: 'localhost' });

var secret = "my-secret-key";
var people = [
    {
        id: 1,
        name: 'Jen Jones',
        username: 'jen',
        password: '123'
    }
];

server.register(require('hapi-auth-jwt2'), function (error) {

    if(error){
        console.log(error);
    }

    server.auth.strategy('jwt', 'jwt',
        {
            key: 'my-secret-key',
            validateFunc: (decoded, request, callback) => callback(null, true),
            verifyOptions: { algorithms: [ 'HS256' ] }
        }
    );

    server.auth.default('jwt');

    server.route([
        {
            method: "POST", path: "/login", config: { auth: false },
            handler: function(request, reply) {
                var payload = JSON.parse(request.payload);
                var username = payload.username;
                var password = payload.password;

                var user = people.filter(p => p.username === username && p.password === password);

                if(user.length !== 0) {
                    var token = JWT.sign(user[0], secret);
                    reply({text: token});
                } else {
                    reply({text: 'user and password invalid'});
                }
            }
        },
        {
            method: "GET", path: "/", config: { auth: false },
            handler: function(request, reply) {
                reply({text: 'Welcome'});
            }
        },
        {
            method: 'GET', path: '/restricted', config: { auth: 'jwt' },
            handler: function(request, reply) {
                reply({text: 'You used a Token!'})
                    .header("Authorization", request.headers.authorization);
            }
        },
        {
            method: 'GET', path: '/{name}', config: { auth: false },
            handler: (req, reply) => {
                var selected = employees.filter(employee => {
                    return encodeURIComponent(req.params.name) === employee.first_name;
                });
                reply(selected);
            }
        }
    ]);
});


fs.createReadStream('data/employees.csv')
        .pipe(csv())
        .on('data', function (data) {
           employees.push(data);
        })


server.start((error) => {
    if (error) {
        throw error;
    }
    console.log(`Server running at: ${server.info.uri}`);
});