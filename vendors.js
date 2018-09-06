// set caret position taken from https://stackoverflow.com/questions/499126/jquery-set-cursor-position-in-text-area
function _vendors_setSelectionRange(input, selectionStart, selectionEnd) {
  if (input.setSelectionRange) {
    input.focus();
    input.setSelectionRange(selectionStart, selectionEnd);
  }
  else if (input.createTextRange) {
    var range = input.createTextRange();
    range.collapse(true);
    range.moveEnd('character', selectionEnd);
    range.moveStart('character', selectionStart);
    range.select();
  }
}

function _vendors_setCaretToPos (input, pos) {
  _vendors_setSelectionRange(input, pos, pos);
}
