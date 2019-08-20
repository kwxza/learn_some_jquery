/*
    Script to change '<' and '>' tags into 
    compatible HTML entities so that they 
    show within the code blocks, as well as 
    correcting the browser lowercasing of 
    React component names.
*/

// Create a NodeList of all the code blocks
// from the HTML document.
const codeBlocks = document.querySelectorAll('code');

// Regex pattern to match the component names in a code block.
const nameRegex = /(?:\s*class\s)([a-zA-Z]+)(?=\s)/g;

// Iterating through each code block from NodeList.
codeBlocks.forEach(block => {
  // Copy block's innerHTML to new variable
  //   to make changes to it
  let newHTML = block.innerHTML;

  // Get the properly-cased name of
  // each component in the code block.
  const componentNames = [...newHTML.matchAll(nameRegex)].map(
    match => match[1]
  );

  // Get the properly-cased name of the main
  // component in the code block.
  //   const componentName = block.innerHTML.match(nameRegex)[1];

  componentNames.forEach(componentName => {
    //   Regex pattern to match the erroneous component start tag.
    const componentStartTag = new RegExp(
      '(<' + componentName + '[^>]*)(?=>)',
      'g'
    );
    // Regex pattern to match the erroneous component
    // ending tag generated by the browser.
    const componentEndTag = new RegExp('(</' + componentName + '>)', 'g');

    // Replacing all the lowercased instances of the
    // component name with the correct casing.
    newHTML = newHTML
      .replace(new RegExp(componentName, 'gi'), componentName)
      .replace(componentStartTag, newHTML.match(componentStartTag)[0] + ' /')
      .replace(componentEndTag, '');

    // Replacing all the incorrect component starting tags
    // with a self-closing ending - i.e. '/>'.
    // newHTML = newHTML.replace(
    //   componentStartTag,
    //   newHTML.match(componentStartTag)[0] + ' /'
    // );

    // Replacing all the incorrect component ending tags
    // with empty strings - i.e. deleting them.
    // newHTML = newHTML.replace(componentEndTag, '');
  });

  console.log(newHTML);

  // Replacing all instances of '<' with '&lt;',
  // excluding any instances of '<='.
  newHTML = newHTML.replace(/<(?!=)/g, '&lt;');

  // Replacing all instances of '>' with '&gt;',
  // excluding any instances of '>='.
  newHTML = newHTML.replace(/>(?!=)/g, '&gt;');

  //   console.log(newHTML);

  // Set innerHTML of block to updated newHTML
  block.innerHTML = newHTML;
});
