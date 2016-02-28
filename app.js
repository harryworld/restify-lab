var restify = require('restify');
var mongoose = require('mongoose');

var mongodbPort = process.env.PORT || 8888;
db = mongoose.connect('mongodb://localhost:27017/epam-api');
Schema = mongoose.Schema;

// Create a schema for our data
var ArticleSchema = new Schema({
  title: String,
  date: Date
});

// Use the schema to register a model
mongoose.model('Article', ArticleSchema);
var Article = mongoose.model('Article');

var server = restify.createServer({
  name: 'restify-lab',
  version: '0.0.0'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/articles', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  console.log("mongodbServer getArticles");

  Article.find(function (err,data) {
    res.json(data);
  });
  return next();
});

server.post('/articles', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  console.log("mongodbServer postArticle: " + req.params.title);

  var article = Article();
  article.title = req.params.title;
  article.date = new Date()
  article.save(function () {
    res.send(201, {article: 'Article created'});
  });
});

server.get('/echo/:name', function (req, res, next) {
  res.send(req.params);
  return next();
});

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});