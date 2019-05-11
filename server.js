// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

//Setting up handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");



// Database configuration
var databaseUrl = "scraper";
var collections = ["indiewireData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  // res.send("Hello world");
  // res.render('home')
  db.scraper.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      // res.json(found);
      res.render('home', found)
    }
  });
});

// Retrieve data from the db
app.get("/all", function(req, res) {
  // Find all results from the scrapedData collection in the db
  db.scraper.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      // res.json(found);
      // res.render('home', {found});
      var articleObject = {
         movies: found
        };
        
        res.render('home',articleObject);
    }
  });

});

// Scrape data from one site and place it into the mongodb db
// app.get("/scrape", function(req, res) {
//   // Make a request via axios for the news section of `ycombinator`
//   axios.get("https://www.indiewire.com/").then(function(response) {
//     // Load the html body from axios into cheerio
//     var $ = cheerio.load(response.data);
//     // For each element with a "title" class
//     $("#featured_homepage-2 > section > aside").each(function(i, element) {

//       console.log($(element).html(), 'part 1');

//       console.log($(element).children().length);

//       console.log($(element).children().eq(1).html());
//       console.log('-------');
    



//       // Save the text and href of each link enclosed in the current element
//       var title = $(element).children("a").text();
//       var link = $(element).children("a").attr("href");

//       // If this found element had both a title and a link
//       // if (title && link) {
//       //   // Insert the data in the scrapedData db
//       //   db.scrapedData.insert({
//       //     title: title,
//       //     link: link
//       //   },
//       //   function(err, inserted) {
//       //     if (err) {
//       //       // Log the error if one is encountered during the query
//       //       console.log(err);
//       //     }
//       //     else {
//       //       // Otherwise, log the inserted data
//       //       console.log(inserted);
//       //     }
//       //   });
//       // }
//     });
//   });

// //   Send a "Scrape Complete" message to the browser
//   res.send("Scrape Complete");
// });

app.get("/scrape2", function(req, res) {
  // Make a request via axios for the news section of `ycombinator`
  axios.get("https://www.indiewire.com/").then(function(response) {
    // Load the html body from axios into cheerio
    var $ = cheerio.load(response.data);
    // For each element with a "title" class

    // $("#featured_homepage-2 > section > aside ul article").each(function(i, element) {
    //   // res.send( $(element).find('ul article').html() )
    //   console.log( $(element).find('img').attr('src') )
    //   console.log( $(element).find(".c-title__link").text())
    //   res.send( $(element).html() )
    //   return false;
    // });
    $(".o-story-list__item").each(function() {
      var img = $(this).children().children().eq(0).find('img').attr('src')
      var link = $(this).children().children().eq(1).find('a').attr('href')
      var title = $(this).children().children().eq(1).find('a').text()

      if (img && link && title) {
        console.log("IMG: "+img)
        console.log("LINK: "+link)
        console.log("TITLE: "+title.trim())
        db.scraper.insert({
          title : title,
          link : link,
          image : img
        },
        function(err, inserted) {
          console.log(inserted)
          // res.render("/", inserted)

          if (err)
            console.log(err)
        })
      }
    })

  });
});

// Listen on port 3000
app.listen(3000, function() {
  console.log("xxApp running on port 3000!");
});
