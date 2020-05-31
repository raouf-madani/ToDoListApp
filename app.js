//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const _=require("lodash");

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

//Connect our database
mongoose.connect("mongodb+srv://raoufy-todolist:unbeaten40@todolistcluster-qhorl.mongodb.net/todolistDB",{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify: false});

//Schema
const todolistSchema= new mongoose.Schema({
   name:String
});

//Model
const Item= mongoose.model("Item",todolistSchema);

//collection
const itemOne= new Item({
    name:"Welcome to your ToDoListApp"
});
const itemTwo= new Item({
    name:"Hit the + button to add new Item"
});
const itemThree= new Item({
    name:"Hit the checkbox to delete an Item"
});

//Array to store collections
const defaultItems=[itemOne,itemTwo,itemThree];

//list schema
const listSchema = {
    name:String,
    items:[todolistSchema]
};
//list model
const List = mongoose.model("List",listSchema);

//Insertion
/*Item.insertMany(defaultItems,err=>{
   if(err){
       console.log(err);
   }else{
       mongoose.connection.close();
       console.log("Insertion succeeded");
   }
  
});*/



app.get('/',(req,res)=>{
  
   //selection model==>render items from our db
   Item.find((err,items)=>{
    if(items.length === 0){
        //Insertion model
        Item.insertMany(defaultItems,err=>{
            if(err){
                console.log(err);
            }else{
                console.log("Insertion succeeded");
            }  
        });
        res.redirect('/');
    }else{
        res.render("list",{listTitle:"Today",newListItems:items});
    }   
   });
   
});

//Update an Item
/*Item.updateOne({_id:"5ed22f1072c2b70b347513af"},
                {name:"Hit the checkbox to delete an Item"},
                err=>{
                    if(err)
                    {console.log(err);}else{console.log("successfully updated")}
                });*/

app.post('/',(req,res)=>{
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item= new Item({
        name:itemName
    });

    if(listName === "Today"){
        item.save();
        res.redirect("/");
    }else{
        List.findOne({name:listName},(err,foundList)=>{
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName); 
        });
    }
      
});

app.post('/delete',(req,res) =>{
    const checkedItemID=req.body.checkbox;
    const listName= req.body.listName;
    //Check which list
    if(listName==="Today"){
        Item.deleteOne({_id:checkedItemID},err=>{
            if(!err){
                console.log("deleted successfully");
                res.redirect('/');
            }
        });
    }else{
       List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemID}}},(err,foundList)=>{
          if(!err){
              res.redirect('/'+listName);
          }
       });
    }
    
    /**
     * Another Method to remove Item
     * Item.findByIdAndRemove(checkedItemID,err=>{
        if(!err){
            console.log("deleted successfully");
            res.redirect('/');
        }
     * });
     */
});

app.get('/:customList',(req,res)=>{
    const customListName = _.capitalize(req.params.customList);

    List.findOne({name:customListName},(err,foundList)=>{
        if(!err){
            if(!foundList){
                //Create a new List
                const list = new List({
                    name:customListName,
                    items:defaultItems
                });
                list.save();
                res.redirect("/"+customListName);
            }else{
                //Show an existing list
                res.render("list",{listTitle:foundList.name,newListItems:foundList.items});
            }
        }
    });

});

app.post('/work',(req,res)=>{
    let item= req.body.newItem;
    workItems.push(item);
    res.redirect("/");
});



app.listen(3000,()=>{
    console.log('Server has started!')
});