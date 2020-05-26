//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const items = ["Buy food","Cook food","Eat food"];
const workItems=[];
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get('/',function(req,res){
   const today= new Date();
   
   const options= {
       weekday:'long',
       day:'numeric',
       month:'long'
   };

   const day = today.toLocaleDateString('en-US',options);
   res.render("list",{listTitle:day,newListItems:items});
});

app.post('/',function(req,res){
    const item = req.body.newItem;

    if(req.body.list==="Work"){
        workItems.push(item);
        res.redirect('work');
    }else{
        // when the post is triggered in the home route, it will bring the input name and store it in item variable
        //then it will redirect in the home route, it enters to app.get and render listItem >>> item
        items.push(item);
        res.redirect('/');
    }
    
});

app.get('/work',function(req,res){
  res.render("list",{listTitle:"Work List",newListItems:workItems});
});

app.post('/work',function(req,res){
    let item= req.body.newItem;
    workItems.push(item);
    res.redirect("/");
});

app.listen(3000,function(){
    console.log('Server has started!')
});