const express = require("express");
const Recipe = require("../models/recipe");
const Mine = require("../models/mine");
const Ingredient = require("../models/ingredient");
const Rate = require("../models/rate");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
let path = require("path");
const router = express.Router();
const protect = (req, res, next) => {
  if (req.session.user) {
    req.user = req.session.user;
    return next();
  } else {
    return res.json({ message: "you must have to sign in to add recipe." });
  }
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let upload = multer({ storage, fileFilter });
router
  .route("/addRecipe")
  .post(protect, upload.single("photo"), async (req, res) => {
    try {
      const creator = req.user.id;
      const { name, skill, prepTime, ingridientNature } = req.body;

      const photo = req.file.filename;
      // const ingIdArray = [];
      // ingredients.map(async (ing, index) => {
      //   const ings = await new Ingredient(ing.name, ing.alcholic, ing.description);
      //   saveIngs = await ings.save();
      //   ingIdArray[index] = saveIngs._id;
      // });
      // ingredients = ingIdArray;
      const recipe = await new Recipe({
        name,
        skill,
        prepTime,
        ingridientNature,
        creator,
        photo,
      });
      const savedRecipe = await recipe.save();

      if (savedRecipe) {
        return res.status(200).json({
          message: "successfuly added",
          data: savedRecipe,
        });
      } else {
        return res.status(400).json({
          message: "fail",
          data: "",
        });
      }
    } catch (err) {
      console.log(err);
    }
  });

router.get("/getAllRecipe", async (req, res, next) => {
  const queryObj = { ...req.query }; //creates object
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queryObj[el]); //delete this fields from query

  //ADVANCED FILTERING
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  console.log(queryStr);
  //Build the Query
  let query = Recipe.find(JSON.parse(queryStr));

  //SORTING
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
  } else {
    query = query.sort("-createdAt");
  }
  //limiting fields
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    query = query.select(fields);
  } else {
    query = query.select("-__v");
  }
  //pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 25;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  if (req.query.page) {
    const numOfItems = await Recipe.countDocuments();
    if (skip >= numOfItems)
      throw new AppError("No More recipes are available !");
  }

  //EXECUTE A QUERY
  const recipe = await query;

  //SEND RESPONSE

  if (recipe) {
    res.send(recipe);
  } else {
    res.status(400).json({
      message: "fail",
      data: "",
    });
  }
});
router.get("/recipe/:searchWord", async (req, res, next) => {
  const searchword = req.params.searchWord;

  const recipe = await Recipe.search(searchword);
  console.log(recipe);
  if (recipe) {
    res.status(200).json({ recipe: recipe });
  } else res.json({ message: "no results found for your search" });
});
router.get(
  "getMyRecipe",
  protect,

  async (req, res, next) => {
    const userId = req.user._id;
    const myRecipe = await Recipe.find({ creator: userId });
    if (myRecipe) {
      res.status(200).json({ data: myRecipe });
    } else {
      res.status(200).json({ data: "" });
    }
  }
);
router.get(
  "/getRecipeDetail/:id",
  protect,

  async (req, res, next) => {
    const id = req.params.id;
    console.log(id);

    const recipe = await Recipe.findOne({ _id: id });
    console.log(recipe);

    if (recipe) {
      res.send(recipe);
    } else {
      res.status(200).json({ data: "" });
    }
  }
);

router.post("/rateRecipe", protect, async (req, res, next) => {
  const { recipeId, rateAmount } = req.body;
  const rateRecipe = await new Rate({
    recipeId: recipeId,
    rateAmount: rateAmount,
  });
  const saveRate = await rateRecipe.save();
  if (saveRate) {
    res.status(200).json({ message: "success" });
  }
});

module.exports = router;
