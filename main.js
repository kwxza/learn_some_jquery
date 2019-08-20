/*
  Putting necessary DOM elements
  into named variables for later use.
*/
// Variables for menu scripting
const menuToggle = document.querySelector('#menu-toggle');
const menuLinks = document.querySelectorAll('.nav-link');
const { classList: menuIconClass } = document.querySelector('#menu-icon');
const { classList: menuClasses } = document.querySelector('#menu-list');
const mainSection = document.querySelector('#main-doc');
// Variables for theme scripting
const themeToggle = document.querySelector('#theme-toggle');
const themeText = document.querySelector('#theme-text');
const { classList: themeClass } = document.querySelector('body');
const { classList: themeIconClass } = document.querySelector('#theme-icon');
// Variables for scroll scripting
const sections = document.querySelectorAll('section');
const menuTitle = document.querySelector('#menu-header h1');
const { innerText: initialTitle } = menuTitle;

/*
  Calling functions that handle events for
  menu animation, theme changes, and
  window scrolling.
*/
menuEvents();
themeEvents();
windowEvents();

/* 
  Function Definitions 
*/
function menuEvents() {
  /*
    Toggle menu visibility on menu button click
    (for smaller screens only). 
    Click events are disabled in the CSS via 
    the pointer-events property for screen 
    sizes above 1000px.
  */
  menuToggle.addEventListener('click', () => {
    // Change menu icon orientation to point up/down
    menuIconClass.toggle('open');
    /*
      There are initally no classes on the 
      #menu-list element when the page first
      loads. This is because the classes animate 
      the opening/closing of the menu, which is 
      unnecessary at screen sizes where the 
      menu is always visible. On larger screen
      sizes, these classes are never applied.

      On some devices, the animation classes will
      be removed when the device is in landscape
      mode and then reapplied when turned back to
      portrait mode. Thus, checking for an empty
      set of classes is necessary.
    */
    if (menuClasses == '') {
      return menuClasses.add('show');
    } else {
      return menuClasses.contains('show')
        ? menuClasses.replace('show', 'hide')
        : menuClasses.replace('hide', 'show');
    }
  });

  // Close menu once an item has been clicked
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuIconClass.toggle('open');
      menuClasses.replace('show', 'hide');
    });
  });

  // Close menu if user clicks outside of
  // menu without clicking a menu item
  mainSection.addEventListener('click', () => {
    if (menuClasses.contains('show')) {
      menuIconClass.toggle('open');
      menuClasses.replace('show', 'hide');
    }
  });
}

function themeEvents() {
  // Toggle between light/dark theme on theme
  // button click and set icon & text of button
  themeToggle.addEventListener('click', function() {
    // Change icon when toggling between themes
    if (themeClass.toggle('dark')) {
      themeIconClass.replace('fa-sun', 'fa-moon');
    } else {
      themeIconClass.replace('fa-moon', 'fa-sun');
    }
    // Change button text if displayed
    // (only for larger screens)
    if (this.innerText !== '') {
      themeText.innerText = themeClass.contains('dark')
        ? 'Night Mode'
        : 'Light Mode';
    }
  });
}

function windowEvents() {
  /*
    Disable menu styles/animations that
    interfere with fixed menu styling when
    switching between smaller and larger
    screen sizes.
    This is to accomodate the different
    styles that a mobile phone user might
    see depending on if they are using their
    device in landscape vs portrait mode.
  */
  window.onresize = () => {
    if (window.innerWidth >= 700) {
      menuClasses.remove('show');
      menuClasses.remove('hide');
      menuIconClass.remove('open');
      menuTitle.innerText = initialTitle;
    }
  };

  /*
    Highlight appropriate menu link when
    window is scrolled to corresponding
    page section and change navbar header to
    match if screen size is less than 700px,
    i.e - when menu items are not always visible.
  */
  window.onscroll = () => {
    updateAfterScroll();
    /*
      The logic in this function requires a small
      interval to pass before it can work correctly,
      hence the setTimeout() wrapper around the 
      actual function logic.

      The reason for this is because when a scroll event
      occurs, the window.pageYOffset property is compared
      to each page section's offsetTop property to
      determine if the section is currently within view.

      When a user clicks a menu link, the scroll event
      fires immediately, allowing the pageYOffset property
      to be read before scrolling has actually happened
      in the browser. 
      
      Reading the window's pageYOffset value immediately 
      returns the scroll position at the time the menu link 
      was clicked, as opposed to the scroll position of the 
      page section that the menu link navigates towards. 
      
      Reading the pageYOffset value after a small interval
      returns the desired value, hence the use of setTimeout().
    */
    function updateAfterScroll() {
      window.setTimeout(() => {
        sections.forEach(section => {
          let scrolledDistance = window.pageYOffset;
          // Destructuring properties from section
          let {
            id,
            classList,
            offsetTop: sectionStart,
            offsetHeight: sectionLength
          } = section;

          /*
            Logic of conditional expression:
              @param scrolledDistance
              @param sectionStart
              @param sectionLength

              If the distance that the document has been
              scrolled (scrolledDistance) is greater than 
              the distance between the top of the document 
              and the beginning of the section (sectionStart)
            **AND**
              the distance to the bottom of the section 
              (sectionStart + sectionLength) is 
              still greater than the amount that the 
              document has been scrolled:
                --> This means that the section is currently
                    in view and so its corresponding menu
                    link should be highlighted as well as 
                    changing the navbar header to the 
                    corresponding title (for smaller screens).
              
            **The window.pageYOffset property returns a value 
              in decimals while the HTMLElement.offsetTop and 
              offsetHeight properties return an integer.
              This causes an error in calculation if comparing 
              the values for equality to determine the scroll 
              position of the document.
                --> Comparisons within the range of the closest
                    integers to zero (-1 & 1) has turned out
                    to be more accurate for the desired purpose.
          */
          if (
            scrolledDistance - sectionStart >= -1 &&
            scrolledDistance - (sectionStart + sectionLength) < -1
          ) {
            // Highlighting appropriate menu link
            menuLinks.forEach(link => {
              if (link.getAttribute('href') === '#' + id) {
                /*
                  The .nav-link class is on the <a> element
                  within each navbar <li> element.
                  The styling is being applied to the <li>,
                  ie - the parent element.
                */
                const { parentElement: activeLink } = link;
                activeLink.classList.add('active-nav-link');
                /*
                  On larger-screen mobile devices, the menu
                  will stay open in landscape mode and will
                  be scrollable. The following code will
                  scroll the menu automatically if the
                  highlighted menu link is not visible.
                */
                const { top, bottom } = activeLink.getBoundingClientRect();
                if (top < 48) {
                  activeLink.scrollIntoView();
                }
                if (bottom > window.innerHeight) {
                  activeLink.scrollIntoView();
                }
              } else {
                link.parentElement.classList.remove('active-nav-link');
              }
            });
            /*
              Changing navbar header to match the section 
              title when the menu items are not visible
              ie - on small screens.
              Only the intro section (first page seen on
              page load) has a different nav header than
              its corresponding menu link.
            */
            if (window.innerWidth < 700) {
              menuTitle.innerText = classList.contains('intro-section')
                ? initialTitle
                : document.querySelector('#' + id + ' header h1').innerText;
            }
          }
        });
      }, 0.0000001);
    }
  };
}
