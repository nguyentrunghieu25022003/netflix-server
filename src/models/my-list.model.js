const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MyListSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  movie: [
    {
      _id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      origin_name: {
        type: String,
        required: true,
      },
      poster_url: {
        type: String,
        required: true,
      },
      episode_current: {
        type: String,
        required: true,
      },
      slug: {
        type: String,
        required: true,
      },
      category: [
        {
          id: {
            type: String,
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          slug: {
            type: String,
            required: true,
          }
        }
      ],
      country: [
        {
          id: {
            type: String,
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          slug: {
            type: String,
            required: true,
          }
        }
      ],
      year: {
        type: String,
        required: true,
      },
      addedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MyList = mongoose.model("MyList", MyListSchema);

module.exports = MyList;
