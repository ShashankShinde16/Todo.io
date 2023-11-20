const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
require('dotenv').config();


mongoose.connect("mongodb+srv://Shashank:eTbde3gyFfqrInIy@cluster0.eycqmnc.mongodb.net/todoDB");

const todoSchema = new mongoose.Schema({
    item: String
})

const Todo = new mongoose.model("Todo", todoSchema);

const app = express();

app.use(express.static('public'));

// set ejs engine
app.set("view engine", 'ejs');

app.use(bodyParser.urlencoded({ extended:true}));

app.get("/", (req,res)=>{
    const date = new Date();
    const option = {
        month: "long",
        weekday: "long",
        day:"numeric",
        year:"numeric"
    }
    let today = date.toLocaleDateString("hi-IN",option);

    const findTodo = async ()=>{
        const list = await Todo.find().maxTimeMS(30000);
        res.render("temp", {listName:today, newItem: list});
    }

    findTodo()
})

app.post("/", (req,res)=>{
    const todo = new Todo({
        item: req.body.item
    });
    todo.save();
    res.redirect("/");
})

app.post("/delete/newList", (req,res)=>{
    const newList = async ()=>{
        await Todo.deleteMany({__v: 0}).maxTimeMS(30000);
    }
    newList()
    res.redirect("/");
})

app.listen(process.env.PORT , function(){
    console.log(`server is running on port ${process.env.PORT}`);
})