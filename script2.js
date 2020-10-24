
setInterval(getBearing, 10000);
var arrowDiv = $('.arrow-div');

function getBearing(){
    $.get("http://localhost:3000/", function(data) {
    console.log(data);
    var bearing = parseFloat(data);
    $({rotation: 0}).animate({rotation: bearing}, {
        duration: 2000,
        easing: 'linear',
        step: function () {
            arrowDiv.css({transform: 'rotate(' + this.rotation+ 'deg)'});
        }
    });
  });
}



