const mongoose = require("mongoose");
const { Schema } = mongoose;
const linksSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  sections: [
    {
      name:{
        type: String,
        required: true,
      },
      type: Object,
      _id: {
        type: String,
        required: true,
      },
      published: {
        type: Boolean,
        required: true,
      },
      links: [
        {
          name: {
            type: String,
            required: true,
          },
          _id: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
        },
      ],
    },
  ],
});

const LinkSchema = mongoose.model("Links", linksSchema);

module.exports = LinkSchema;
