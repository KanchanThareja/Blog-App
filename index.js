var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    expressSanitizer = require('express-sanitizer'),
    methodOverride = require("method-override"),
    mongoose = require('mongoose');
    
mongoose.connect("mongodb://localhost/blog-app");
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"))

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now} 
});

var Blog = mongoose.model("Blog", blogSchema);
app.get('/', function(req, res){
    res.redirect('/blogs'); 
});

app.get('/blogs', function(req, res){
    Blog.find({}, function(err, blogs){
        if(err)
        console.log(err);
        else
        res.render("index", {blogs: blogs}); 
    });
});

app.get('/blogs/new', function(req, res){
   res.render("new"); 
});

app.post('/blogs', function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newblog){
       if(err)
       res.render('/blogs/new');
       else
       res.redirect('/blogs');
    });
});

app.get('/blogs/:id', function(req, res){
   Blog.findById(req.params.id, function(err, foundblog){
       if(err)
       res.redirect("/blogs");
       else
       res.render("show", {blog: foundblog});
   });
});

app.get('/blogs/:id/edit', function(req, res){
    Blog.findById(req.params.id, function(err, foundblog){
        if(err)
        res.redirect("/");
        else
        res.render("edit", {blog: foundblog});
    });
});

app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedblog){
       if(err)
       res.redirect("/blogs");
       else
       res.redirect("/blogs/" + req.params.id);
   });
});

app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err)
        res.redirect("blogs");
        else
         res.redirect("blogs");
    });
});

// Blog.create({
//   title: "Danis",
//   image: "https://images.theconversation.com/files/205966/original/file-20180212-58348-7huv6f.jpeg?ixlib=rb-1.1.0&q=45&auto=format&w=926&fit=clip",
//   body: "He runs arounds gathering happiness for me now that he says hello world"
// });

app.listen(process.env.PORT, process.env.IP);