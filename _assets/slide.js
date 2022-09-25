$(function() {

    const BILDER = ["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","greeting.jpg"];
    
    for (let i = 0; i < BILDER.length; i++) {
    $("#container").append("<div><img src=\"./img/" + BILDER[i] + "\"></div>");
    }
    
    // $("#container > div").hide().first().show();
    // $("#container > div:gt(0)").hide();
    $("#container > div").slice(1).hide();
    
    $("#container").prepend("<a class=\"prev\"><</a>");
    $("#container").prepend("<a class=\"next\">></a>");
    
    $("h1").css({
    textAlign: "center",
    marginTop: "50px"
    });
    
    $("#container").css({
    width: "800px",
    height: "400px",
    margin: "20px auto 0",
    padding: "10px 10px 0",
    position: "relative",
    boxShadow: "0 -60px 100px rgba(0,0,0,.2)"
    });
    
    $(".next, .prev").css({
    background: "rgba(180,180,180,.75)",
    padding: "5px 10px",
    fontSize: "1.25rem",
    borderRadius: "50%",
    cursor: "pointer",
    position: "absolute",
    top: "48%",
    "z-index": 499
    });
    $(".next").css("right","20px");
    $(".prev").css("left","20px");
    
    $("#container > div").css({
    position: "absolute",
    top: "10px",
    left: "10px",
    right: "10px",
    bottom: 0
    });
    
    $("hr").css({
    maxWidth: "1000px",
    height: "2px",
    border: "none",
    backgroundImage: "linear-gradient(to right, rgba(180,180,180,0),rgba(180,180,180,1),rgba(180,180,180,0))",
    margin: "-1px auto 0"
    });
    
    $(".next").on("click", function() {
        $("#container > div")
        .first()
        .fadeOut(2000)
        .next()
        .fadeIn(2000)
        .prev()
    })

    $(".prev").on("click", function() {
        $("#container > div")
        .first()
        .fadeOut(500)
        .end()
        .last()
        .fadeIn(500)
        .prependTo("#container");
    })

    })