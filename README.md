# test_de_connaissance

TER: vincent.berry_1_2021-22 - App web proposant des jeux de type test de connaissance

Deployed online :  
https://test-connaissance.herokuapp.com/  

Lanch project on localhost:1337 :  
`sails lift`  
`node app.js`  

Generate api (controller and model) :  
`sails generate api <name>`  
Sails will generate the file api/controllers/NameController.js along with a matching model.  

Generate model :  
`sails generate model <modelName>`  

Generate controller :  
`sails generate controller <controllerName>`

Generating standalone actions :  
`sails generate action user/signup`  
Sails will create api/controllers/user/sign-up.js  

Generate helper :  
`sails generate helper <name>`  

DOCKER  
Build and run local image :   
`docker build -t dockerhub_username/appname:latest .`  
`docker run -p 8000:1337 imageID`  
=> app run on localhost:8000(use whichever) on local browser. (port 1337 can't be accessed from outside, -p port forwarding from docker container to local machine)  

Deploy to Heroku Container Registry :  
install heroku cli  
$ heroku login  
$ heroku container:login  
$ heroku create app_name  
$ heroku container:push web  
$ heroku container:release web  
$ heroku open => https://test-connaissance.herokuapp.com/  

Gitlab register runner (macOs) :  
1. Install Gitlab Runner
`brew install gitlab-runner`
2. Install Gitlab Runner as a service and start it
`brew services start gitlab-runner`
3. register a runner
`gitlab-runner register`
4. check runner
`gitlab-runner list`


