const MainModel = require("../../../models/movie.model");
const User = require("../../../models/user.model");
const Comment = require("../../../models/comment.model");
const MyList = require("../../../models/my-list.model");
const Status = require("../../../models/status.model");
const Notification = require("../../../models/notification.model");
const TotalScore = require("../../../models/total-score.model");
const paginationHelper = require("../../../helper/pagination");
const sortHelper = require("../../../helper/sort");
const searchHelper = require("../../../helper/search");
const scoreCalculator = require("../../../helper/score");

module.exports.getAllThumbnails = async (req, res) => {
  try {
    const movies = await MainModel.find({});
    res.json(movies);
  } catch (err) {
    res.status(500).send("Message: " + err.message);
  }
};

module.exports.getAllCategories = async (req, res) => {
  try {
    const data = await MainModel.find({});
    const categories = data.map((item) => {
      return item.movie.category.map((item) => {
        return {
          name: item.name,
          slug: item.slug,
        };
      });
    });
    res.json(categories);
  } catch (err) {
    res.status(500).send("Message: " + err.message);
  }
};

module.exports.getAllCountries = async (req, res) => {
  try {
    const data = await MainModel.find({});
    const countries = data.map((item) => {
      return item.movie.country.map((item) => {
        return {
          name: item.name,
          slug: item.slug,
        };
      });
    });
    res.json(countries);
  } catch (err) {
    res.status(500).send("Message: " + err.message);
  }
};

module.exports.handleSearchResult = async (req, res) => {
  try {
    const find = {};
    let objectSearch = searchHelper(req.query);
    if (req.query.keyword) {
      find["$or"] = [
        { "movie.name": objectSearch.regex },
        { "movie.origin_name": objectSearch.regex }
      ];
    }
    const results = await MainModel.find(find);
    res.json(results);
  } catch (err) {
    res.status(500).send("Message: " + err.message);
  }
};

module.exports.searchFilms = async (req, res) => {
  try {
    const find = {};
    let initPagination = {
      currentPage: req.query.page ? parseInt(req.query.page) : 1,
      limitItems: 12,
    };
    let objectSearch = searchHelper(req.query);
    if (req.query.keyword) {
      find["$or"] = [
        { "movie.name": objectSearch.regex },
        { "movie.origin_name": objectSearch.regex }
      ];
    }
    const countSearchMovies = await MainModel.countDocuments(find);
    const totalPagesSearch = Math.ceil(
      countSearchMovies / initPagination.limitItems
    );
    const objectPagination = paginationHelper(
      initPagination,
      req.query,
      countSearchMovies
    );
    const sort = sortHelper(req.query);
    const movies = await MainModel.find(find).sort(sort).skip(objectPagination.skip).limit(objectPagination.limitItems);
    res.json({
      movies: movies,
      totalMovies: countSearchMovies,
      currentPage: objectPagination.currentPage,
      totalPagesSearch: totalPagesSearch,
    });
  } catch (err) {
    res.status(500).send("Message: " + err.message);
  }
};

module.exports.getAllMovies = async (req, res) => {
  try {
    const find = {};
    let initPagination = {
      currentPage: req.query.page ? parseInt(req.query.page) : 1,
      limitItems: 12,
    };
    let genre, country;
    if (req.query.genre) {
      genre = decodeURIComponent(req.query.genre);
    }
    if (req.query.country) {
      country = decodeURIComponent(req.query.country);
    }
    if (genre) {
      find["movie.category"] = { $elemMatch: { slug: genre } };
    }
    if (country) {
      find["movie.country"] = { $elemMatch: { slug: country } };
    }
    const countMovies = await MainModel.countDocuments(find);
    const totalPages = Math.ceil(countMovies / initPagination.limitItems);
    const objectPagination = paginationHelper(
      initPagination,
      req.query,
      countMovies
    );
    const sort = sortHelper(req.query);
    const movies = await MainModel.find(find).sort(sort).skip(objectPagination.skip).limit(objectPagination.limitItems);
    res.json({
      movies: movies,
      totalMovies: countMovies,
      totalPages: totalPages,
      currentPage: objectPagination.currentPage,
    });
  } catch (err) {
    res.status(500).send("Message: " + err.message);
  }
};

module.exports.getAllSeries = async (req, res) => {
  try {
    let find = { "movie.type": "series" };
    let initPagination = {
      currentPage: req.query.page ? parseInt(req.query.page) : 1,
      limitItems: 12,
    };
    let genre, country;
    if (req.query.genre) {
      genre = decodeURIComponent(req.query.genre);
    }
    if (req.query.country) {
      country = decodeURIComponent(req.query.country);
    }
    if (genre) {
      find["movie.category"] = { $elemMatch: { slug: genre } };
    }
    if (country) {
      find["movie.country"] = { $elemMatch: { slug: country } };
    }
    const countMovies = await MainModel.countDocuments(find);
    const totalPages = Math.ceil(countMovies / initPagination.limitItems);
    const objectPagination = paginationHelper(
      initPagination,
      req.query,
      countMovies
    );
    const sort = sortHelper(req.query);
    const movies = await MainModel.find(find).sort(sort).skip(objectPagination.skip).limit(objectPagination.limitItems);
    res.json({
      movies: movies,
      totalMovies: countMovies,
      totalPages: totalPages,
      currentPage: objectPagination.currentPage,
    });
  } catch (err) {
    res.status(500).send("Message: " + err.message);
  }
};

module.exports.getAllFeatureFilms = async (req, res) => {
  try {
    let find = { "movie.type": "single" };
    let initPagination = {
      currentPage: req.query.page ? parseInt(req.query.page) : 1,
      limitItems: 12,
    };
    let genre, country;
    if (req.query.genre) {
      genre = decodeURIComponent(req.query.genre);
    }
    if (req.query.country) {
      country = decodeURIComponent(req.query.country);
    }
    if (genre) {
      find["movie.category"] = { $elemMatch: { slug: genre } };
    }
    if (country) {
      find["movie.country"] = { $elemMatch: { slug: country } };
    }
    const countMovies = await MainModel.countDocuments(find);
    const totalPages = Math.ceil(countMovies / initPagination.limitItems);
    const objectPagination = paginationHelper(
      initPagination,
      req.query,
      countMovies
    );
    const sort = sortHelper(req.query);
    const movies = await MainModel.find(find).sort(sort).skip(objectPagination.skip).limit(objectPagination.limitItems);
    res.json({
      movies: movies,
      totalMovies: countMovies,
      totalPages: totalPages,
      currentPage: objectPagination.currentPage,
    });
  } catch (err) {
    res.status(500).send("Message: " + err.message);
  }
};

module.exports.getAllTVShows = async (req, res) => {
  try {
    let find = { "movie.type": "tvshows" };
    let initPagination = {
      currentPage: req.query.page ? parseInt(req.query.page) : 1,
      limitItems: 12,
    };
    let genre, country;
    if (req.query.genre) {
      genre = decodeURIComponent(req.query.genre);
    }
    if (req.query.country) {
      country = decodeURIComponent(req.query.country);
    }
    if (genre) {
      find["movie.category"] = { $elemMatch: { slug: genre } };
    }
    if (country) {
      find["movie.country"] = { $elemMatch: { slug: country } };
    }
    const countMovies = await MainModel.countDocuments(find);
    const totalPages = Math.ceil(countMovies / initPagination.limitItems);
    const objectPagination = paginationHelper(
      initPagination,
      req.query,
      countMovies
    );
    const sort = sortHelper(req.query);
    const movies = await MainModel.find(find).sort(sort).skip(objectPagination.skip).limit(objectPagination.limitItems);
    res.json({
      movies: movies,
      totalMovies: countMovies,
      totalPages: totalPages,
      currentPage: objectPagination.currentPage,
    });
  } catch (err) {
    res.status(500).send("Message: " + err.message);
  }
};

module.exports.getAllAnimatedMovies = async (req, res) => {
  try {
    let find = { "movie.type": "hoathinh" };
    let initPagination = {
      currentPage: req.query.page ? parseInt(req.query.page) : 1,
      limitItems: 12,
    };
    let genre, country;
    if (req.query.genre) {
      genre = decodeURIComponent(req.query.genre);
    }
    if (req.query.country) {
      country = decodeURIComponent(req.query.country);
    }
    if (genre) {
      find["movie.category"] = { $elemMatch: { slug: genre } };
    }
    if (country) {
      find["movie.country"] = { $elemMatch: { slug: country } };
    }
    const countMovies = await MainModel.countDocuments(find);
    const totalPages = Math.ceil(countMovies / initPagination.limitItems);
    const objectPagination = paginationHelper(
      initPagination,
      req.query,
      countMovies
    );
    const sort = sortHelper(req.query);
    const movies = await MainModel.find(find).sort(sort).skip(objectPagination.skip).limit(objectPagination.limitItems);
    res.json({
      movies: movies,
      totalMovies: countMovies,
      totalPages: totalPages,
      currentPage: objectPagination.currentPage,
    });
  } catch (err) {
    res.status(500).send("Message: " + err.message);
  }
};

module.exports.getAllMyList = async (req, res) => {
  try {
    const userId = req.user.userId;
    let find = {
      userId: userId,
    };
    const myList = await MyList.findOne(find);
    res.json({
      myList: myList || [],
    });
  } catch (err) {
    res.status(500).send("Message: " + err.message);
  }
};

module.exports.addMovieToMyList = async (req, res) => {
  try {
    const { userEmail, movieSlug } = req.body;
    const user = await User.findOne({ email: userEmail });
    const movieData = await MainModel.findOne({ "movie.slug": movieSlug });
    let myList = await MyList.findOne({ userId: user.id });
    if (!myList) {
      myList = new MyList({ userId: user._id, movie: [] });
    }
    const existingIndex = myList.movie.findIndex((m) => m.slug === movieSlug);
    if (existingIndex !== -1) {
      myList.movie.splice(existingIndex, 1);
      await myList.save();
      return res.json({ message: "Movie removed from your list" });
    }
    const newMovie = {
      _id: movieData._doc.movie._doc._id,
      name: movieData._doc.movie._doc.name,
      origin_name: movieData._doc.movie._doc.origin_name,
      poster_url: movieData._doc.movie._doc.poster_url,
      episode_current: movieData._doc.movie._doc.episode_current,
      slug: movieSlug,
      category: movieData._doc.movie._doc.category.map((cat) => ({
        id: cat._id,
        name: cat.name,
        slug: cat.slug,
      })),
      country: movieData._doc.movie._doc.country.map((cou) => ({
        id: cou._id,
        name: cou.name,
        slug: cou.slug,
      })),
      year: movieData._doc.movie._doc.year,
      addedAt: new Date(),
    };
    if (myList) {
      myList._doc.movie.push(newMovie);
    } else {
      myList = new MyList({
        userId: user.id,
        movie: [newMovie],
      });
    }
    await myList.save();
    const io = req.app.get("socketio");
    const message = "Movie has been added to your list";
    io.emit("movieAdded", { message: message });
    let notification = await Notification.findOne({ userId: user._id });
    if (notification) {
      notification.messages.push({
        poster_url: movieData._doc.movie._doc.poster_url,
        slug: movieSlug,
        message: message,
        timestamp: new Date(),
        status: "unread",
      });
    } else {
      notification = new Notification({
        userId: user._id,
        messages: [
          {
            poster_url: movieData._doc.movie._doc.poster_url,
            slug: movieSlug,
            message: message,
            timestamp: new Date(),
            status: "unread",
          },
        ],
      });
    }
    await notification.save();
    res.json(myList);
  } catch (err) {
    res.status(500).send("Message: " + err.message);
  }
};

module.exports.removeFromMyList = async (req, res) => {
  try {
    const { email, movies } = req.body;
    const user = await User.findOne({ email: email });
    const updateResult = await MyList.updateOne(
      { userId: user.id },
      { $pull: { movie: { _id: { $in: movies } } } }
    );
    if (updateResult.modifiedCount === 0) {
      return res.status(404).json({ message: "No movies found or removed!" });
    }
    res.json({ message: "Successfully removed movies!" });
  } catch (err) {
    res.status(500).send("Message: " + err.message);
  }
};

module.exports.createComment = async (req, res) => {
  try {
    const { userEmail, movieSlug, text } = req.body;
    const user = await User.findOne({ email: userEmail });
    const movie = await MainModel.findOne({ "movie.slug": movieSlug });
    const newComment = {
      userId: user._id,
      avatarUrl: user.avatar,
      movieId: movie._id,
      text: text,
    };
    const comment = new Comment(newComment);
    await comment.save();
    const comments = (await Comment.find({ movieId: movie._id })) || [];
    res.json({
      comments: comments,
      user: userEmail,
    });
  } catch (err) {
    res.status(500).send("Message: " + err.message);
  }
};

module.exports.removeComment = async (req, res) => {
  try {
    const { slug, commentId } = req.params;
    await Comment.findOneAndDelete({ _id: commentId });
    const movie = await MainModel.findOne({ "movie.slug": slug });
    const comments = (await Comment.find({ movieId: movie._id })) || [];
    res.json(comments);
  } catch (err) {
    res.status(500).send("Message: " + err.message);
  }
};

module.exports.getRanking = async (req, res) => {
  try {
    const movies = await MainModel.find({}).sort({ "movie.view": -1 });
    const ranking = [];
    movies.forEach((movie, index) => {
      if (index < 12) {
        ranking.push(movie);
      }
    });
    res.json(ranking);
  } catch (err) {
    res.status(500).send("Message: " + err.message);
  }
};

module.exports.handleStatusVideo = async (req, res) => {
  try {
    const { userEmail, ratingValue } = req.body;
    const { slug } = req.params;
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const movie = await MainModel.findOne({ "movie.slug": slug });
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    let status = await Status.findOne({ userId: user._id });
    if (status) {
      const movieStatus = status.movies.find((m) => {
        return m.movieId.equals(movie._id);
      });
      if (movieStatus) {
        if (movieStatus.status !== ratingValue) {
          movieStatus.status = ratingValue;
        } else {
          movieStatus.status = "unwatched";
        }
      } else {
        status.movies.push({ movieId: movie._id, status: ratingValue });
      }
      await status.save();
    } else {
      const newStatus = new Status({
        userId: user._id,
        movies: [{ movieId: movie._id, status: ratingValue }],
      });
      await newStatus.save();
    }
    const io = req.app.get("socketio");
    const message = "You just expressed your feelings";
    io.emit("movieAdded", { message: message });
    let notification = await Notification.findOne({ userId: user._id });
    if (notification) {
      notification.messages.push({
        poster_url: movie._doc.movie._doc.poster_url,
        slug: slug,
        message: message,
        timestamp: new Date(),
        status: "unread",
      });
    } else {
      notification = new Notification({
        userId: user._id,
        messages: [
          {
            poster_url: movie._doc.movie._doc.poster_url,
            slug: slug,
            message: message,
            timestamp: new Date(),
            status: "unread",
          },
        ],
      });
    }
    await notification.save();
    const score = scoreCalculator(ratingValue);
    const totalScore = await TotalScore.findOne({ movieId: movie._id });
    if (totalScore) {
      await TotalScore.findOneAndUpdate({
        movieId: movie._id,
        voteQuantity: totalScore.voteQuantity + 1,
        totalScore: totalScore.totalScore + score,
      });
    } else {
      const newScore = new TotalScore({
        movieId: movie._id,
        voteQuantity: 1,
        totalScore: score,
      });
      await newScore.save();
    }
    res.json({ message: "Success" });
  } catch (err) {
    res.status(500).send("Message: " + err.message);
  }
};

module.exports.getMovieDetailsWithComments = async (req, res) => {
  try {
    const slug = req.params.slug;
    const userId = req.user.userId;

    const movie = await MainModel.findOneAndUpdate(
      { "movie.slug": slug },
      { $inc: { "movie.view": 1 } },
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const [totalScore, comments, user, myList, status] = await Promise.all([
      TotalScore.findOne({ movieId: movie._id }),
      Comment.find({ movieId: movie._id }),
      User.findById(userId),
      MyList.findOne({ userId }),
      Status.findOne({ userId }),
    ]);

    let isMyList = myList && myList.movie.some((m) => m.slug === slug);

    let movieStatus = "";
    if (status) {
      const foundMovieStatus = status.movies.find((m) =>
        m.movieId.equals(movie._id)
      );
      if (foundMovieStatus) {
        movieStatus = foundMovieStatus.status;
      }
    }

    const score = totalScore
      ? {
          totalScore: totalScore.totalScore,
          voteQuantity: totalScore.voteQuantity,
        }
      : {};

    const response = {
      detail: movie,
      comments: comments,
      movieStatus: movieStatus,
      score: score,
      isMyList: isMyList,
    };

    res.json(response);
  } catch (err) {
    res.status(500).send("Message: " + err.message);
  }
};

module.exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const notifications = await Notification.findOne({ userId: userId });
    res.json(notifications);
  } catch (err) {
    res.status(500).send("Message: " + err.message);
  }
};

module.exports.handleNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { notifySlug } = req.body;
    const notifications = await Notification.findOne({ userId: userId });
    if (notifications && notifications.messages) {
      notifications.messages.forEach((message) => {
        if (message.slug === notifySlug) {
          message.status = "read";
        }
      });
      await notifications.save();
    }
    res.json({ message: "Success !" });
  } catch (err) {
    res.status(500).send("Message: " + err.message);
  }
};
