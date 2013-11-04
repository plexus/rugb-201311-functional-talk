(function ( document, window ) {
    document.addEventListener("impress:init", function (event) {
        document.addEventListener("impress:stepenter", function (event) {
            var step = $(event.target);
            if (console.clear) { console.clear(); }
            console.log(step.attr('id'));
            console.log(step.find('.notes').text());
        }, false);
    });

    // Prevent default keydown action when one of supported key is pressed.
    document.addEventListener("keydown", function ( event ) {
      if ( event.keyCode === 48) { //0
        event.preventDefault();
        impress().goto(0);
      }
    }, false);
})(document, window);
