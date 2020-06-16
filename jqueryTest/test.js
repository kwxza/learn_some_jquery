$(function() {
  // Testing area for jQuery code examples.

  /*
    Selecting every link on the page that
    links to an outside location - 
    ie. every &lt;a&gt; element that does NOT 
    have an href attribute beginning with '#'.

    Then, reducing the collection to a jQuery
    object containing the first element only
    and logging its .jquery property.
  */
  const linksToOutside = $('a:not(a[href^="#"])');
});
