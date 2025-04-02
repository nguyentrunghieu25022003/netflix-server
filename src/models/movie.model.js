const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EpisodeSchema = new Schema({
  server_name: String,
  server_data: [
    {
      name: String,
      slug: String,
      filename: String,
      link_embed: String,
      link_m3u8: String,
    },
  ],
});

const CategorySchema = new Schema({
  id: String,
  name: String,
  slug: String,
});

const CountrySchema = new Schema({
  id: String,
  name: String,
  slug: String,
});

const MovieSchema = new Schema({
  created: { time: Date },
  modified: { time: Date },
  _id: String,
  name: String,
  slug: String,
  origin_name: String,
  content: String,
  type: String,
  status: String,
  poster_url: String,
  thumb_url: String,
  is_copyright: Boolean,
  sub_docquyen: Boolean,
  chieurap: Boolean,
  trailer_url: String,
  time: String,
  episode_current: String,
  episode_total: String,
  quality: String,
  lang: String,
  notify: String,
  showtimes: String,
  year: Number,
  view: Number,
  actor: [String],
  director: [String],
  category: [CategorySchema],
  country: [CountrySchema],
});

const MainSchema = new Schema({
  status: Boolean,
  msg: String,
  movie: MovieSchema,
  episodes: [EpisodeSchema],
});

const MainModel = mongoose.model("movies", MainSchema);

module.exports = MainModel;