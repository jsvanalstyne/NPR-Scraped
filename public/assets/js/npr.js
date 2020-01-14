$(document).ready(function(){


$("#scrape-articles").on("click", function(){

$.get("/scrape", function(res){


window.location.reload();
});



})
$(".saveArticleButton").on("click", function(){

$.post("/saved", function(req, res){


});

});




});
