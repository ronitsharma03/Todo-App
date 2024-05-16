const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const dotenv = require("dotenv");
dotenv.config()

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


async function connectDb(uri){
  try{
    await mongoose.connect(
      uri
    );
  }catch(e){
    console.log(`Error connecting to the db: ${e}`);
  }
}
connectDb(process.env.MONGODB_URI);

const itemSchema = {
  name: String,
};
const Item = mongoose.model("Item", itemSchema);

const listSchema = {
  name: String,
  items: [itemSchema],
};
const List = mongoose.model("List", listSchema);

//Get request for main page
app.get("/", async function (req, res) {
  await Item.find({})
    .then((foundItems) => {
      res.render("list", { listTitle: "Today", newItems: foundItems });
    })
    .catch((error) => {
      console.log(error);
    });
});

//Post request for creating new custom route
app.post("/newroute", async function (req, res) {
  const customList = _.capitalize(req.body.listname);

  app.get(`/${customList}`, async function (req, res) {
    await List.findOne({ name: customList })
      .then(async (foundList) => {
        if (!foundList) {
          const list = new List({
            name: customList,
            items: [],
          });
          await list.save();
          res.redirect("/" + customList);
        } else {
          res.render("list", {
            listTitle: foundList.name,
            newItems: foundList.items,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  res.redirect(`/${customList}`);
});

//Post request for adding items in any particular list
app.post("/", async function (req, res) {
  const itemName = req.body.todo;
  const listName = req.body.list;

  const toDoItem = new Item({
    name: itemName,
  });
  if (listName === "Today") {
    await toDoItem.save();
    res.redirect("/");
  } else {
    await List.findOne({ name: listName }).then(async (foundList) => {
      await foundList.items.push(toDoItem);
      await foundList.save();
      res.redirect("/" + listName);
    });
  }
});

//Post request for deleting items from DB
app.post("/delete", async function (req, res) {
  const checkedItem = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === "Today") {
    await Item.findByIdAndRemove(checkedItem)
      .then(() => {
        console.log("Item deleted Sucessfully with id: ", checkedItem);
        res.redirect("/");
      })
      .catch((error) => {
        console.log("Failed to delete");
      });
  } else {
    await List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItem } } }
    ).then(() => {
      res.redirect("/" + listName);
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`Server is running at port ${port}...`);
});
