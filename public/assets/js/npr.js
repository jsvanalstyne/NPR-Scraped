$(document).ready(function(){


$(".scrape-articles").on("click", function(){

$.get("/scrape", function(res){


window.location.reload();
});



})
$(".saveArticleButton").on("click", function(){
    console.log($(this).attr("data-title"))
    console.log($(this).attr("data-summary"))
    console.log($(this).attr("data-link"))

 var articleObject={
     title: $(this).attr("data-title"),
     summary: $(this).attr("data-summary"),
     link: $(this).attr("data-link"),
     id: $(this).attr("data-id")
 }
 console.log(articleObject)
postingSavedArticle(articleObject);

});


function postingSavedArticle(articleSaving){

// $.post("/savedArticle", articleSaving).then(function (data) {
//     console.log("saved");
//     window.location.reload();
// });
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

$(".deleteSaved").on("click", function(){

  var savedObject={
    title: $(this).attr("data-title"),
    summary: $(this).attr("data-summary"),
    link: $(this).attr("data-link"),
    id: $(this).attr("data-id")
}
console.log(savedObject);
deleteSavedArticle(savedObject);
});

function deleteSavedArticle(objectToDelete){
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

$(".clearArticles").on("click", function(){
  
  $.ajax({
    url: "articles",
    type: 'DELETE',
  }).then(function(data){
    window.location.reload();
  })
});

$(".addNote").on("click", function(){
 $("#articleNotesModal").modal("show");
});

});


// });
