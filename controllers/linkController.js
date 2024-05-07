const Links = require("../models/linksModel");
const asynchandler = require("express-async-handler");
const User = require("../models/userModel");


const createLink = asynchandler(async(req,res)=>{
    const {sectionID,name,link,_id}=req.body;
    if(!sectionID || !name || !link || !_id){
        res.send(400).json({
            message:"missing-data"
        })
    }
    try{
        const linkID = req.user.links
        const linkData = await Links.findById(linkID);
        if (!linkData) {
            return res.status(404).json({ message: "link-not-found" });
        }
        const sectionIndex = linkData.sections.findIndex((sec) => sec._id === sectionID);
        if (sectionIndex === -1) {
            return res.status(404).json({ message: "section-not-found" });
        }
        linkData.sections[sectionIndex].links.push({
            _id,
            name,
            link
        })
        linkData.markModified('sections')
        const savedData = await linkData.save();
        if (!savedData) {
            return res.status(500).json({ message: "failed-to-save-section" });
        }
        return res.status(200).json({ message: "link-added" });

    }catch(e){
        console.error("Error creating link:", error);
        return res.status(500).json({ message: "server-error" });
    }
})


const deleteLink = asynchandler(async(req,res)=>{
    const {sectionID,id}=req.params
    if(!sectionID|| !id){
        res.send(400).json({
            message:"missing-data"
        })
    }
    try{
        const linkID = req.user.links
        const linkData = await Links.findById(linkID);
        if (!linkData) {
            return res.status(404).json({ message: "link-not-found" });
        }
        const sectionIndex = linkData.sections.findIndex((sec) => sec._id === sectionID);
        if (sectionIndex === -1) {
            return res.status(404).json({ message: "section-not-found" });
        }
       const linkIndex = linkData.sections[sectionIndex].links.findIndex((l)=> l._id ===id)
       if(linkIndex === -1){
        return res.status(404).json({ message: "link-not-found" });
       }
       linkData.sections[sectionIndex].links.splice(linkIndex,1)
        linkData.markModified('sections')
        const savedData = await linkData.save();
        if (!savedData) {
            return res.status(500).json({ message: "failed-to-save-link" });
        }
        return res.status(200).json({ message: "link-deleted" });

    }catch(e){
        console.error("Error creating link:", error);
        return res.status(500).json({ message: "server-error" });
    }
})

const editLink = asynchandler(async(req,res)=>{
    const {sectionID,name,link,_id}=req.body;
    if(!sectionID|| !_id){
        res.send(400).json({
            message:"missing-data"
        })
    }
    try{
        const linkID = req.user.links
        const linkData = await Links.findById(linkID);
        if (!linkData) {
            return res.status(404).json({ message: "link-not-found" });
        }
        const sectionIndex = linkData.sections.findIndex((sec) => sec._id === sectionID);
        if (sectionIndex === -1) {
            return res.status(404).json({ message: "section-not-found" });
        }
       const linkIndex = linkData.sections[sectionIndex].links.findIndex((l)=> l._id ===_id)
       if(linkIndex === -1){
        return res.status(404).json({ message: "link-not-found" });
       }
       linkData.sections[sectionIndex].links[linkIndex].name = name ? name: linkData.sections[sectionIndex].links[linkIndex].name
       linkData.sections[sectionIndex].links[linkIndex].link = link ? link: linkData.sections[sectionIndex].links[linkIndex].link
        linkData.markModified('sections')
        const savedData = await linkData.save();
        if (!savedData) {
            return res.status(500).json({ message: "failed-to-save-link" });
        }
        return res.status(200).json({ message: "link-edited" });

    }catch(e){
        console.error("Error creating link:", error);
        return res.status(500).json({ message: "server-error" });
    }
})

module.exports ={
    createLink,
    deleteLink,
    editLink
}