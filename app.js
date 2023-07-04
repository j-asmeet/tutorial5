const express=require("express");
const app=express();
const port=8080;
const users=require("./database/users");
const { randomUUID } = require("crypto");
app.use(express.json());
app.listen(port);

app.get('/users',(req,res)=>
{
    try{
    if(users==null|| !users.length)
        res.status(400).json({message: "No users found"});
    else
    {
        res.status(200).json({ message: "Users retrieved",
        success: true,
        users:  users.map(user => ({
            email: user.email,
            firstName: user.firstName,
            id: user.id
          }))});
        }
    }
    catch(err)
    {
        res.status(500).json({message: "Internal server error"});
    }
});

app.get('/user/:id', (req, res) => {
    try{
        const userId = req.params.id;
        if(userId==null|| !userId.length)
            res.status(400).json({message: "Missing user id"});
        else
            {
                const user = users.find(user => user.id === userId);
                    if(user)
                    {
                        res.status(200).json({ success: true,
                        user: {
                            email: user.email,
                            firstName: user.firstName,
                            id: user.id
                        }
                    });
                }
                else{
                    res.status(404).json({message: "No users found", success: false}); 
                }
                    
            }
        }
        catch(err)
        {
            res.status(500).json({message: "Internal server error"});
        } 
});

app.put('/update/:id', (req,res)=>{
    try{
        const userId = req.params.id;
        const body=req.body;
        if(!userId || !userId.length)
            res.status(400).json({message: "Missing user id", success: false});
            else if(!body.email || !body.email.length || !body.firstName || !body.firstName.length)
            res.status(400).json({message: "Missing user information", success: false});
        else
            {
                const user = users.find(user => user.id == userId);
                if(user)
                    {
                        user.email=body.email;
                        user.firstName=body.firstName;
                        res.status(200).json({ message: "User updated",
                        success: true});
                    }
                else
                    {
                        res.status(404).json({message: "No users found", success: false});  
                    }
            }
        }
        catch(err)
        {
            res.status(500).json({message: "Internal server error"});
        } 
    
})

app.post('/add', (req, res) => {
    try {
        const body=req.body;
  
      if (!body.email || !body.email.length || !body.firstName || !body.firstName.length) {
        res.status(400).json({ message: "Missing or invalid input" });
      } else {
        const newUser = { id: randomUUID(), email: body.email , firstName: body.firstName };
        users.push(newUser);
        res.status(200).json({ message: "User added", success: true});
      }
    } catch (err) {
        console.log(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  
