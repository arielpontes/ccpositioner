// Put the textarea content into the cue-text span
$('#cue-text').html($('#cue-textarea').val());

// Make this happen every time there's a change on the textarea
$('#cue-textarea').on('change keyup paste', function(){
  $('#cue-text').html($(this).val());
});

var videoWidth = $('#video-frame').width();
var videoHeight = $('#video-frame').height();

var cueBoxWidth = $('#cue-box').width();
var cueBoxHeight = $('#cue-box').height();

var xDefault = Math.round(100*(videoWidth - cueBoxWidth)/2)/100; // Middle
var yDefault = Math.round(100*(videoHeight - cueBoxHeight))/100; // Bottom

$('#cue-box').css('left', xDefault + 'px');
$('#cue-box').css('top', yDefault - 10 + 'px');

var xDiff;
var yDiff;

var xCurrent;
var yCurrent;

function updatePositioning(x, y){
  updatePositioningVariables(x, y);
  updatePositioningDisplay();
}

function updatePositioningVariables(x, y){
  xDiff = x;
  yDiff = y;

  xCurrent = xDefault + 2 + xDiff;
  yCurrent = yDefault + 2 + yDiff;
}

function updatePositioningDisplay(){
  // Update the px values
  $('#x').html(xCurrent);
  $('#y').html(yCurrent);
  $('#width').html($('#cue-box').width())
  var xPercentValue, yPercentValue;
  
  // Calculate the percentage values
  xPercentValue = Math.round(xCurrent*100*100/640)/100;
  yPercentValue = Math.round(yCurrent*100*100/360)/100;

  var position = '';
  var line = '';

  if(Math.round(xCurrent) != Math.round(xDefault))
    position = ' position:' + xPercentValue + '%,start';

  if(Math.round(yCurrent) != Math.round(yDefault))
    line = ' line:' + yPercentValue + '%';

  // Update the displayed percantage values
  $('#position').html(position);
  $('#line').html(line);
}

// target elements with the "draggable" class
interact('.draggable')
  .draggable({
    // Make sure inertial throwing is disabled
    inertia: false,
    // keep the element within the area of it's parent
    restrict: {
      restriction: "parent",
      endOnly: true,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },

    // call this function on every dragmove event
    onmove: dragMoveListener,
    // call this function on every dragend event
    onend: function (event) {
      var textEl = event.target.querySelector('p');

      textEl && (textEl.textContent =
        'moved a distance of '
        + (Math.sqrt(event.dx * event.dx +
                     event.dy * event.dy)|0) + 'px');
    }
  });

function dragMoveListener (event) {
  var target = event.target,
      // keep the dragged position in the data-x/data-y attributes
      x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
      y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  // translate the element
  target.style.webkitTransform =
  target.style.transform =
    'translate(' + x + 'px, ' + y + 'px)';

  // update the posiion attributes
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);

  updatePositioning(x, y);
}

// this is used later in the resizing demo
window.dragMoveListener = dragMoveListener;
  