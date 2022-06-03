//mongodb://localhost:27017
//Create a server that can send back static files
const http = require("http");
const url = require("url");
const fs = require("fs");
const mongoose = require("mongoose");
const RSS = require("rss");


var SignUpUser = require("./controllers/SignUpController");
var LoginUser = require("./controllers/LoginController");
var TaskUser = require("./controllers/TaskController");
var Users = require("./controllers/UsersController");
var Plants = require("./controllers/PlantsController");
var Questions = require("./controllers/QuestionsController")
var Course = require("./controllers/CoursesController");
const User = require("./models/User");

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

//var ejs = require('ejs');

mongoose.connect('mongodb://0.0.0.0:27017/eGardening');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

var blog = {
  title: "eGardening",
  description: "eGardening is a teaching website where one can find information about all kind of plants, sorted by their level of difficulty, tips and tricks and can ask questions",
  author: "Carausu Ana-Madalina and Haiura Andreea-Isabela",
  rankings_beginner: [{
      author: "",
      description: "First place",
      score: "",
      title:"First place",
      categories: ['Beginner'],
  }, {
      author: "",
      description: "Second place",
      score: "",
      title:"Second place",
      categories: ['Beginner'],
  }, {
      author: "",
      description: "Third place",
      score: "",
      title:"Third place",
      categories: ['Beginner'],
  }],

  rankings_intermediate: [{
    author: "",
    description: "First place",
    score: "",
    title:"First place",
    categories: ['Intermediate'],
}, {
    author: "",
    description: "Second place",
    score: "",
    title:"Second place",
    categories: ['Intermediate'],
}, {
    author: "",
    description: "Third place",
    score: "",
    title:"Third place",
    categories: ['Intermediate'],
}],

rankings_advanced: [{
  author: "",
  description: "First place",
  score: "",
  title:"First place",
  categories: ['Advanced'],
}, {
  author: "",
  description: "Second place",
  score: "",
  title:"Second place",
  categories: ['Advanced'],
}, {
  author: "",
  description: "Third place",
  score: "",
  title:"Third place",
  categories: ['Advanced'],
}]
};

updateXML();

var response="";
var response2="";
var username="";
var login=0;
var admin=0;

const server = http.createServer((req, res) => {
  let parsedURL = url.parse(req.url, true);

  let path = parsedURL.path.replace(/^\/+|\/+$/g, "");
  //console.log("cookie",req.headers.cookie)
  
  if(login==0){
    if (path == "") {
      path = "Proiect.html";
    }
  }
  else{
    if (path == "") {
      path = "Proiect_MyProfile.html";
    }
    else
      if (path == "Proiect.html") {
        path = "Proiect_MyProfile.html";
      }
  }
  

  let file = __dirname + "/views/" + path;

  if(path=="extractCSV"&& req.method=="POST"){
    Users.extractAllUsers(req, res)
  }
  else
  if(path.substring(0, 7)=="ranking"&&req.method=="GET"){
    const level=path.substring(7, path.length);
    Users.getFirstThreeUsers(req, res, level);
  }
  else
  if(path.substring(0, 6)=="plant_"&&req.method=="POST"){
    
    var body = '';
    var image=path.substring(6, path.length);
    req.on('data', function (data) {
        body += data;
        if (body.length > 1e6)
            request.close();
    });
    
    req.on('end', async function () {
      await Users.addTasksForPlants(body, res, image, username)
    })
  }
  else
  if(path.substring(0, 6)=="Plants"){
    Plants.plantsForSpecificLevel(path, res)
  }
  else
  if(path.slice(-9)=="get_login")
  {
    const objectToSend = {"response": login, "username":username};
    const jsonContent = JSON.stringify(objectToSend);
    res.end(jsonContent);

  }
  else
  if(path.slice(-9)=="get_admin")
  {
    const objectToSend = {"response": admin};
    const jsonContent = JSON.stringify(objectToSend);
    res.end(jsonContent);
  }
  else
  if(path.slice(-26)=="username-database-response"){
    Users.findUserByName(username, res)
  }
  else
  if(path=="Advanced-response"){
    Course.allCoursesFromAdvanced(res)
  }
  else
  if(path=="Intermediate-response"){
    Course.allCoursesFromIntermediate(res)
  }
  else
  if(path=="Beginner-response")
  {
    Course.allCoursesFromBeginner(res)
  }
  else
  if(path.substring(0,8) == "Beginner" && req.method=="POST") {
    var number = Number(path.substring(8, path.length));
    Course.specificDynamicCourseFromBeginner(res, number)
  }
  else
  if(path.substring(0,12) == "Intermediate" && req.method=="POST") {
    var number = Number(path.substring(12, path.length));
    Course.specificDynamicCourseFromIntermediate(res, number)
  }
  else
  if(path.substring(0,8) == "Advanced" && req.method=="POST") {
    var number = Number(path.substring(8, path.length));
    Course.specificDynamicCourseFromAdvanced(res, number)
  }
  else
  if(path=="get_questions" && req.method=="GET"){
    Questions.getNotAnsweredQuestions(res);
  }
  else
  if(path=="get_questions_and_answers" && req.method=="GET"){
    Questions.getQuestions(res);
  }
  else
  if(path=="login_popup" && req.method=="POST"){
    console.log("cookie",req.headers.cookie)
    path="Proiect.html";
    file = __dirname + "/views/" + path;  
    var body = '';                       
    req.on('data', function (data) {
    body += data;
    if (body.length > 1e6)
      req.close();
    });

    req.on('end', async function (){
      await LoginUser.loginUser(body, res)
      login=Number(localStorage.getItem("login"));
      admin=Number(localStorage.getItem("admin"));
      username=localStorage.getItem("username");
      response=localStorage.getItem("responseFromLogin")
    })
  }
  else
  if(path=="login_popup" && req.method=="GET"){
      if(response!=""){
        const objectToSend = {"response": response, "username":username};
        response="";
        const jsonContent = JSON.stringify(objectToSend);
        res.end(jsonContent);
      }
  }
  else
  if(path=="signup_popup" && req.method=="POST"){
    path="Proiect.html";
    file = __dirname + "/" + path;
    var body = '';
    req.on('data', function (data) {
        body += data;
        if (body.length > 1e6)
            request.close();
    });

    req.on('end', async function () {
      await SignUpUser(body, res)
      response2=localStorage.getItem("responseFromSignUp");
      console.log(response2)
    });
  }
  else
  if(path=="signup_popup" && req.method=="GET"){
      if(response2!=""){
        const objectToSend = {"response": response2}
        response2="";
        const jsonContent = JSON.stringify(objectToSend);
        res.end(jsonContent);  
      }
  }
  else
  if(path=="logout" && req.method=="POST"){
      response="";
      response2="";
      admin = 0;
      username="";
      login=0;
      res.writeHead(302, { "Location": "http://" + 'localhost:1234' });
      res.end("success");
  }
  else
  if(path.substring(0,4)=="task" && req.method=="POST"){
    const taskText=path;
    if(path.substring(0,5)=="task1")
      path="Beginner.html";
    else
      if(path.substring(0,5)=="task2")
        path="Intermediate.html";
      else
        path="Advanced.html";
    file = __dirname + "/views/" + path;
    var body = '';
    req.on('data', function (data) {
        body += data;
        if (body.length > 1e6)
            request.close();
    });
   
    req.on('end', async function () {
      await TaskUser(body, taskText, username, res)
    });

    res.writeHead(302, { "Location": "http://localhost:1234/"+path });
    res.end(response);
  }
  else
  if(path == "form_questions" && req.method=="POST" ) {
    var body = '';

    if(username != "") {

      req.on('data', function (data) {
          body += data;
          if (body.length > 1e6)
              request.close();
      });

      req.on('end', async function () {
        await Questions.addQuestion(body, res, username)
      })
      
    }
    else
    {
      response2="The user is not logged in";
      console.log(response2);
      res.writeHead(302, { "Location": "http://" + 'localhost:1234/QA.html' });
      res.end(response2);
    }
  }
  else
  if(path == "form_add_course" && req.method=="POST" ) {
    Course.addDynamicCourse(req, res, __dirname)
  }
  else
  if(path == "form_add_plant" && req.method=="POST" ) {
    Plants.addDynamicPlant(req, res, __dirname)
  }
  else
  if(path == "form_answer_question" && req.method=="POST" ) {
    
    var body = '';

    req.on('data', function (data) {
        body += data;
        if (body.length > 1e6)
            request.close();
    });

    req.on('end', async function () {
      await Questions.answerTheQuestion(body, res)
    });
  }
  else{
  fs.readFile(file, function(err, content) {
    if (err) {
      console.log(`File Not Found ${file}`);
      res.writeHead(404);
      res.end();
    } else {
      res.setHeader("X-Content-Type-Options", "nosniff");
        switch (path.slice(-3)) {
        case "tml":
          res.writeHead(200, { "Content-type": ["text/html"] });  break;
        case "css":
          res.writeHead(200, { "Content-type": ["text/css"] });  break;
        case ".js":
          res.writeHead(200, { "Content-type": ["application/javascript"] });  break;
      }
      res.end(content);
    }
    });
  } 
  
});

async function updateXML() {
  var result = await Users.returnAllUsers()
      if(result!=null){
        var name1="", name2="", name3="";
        var points1=0, points2=0, points3=0;
        for(let i=0;i<result.length;i++){
            var value=0;
            for(let j=0;j<result[i].tasks.length;j++){
                if(result[i].tasks[j].task.substring(0, 5)=="task1")
                    value=value+Number(result[i].tasks[j].value);
            }
            if(value!=0){
                value=((value*100)/(4*result.length)).toFixed(2);
                if(value>=points1){
                    points3=points2;
                    name3=name2;
                    points2=points1;
                    name2=name1;
                    points1=value;
                    name1=result[i].name;
                }
                else
                if(value>=points2){
                    points3=points2;
                    name3=name2;
                    points2=value;
                    name2=result[i].name;
                }
                else
                if(value>=points3){
                    points3=value;
                    name3=result[i].name;
                }
            }
            
        }
        if(name1 == "") name1 = "there is no person on this place yet"
        if(name2 == "") name2 = "there is no person on this place yet"
        if(name3 == "") name3 = "there is no person on this place yet"


        blog.rankings_beginner[0].author = name1;
        blog.rankings_beginner[1].author = name2;
        blog.rankings_beginner[2].author = name3;

        blog.rankings_beginner[0].score = points1;
        blog.rankings_beginner[1].score = points2;
        blog.rankings_beginner[2].score = points3;

        name1="", name2="", name3="";
        points1=0, points2=0, points3=0;  

        for(let i=0;i<result.length;i++){
          var value=0;
          for(let j=0;j<result[i].tasks.length;j++){
              if(result[i].tasks[j].task.substring(0, 5)=="task2")
                  value=value+Number(result[i].tasks[j].value);
          }
          if(value!=0){
              value=((value*100)/(4*result.length)).toFixed(2);
              if(value>=points1){
                  points3=points2;
                  name3=name2;
                  points2=points1;
                  name2=name1;
                  points1=value;
                  name1=result[i].name;
              }
              else
              if(value>=points2){
                  points3=points2;
                  name3=name2;
                  points2=value;
                  name2=result[i].name;
              }
              else
              if(value>=points3){
                  points3=value;
                  name3=result[i].name;
              }
          }
          
        }
        if(name1 == "") name1 = "there is no person on this place yet"
        if(name2 == "") name2 = "there is no person on this place yet"
        if(name3 == "") name3 = "there is no person on this place yet"

        blog.rankings_intermediate[0].author = name1;
        blog.rankings_intermediate[1].author = name2;
        blog.rankings_intermediate[2].author = name3;

        blog.rankings_intermediate[0].score = points1;
        blog.rankings_intermediate[1].score = points2;
        blog.rankings_intermediate[2].score = points3;

        name1="", name2="", name3="";
        points1=0, points2=0, points3=0; 

        for(let i=0;i<result.length;i++){
          var value=0;
          for(let j=0;j<result[i].tasks.length;j++){
              if(result[i].tasks[j].task.substring(0, 5)=="task3")
                  value=value+Number(result[i].tasks[j].value);
          }
          if(value!=0){
            value=((value*100)/(4*result.length)).toFixed(2);
            if(value>=points1){
                points3=points2;
                name3=name2;
                points2=points1;
                name2=name1;
                points1=value;
                name1=result[i].name;
            }
            else
            if(value>=points2){
                points3=points2;
                name3=name2;
                points2=value;
                name2=result[i].name;
            }
            else
            if(value>=points3){
                points3=value;
                name3=result[i].name;
            }
          }
          
        }  
        if(name1 == "") name1 = "there is no person on this place yet"
        if(name2 == "") name2 = "there is no person on this place yet"
        if(name3 == "") name3 = "there is no person on this place yet"

        blog.rankings_advanced[0].author = name1;
        blog.rankings_advanced[1].author = name2;
        blog.rankings_advanced[2].author = name3;

        blog.rankings_advanced[0].score = points1;
        blog.rankings_advanced[1].score = points2;
        blog.rankings_advanced[2].score = points3;
    }
    const feed = new RSS({
      title: blog.title,
      description: blog.description,
      author: blog.author,
      language: 'en',
      categories: ['Beginner','Intermediate','Advanced'],
      feed_url: 'localhost:1234/rss.xml',
      site_url: 'localhost:1234/Proiect.html',
      managingEditor: 'Carausu Ana-Madalina and Haiura Andreea-Isabela',
      webMaster: 'Carausu Ana-Madalina and Haiura Andreea-Isabela',
    });
    for (const ranking of blog.rankings_beginner) {
      feed.item({
          author: ranking.author,
          description: ranking.description,
          score: ranking.score,
          title: ranking.title,
          categories: ranking.categories
      });
    }
      for (const ranking of blog.rankings_intermediate) {
        feed.item({
            author: ranking.author,
            description: ranking.description,
            score: ranking.score,
            title: ranking.title,
            categories: ranking.categories
        });
      }
        for (const ranking of blog.rankings_advanced) {
          feed.item({
              author: ranking.author,
              description: ranking.description,
              score: ranking.score,
              title: ranking.title,
              categories: ranking.categories
          });
        }
      
    const xml = feed.xml({ indent: true });
    fs.writeFileSync("feed.xml", xml);
  
}


server.listen(1234, "localhost", () => {
  console.log("Listening on port 1234");
});
