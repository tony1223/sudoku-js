/**
 * utils.js
 * The utils for change default js object behavior
 * @return
 */
String.prototype.ltrim = function() {
    return this.replace(/^\s+/,"");
}