var restify = require('restify');
var mongoose = require('mongoose');

var mongodbPort = process.env.PORT || 8888;
db = mongoose.connect('mongodb://localhost:27017/epam-api');
Schema = mongoose.Schema;

// Create a schema for our data
var ArticleSchema = new Schema({
  title: String,
  url: String,
  image: String,
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

  Article.find({}, null, {sort: {date: -1}}, function (err,data) {
    res.json(data);
  });
  return next();
});

server.get('/search/:s', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  console.log("search: " + req.params.s);

  if (req.params.s === undefined || req.params.s === '') {
    res.send(404);
    return next();
  }

  Article.find({title: new RegExp(req.params.s, 'i')}, null, {sort: {date: -1}}, function (err,data) {
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
  article.url = req.params.url;
  article.image = req.params.image;
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