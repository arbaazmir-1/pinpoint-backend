const Links = require("../models/linksModel");
const asynchandler = require("express-async-handler");
const User = require("../models/userModel");
const createSection = asynchandler(async (req, res) => {
  const { name, _id, published } = req.body;
  const user = req.user;
  const links = user.links;
  if (links !== undefined) {
    const linkGet = await Links.findById(links._id);
    if (linkGet) {
      linkGet.sections.push({
        _id: _id,
        published: published,
        name: name,
        links: [],
      });
      await linkGet.save();
      return res.status(200).json({
        message: "section-created",
      });
    }
  } else {
    const newLink = new Links({
      user: user._id,
      sections: [
        {
          _id: _id,
          published: published,
          name: name,
          links: [],
        },
      ],
    });
    
    await newLink.save();
    const userFormDB = await User.findById(user._id);
    userFormDB.links = newLink;
    await userFormDB.save();

    return res.status(200).json({
      message: "section-created",
    });
  }
});
const getSections = asynchandler(async (req, res) => {
  const user = req.user;
  const links = user.links;
  if (links) {
    const linkGet = await Links.findById(links._id);
    const sections = linkGet.sections;
    return res.status(200).json({
      message: "section-found",
      sections: sections,
    });
  }
  return res.status(200).json({
    message: "no-sections",
  });
});
const editSection = asynchandler(async (req, res) => {
    const link = req.user.links;
    const { _id, name, published } = req.body;

    if (!_id) {
        return res.status(400).json({
            message: "missing-data",
        });
    }

    try {
        const linkData = await Links.findById(link);
        if (!linkData) {
            return res.status(404).json({ message: "link-not-found" });
        }

        const sectionIndex = linkData.sections.findIndex((sec) => sec._id === _id);
        if (sectionIndex === -1) {
            return res.status(404).json({ message: "section-not-found" });
        }

        linkData.sections[sectionIndex].name = name;
        linkData.sections[sectionIndex].published = published;
        linkData.markModified('sections')
        
        const savedData = await linkData.save();
        if (!savedData) {
            return res.status(500).json({ message: "failed-to-save-section" });
        }

        return res.status(200).json({ message: "section-edited" });
    } catch (error) {
        console.error("Error editing section:", error);
        return res.status(500).json({ message: "server-error" });
    }
});

const deleteSections = asynchandler(async(req,res)=>{
    const link = req.user.links;
    const id = req.params.id
  const _id= id
    if(!_id){
        return res.status(400).json({
            message: "missing-data",
        });
    }
    try {
        const linkData = await Links.findById(link);
        if (!linkData) {
            return res.status(404).json({ message: "link-not-found" });
        }

        const sectionIndex = linkData.sections.findIndex((sec) => sec._id === _id);
        if (sectionIndex === -1) {
            return res.status(404).json({ message: "section-not-found" });
        }

        linkData.sections.splice(sectionIndex,1)
        linkData.markModified('sections')

        const savedData = await linkData.save();
        if (!savedData) {
            return res.status(500).json({ message: "failed-to-save-section" });
        }

        return res.status(200).json({ message: "section-deleted" });
    } catch (error) {
        console.error("Error editing section:", error);
        return res.status(500).json({ message: "server-error" });
    }
})

module.exports = { editSection };

module.exports = { createSection, getSections, editSection,deleteSections };
