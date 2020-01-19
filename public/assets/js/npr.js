$(document).ready(function () {
  var noteLinkId = "";

  $(".scrape-articles").on("click", function () {

    $.get("/scrape", function (res) {


      window.location.reload();
    });



  })
  $(".saveArticleButton").on("click", function () {
    console.log($(this).attr("data-title"))
    console.log($(this).attr("data-summary"))
    console.log($(this).attr("data-link"))

    var articleObject = {
      title: $(this).attr("data-title"),
      summary: $(this).attr("data-summary"),
      link: $(this).attr("data-link"),
      id: $(this).attr("data-id")
    }
    console.log(articleObject)
    postingSavedArticle(articleObject);

  });


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

  $(".clearArticles").on("click", function () {

    $.ajax({
      url: "/articles",
      type: 'DELETE',
    }).then(function (data) {
      window.location.reload();
    })
  });

  $(".addNote").on("click", function () {
    $("#articleNotesModal").modal("show");
    noteLinkId = $(this).attr("data-id")
    console.log(noteLinkId);
    getSavedNotes(noteLinkId);



  });
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
      for (var i = 0; i < noteArray.length; i++) {
        console.log(noteArray[i].body);
        var cards = $("<div>").addClass("card p-3 m-3").append(

          $("<div>").addClass("card-text pt-3").text(noteArray[i].body),
          $("<button>").attr("data-id", noteArray[i]._id).addClass("deleteNote").text("Delete Note")

        );
      }
      $(".prevPostedNotes").append(cards);

    });

  }
$(".deleteNote").on("click", function(){
console.log("inside on click for delete");
var noteToDelete = $(this).attr("data-id");
noteToBeDeleted(noteToDelete);

})
function noteToBeDeleted(idForNote){

  $.ajax({
    url: "/notes/" + idForNote,
    type: 'DELETE',
  }).then(function (data) {
    window.location.reload();
  })



}
  
  $(".postNewNote").on("click", function () {
    var postBody = $("#noteBody").val()
    console.log(noteLinkId);
    var newNote = {
      body: postBody
    }
    createNewPost(newNote)
    $("#noteBody").empty();
  });
  function createNewPost(savedNote) {
    console.log(JSON.stringify(savedNote));
    $.ajax({
      url: "/savedArticles/" + noteLinkId,
      data: JSON.stringify(savedNote),
      type: "POST",
      dataType: "json",
      contentType: "application/json"
    }).then(function (data) {
      console.log("npr.js line 125" + data);

      $("#noteBody").val("");
      getSavedNotes(noteLinkId);
    })
  }
});



