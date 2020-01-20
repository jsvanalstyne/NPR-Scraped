$(document).ready(function () {
  var noteLinkId = "";
  // Front end for scraping NPR.org
  $(".scrape-articles").on("click", function () {
    $.get("/scrape", function (res) {
      window.location.reload();
    });
  })
  //Click on save article and the object for the article is created by obtaining the data-attributes. 
  $(".saveArticleButton").on("click", function () {
    var articleObject = {
      title: $(this).attr("data-title"),
      summary: $(this).attr("data-summary"),
      link: $(this).attr("data-link"),
      id: $(this).attr("data-id")
    }
    postingSavedArticle(articleObject);
  });

  // Post route for creating a saved article in the saved article collection 
  function postingSavedArticle(articleSaving) {
    $.ajax({
      url: "/savedArticle",
      data: JSON.stringify(articleSaving),
      type: "POST",
      dataType: "json",
      contentType: "application/json"
    }).then(function (data) {
      console.log(data)
      window.location.reload();
    }).fail(function (err) {
      if (err) throw err;
      console.log(err);
      res.send(err);
    });;
  }
  // On-click for deleting a specific article from the saved articles collection
  $(".deleteSaved").on("click", function () {

    var savedObject = {
      title: $(this).attr("data-title"),
      summary: $(this).attr("data-summary"),
      link: $(this).attr("data-link"),
      id: $(this).attr("data-id")
    }
    console.log(savedObject);
    deleteSavedArticle(savedObject);
  });
  // Request for the specific article to be deleted. 
  function deleteSavedArticle(objectToDelete) {
    console.log(objectToDelete);
    $.ajax({
      url: "/savedArticle",
      data: JSON.stringify(objectToDelete),
      type: "DELETE",
      dataType: "json",
      contentType: "application/json"
    }).then(function (data) {
      console.log(data)
      window.location.reload();
    }).fail(function (err) {
      if (err) throw err;
      console.log(err);
      res.send(err);
    });;
  }
  // On click for deleting all of the scraped articles, saved articles and notes. 
  $(".clearArticles").on("click", function () {

    $.ajax({
      url: "/articles",
      type: 'DELETE',
    }).then(function (data) {
      window.location.reload();
    })
  });
  // On click for creating a note on a saved article
  $(".addNote").on("click", function () {
    $("#articleNotesModal").modal("show");
    noteLinkId = $(this).attr("data-id")
    console.log(noteLinkId);
    getSavedNotes(noteLinkId);
  });
  // Request for getting all saved notes. 
  function getSavedNotes(getSavedNote) {
    console.log("inside getSavedNotes")
    console.log(getSavedNote)
    $.ajax({
      url: "/savedArticleNotes/" + getSavedNote,
      type: "GET"
    }).then(function (data) {
      console.log(data);
      $(".noteId").text(noteLinkId);
      // console.log ("line 108 " +data);
      var noteArray = data.note;
      $(".prevPostedNotes").empty();
      var cards = [];
      for (var i = 0; i < noteArray.length; i++) {
        console.log(noteArray[i].body);
        var card = $("<div>").addClass("card").append(
          $("<div>").addClass("card-text").text(noteArray[i].body),
          $("<button>").attr("data-id", noteArray[i]._id).addClass("deleteNote btn btn-primary").text("Delete Note")
        );
        cards.push(card);
      }
      $(".prevPostedNotes").append(cards);
    });
  }
  // On click to delete a note from the notes collection for a saved article
  $((document)).on("click", ".deleteNote", function () {
    console.log("inside on click for delete");
    var noteToDelete = $(this).attr("data-id");
    noteToBeDeleted(noteToDelete);

  });
  // Request for a specific note to be deleted
  function noteToBeDeleted(idForNote) {
    $.ajax({
      url: "/notes/" + idForNote,
      type: 'DELETE',
    }).then(function (data) {
      window.location.reload();
    })
  }
  // ON click for posting a new note
  $(".postNewNote").on("click", function () {
    var postBody = $("#noteBody").val()
    var newNote = {
      body: postBody
    }
    createNewPost(newNote)
  });
  // Function containing request for new note to be posted
  function createNewPost(savedNote) {
    $.ajax({
      url: "/savedArticles/" + noteLinkId,
      data: JSON.stringify(savedNote),
      type: "POST",
      dataType: "json",
      contentType: "application/json"
    }).then(function (data) {
      $("#noteBody").val("");
      getSavedNotes(noteLinkId);
    })
  }
});



