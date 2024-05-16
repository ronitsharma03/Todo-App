const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(
  "mongodb+srv://admin-ronit:test123@todolistcluster.n8ijwfg.mongodb.net/?retryWrites=true&w=majority"
);

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
app.get("/", function (req, res) {
  Item.find({})
    .then((foundItems) => {
      res.render("list", { listTitle: "Today", newItems: foundItems });
    })
    .catch((error) => {
      console.log(error);
    });
});

//Post request for creating new custom route
app.post("/newroute", function (req, res) {
  const customList = _.capitalize(req.body.listname);

  app.get(`/${customList}`, function (req, res) {
    List.findOne({ name: customList })
      .then((foundList) => {
        if (!foundList) {
          const list = new List({
            name: customList,
            items: [],
          });
          list.save();
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
app.post("/", function (req, res) {
  const itemName = req.body.todo;
  const listName = req.body.list;

  const toDoItem = new Item({
    name: itemName,
  });
  if (listName === "Today") {
    toDoItem.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }).then((foundList) => {
      foundList.items.push(toDoItem);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

//Post request for deleting items from DB
app.post("/delete", function (req, res) {
  const checkedItem = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItem)
      .then(() => {
        console.log("Item deleted Sucessfully with id: ", checkedItem);
        res.redirect("/");
      })
      .catch((error) => {
        console.log("Failed to delete");
      });
  } else {
    List.findOneAndUpdate(
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
