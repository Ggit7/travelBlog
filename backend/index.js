require ("dotenv").config();
const config=require("./config.json");
const mongoose=require("mongoose");

const bcrypt = require("bcrypt");
const express=require("express");
const cros=require("cors");

const jwt= require("jsonwebtoken");
const upload=require('./multer')  ;
const fs= require('fs');
const path=require('path');

const User=require("./models/user.model");
const { authToken } = require("./utilities");
const TravelStory=require("./models/travelStory.model"); 

mongoose.connect(config.connect);



const app=express();
app.use(express.json());
app.use(cros({origin:"*"}));

//registration
app.post("/registration",async(req,res)=>{
    const {fullName,email,password}=req.body;

    if(!fullName||!email||!password){
        return res
        .status(400)
        .json({message:"all fields are required "});
    }
    const isUser=await User.findOne({email});
    if(isUser){
        return res 
        .status(400)
        .json({message :"User alrady exist"});
    }
    const hashedPassword=await bcrypt.hash(password,10);
    const user=new User({
        fullName,
        email,
        password:hashedPassword,
    })

    await user.save();
    const accessToken=jwt.sign(
        {userId:user. _id},
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:"72h",
        }
    );
    return res.status(201).json({
        user:{fullName: user.fullName, email:user.email},
        accessToken,
        message:"registration successful",
    });

});

//Login
app.post("/login",async(req,res)=>{
 
 const {email,password}=req.body;
 
 if(!email||!password){
    return res.status(400).json({message:'email and password required'});
 }

 const user=await User.findOne({email});
 if(!user){
    return res.status(400).json({message:"user not found"});
 }

 const isPasswordValid=await bcrypt.compare(password, user.password);
 if(!isPasswordValid){
    return res.status(400).json({message:"password did not match"})
 }

 const accessToken=jwt.sign(
    {userId: user. _id},
    process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:"72h"
    }
 );
 return res.json({
    message:"login successful",
    user:{fullName: user.fullName, email:user.email, userID:user._id},
    accessToken,
 })
})

//get user
app.get("/users", authToken, async (req, res) => {
        const { userId } = req.user; 
        const isUser = await User.findOne({ _id: userId });

        if (!isUser) {
            return res.status(404).json({ 
                user: null,
                message: "User not found" 
            });
        }

        return res.status(200).json({ 
            user: isUser,
            message: "User found" 
        });
    
});

//add travel story
app.post("/add-travel-story", authToken , async(req,res)=>{
    const{title, story ,visitedLocation,imageUrl,visitedDate}=req.body;
const { userId } = req.user;

    if(!title||!story||!visitedLocation||!imageUrl||!visitedDate){
        return res.status(400).json({error:true, message:"all fields are required"});
    }

    const parsedVisitedDate=new Date(parseInt(visitedDate));

    try{

            // Create a new travel story object
            const travelStory = new TravelStory({
                title,
                story,
                visitedLocation,
                userId, // Reference to userId
                imageUrl,
                visitedDate: parsedVisitedDate,
            });
    
            // Save the new travel story to the database
            await travelStory.save();
    
            // Populate fullName from the User schema using userId
            const populatedTravelStory = await TravelStory.findById(travelStory._id)
                .populate('userId', 'fullName')  // Populate fullName from User schema
                .exec();
    
            // Respond with the populated travel story
            res.status(201).json({ story: populatedTravelStory, message: 'Added successfully'})
    }catch(error){
        res.status(400).json({message:error.message});
    }
})

//get all travel story
app.get("/get-all-travel-story", async (req, res) => {
    try {
        // Fetch all travel stories and populate the userId field with fullName from the User model
        const travelStories = await TravelStory.find()
            .populate('userId', 'fullName')  // Populate fullName from User schema
            .exec();

        res.status(200).json({ stories: travelStories });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



//route to handel image upload
app.post("/image-upload", upload.single('image'), async (req, res)=>{
    
    try{
        if(!req.file){
            return res
            .status(400)
            .json({message: "no image upload "})
        }

        const imageUrl =`http://localhost:8000/uploads/${req.file.filename}`;

        res.status(201).json({imageUrl});
    } catch(error){
        res.status(500).json({message: error.message});
    }
})

//delete an image from upload

app.delete("/delete-image", async (req,res)=>{

    const {imageUrl}= req.query;

    if(!imageUrl){
        return res
        .status(400)
        .json({error:true, message:'imageUrl parameter required'})
    }

    try{

        const filename=path.basename(imageUrl);

        const filePath=path.join(__dirname,'uploads',filename);
        if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath);
            res.status(200).json({message:"image deleted"});
        }else{
            res.status(200).json({message:"image not found"})
        }
    }catch(error){
        res.status(500).json({massage:error.message});
    }
})

//edit travel story

app.put("/edit-story/:id", authToken, async (req,res)=>{

    const {id}=req.params;
    const{title, story ,visitedLocation,imageUrl,visitedDate}=req.body;
    const{userId}=req.user 

    if(!title||!story||!visitedLocation||!imageUrl||!visitedDate){
        return res.status(400).json({error:true, message:"all fields are required"});
    }

    const parsedVisitedDate=new Date(parseInt(visitedDate));

    try{
        const travelStory = await TravelStory.findOne({ _id: id, userId : userId});

        if(!travelStory){
            return res.status(404).json({message:"travel story not found"});
        }

    travelStory.title=title;
    travelStory.story=story;
    travelStory.visitedLocation=visitedLocation;
    travelStory.imageUrl=imageUrl;
    travelStory.visitedDate=parsedVisitedDate;

    await travelStory.save();
    res.status(200).json({story:travelStory, message:"updated Successful"});
    }catch(error){
        res.status(500).json({message:error.message});
    }
    

})

app.delete("/delete-story/:id", authToken , async (req,res)=>{

    const {id}=req.params;
    const {userId}=req.user;

    try{
        const travelStory = await TravelStory.findOne({ _id: id, userId : userId});

        if(!travelStory){
            return res.status(404).json({message:"travel story not found"});
        }

        await travelStory.deleteOne({ _id:id, userId:userId});
        const imaeUrl=travelStory.imageUrl;
        const filename=path.basename(imaeUrl);

        const filepath=path.join(__dirname,'uploads', filename);

        fs.unlink(filepath,(err)=>{
            if(err){
                console.error("failed to delete image file:" ,err);

            }
        })

        res.status(200).json({message:"travel story deleted"});
    }catch(error){
        res.status(500).json({message:error.message});
    }
})

// update favourite
app.put('/update-favourite/:id', authToken, async (req, res) => {
    const { id } = req.params; // Story ID
    const { isFavourite } = req.body; // Whether to like or dislike
    const { userId } = req.user; // Authenticated user ID

    try {
        // Find the story by ID
        const travelStory = await TravelStory.findById(id);

        if (!travelStory) {
            return res.status(404).json({ message: "Travel story not found" });
        }

        // Remove user from both likedBy and dislikedBy arrays to reset their preference
        travelStory.likedBy = travelStory.likedBy.filter(uid => uid !== userId);
        travelStory.dislikedBy = travelStory.dislikedBy.filter(uid => uid !== userId);

        // Add user to the appropriate array based on isFavourite
        if (isFavourite) {
            travelStory.likedBy.push(userId);
        } else {
            travelStory.dislikedBy.push(userId);
        }

        // Save the updated story
        await travelStory.save();

        res.status(200).json({ message: 'Updated successfully', story: travelStory });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



//search travel story
app.get('/search', authToken, async (req, res) => {
    const { query } = req.query;
    const { userId } = req.user;

    // Check if query is provided
    if (!query) {
        return res.status(400).json({ message: "Query is required" });
    }

    try {
        // Perform the search with case-insensitive regex
        const searchResult = await TravelStory.find({
            userId: userId,
            $or: [
                { title: { $regex: query, $options: "i" } },
                { story: { $regex: query, $options: "i" } },
                { visitedLocation: { $regex: query, $options: "i" } },
            ],
        }).sort({ isFavourite: -1 });

        // Send the response
        res.status(200).json({ data: { stories: searchResult } });
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
});

//filter stories by date
app.get("/travel-story/filter", authToken, async(req, res)=>{
    const {startDate, endDate}= req.query;
    const{userId}= req.user;

    try{
        const start= new Date(parseInt(startDate));
        const end =new Date(parseInt(endDate));

        const filterStories= await TravelStory.find({
            userId:userId,
            visitedDate:{$gte:start, $lte: end},
        }).sort({isFavourite: -1});

        res.status(200).json({stories:filterStories});
    }catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
})





app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.listen(8000);
module.exports=app;
