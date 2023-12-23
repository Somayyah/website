document.addEventListener('DOMContentLoaded', ready);

const THEME_PREF_STORAGE_KEY = "theme-preference";
const THEME_TO_ICON_CLASS = {
    'dark': 'feather-moon',
    'light': 'feather-sun'
};
const THEME_TO_ICON_TEXT_CLASS = {
    'dark': 'Dark mode',
    'light': 'Light mode'
};
const HEADING_TO_TOC_CLASS = {
    'H1': 'level-1',
    'H2': 'level-2',
    'H3': 'level-3',
    'H4': 'level-4'
};

function ready() {
    feather.replace({ 'stroke-width': 1, width: 20, height: 20 });
    setThemeByUserPref();
    handlePostContent();
    handleSVGInjection();
    handleHamburgerMenuToggle();
}

function handlePostContent() {
    const contentContainer = document.querySelector('main#content > .container');
    if (contentContainer && contentContainer.classList.contains('post')) {
        const tocElement = document.getElementById('TableOfContents');
        if (tocElement) {
            fixTocItemsIndent();
            addSmoothScroll();
            createScrollSpy();
        } else {
            contentContainer.style.display = "block";
        }
    }
}

function handleSVGInjection() {
    const svgsToInject = document.querySelectorAll('img.svg-inject');
    SVGInjector(svgsToInject);
}

function handleHamburgerMenuToggle() {
    const hamburgerMenuToggle = document.getElementById('hamburger-menu-toggle');
    hamburgerMenuToggle.addEventListener('click', () => {
        const hamburgerMenu = document.querySelector('.nav-hamburger-list');
        hamburgerMenu.classList.toggle('visibility-hidden');
    });
}

window.addEventListener('scroll', debounce(() => {
    const scrollYThreshold = window.innerWidth <= 820 ? 50 : 100;
    toggleHeaderShadow(scrollYThreshold);
}, 100));

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

function fixTocItemsIndent() {
    document.querySelectorAll('#TableOfContents a').forEach($tocItem => {
      const itemId = $tocItem.getAttribute("href").substring(1);
      $tocItem.classList.add(HEADING_TO_TOC_CLASS[document.getElementById(itemId).tagName]);
    });
}

function addSmoothScroll() {
    document.querySelectorAll('#TableOfContents a').forEach($anchor => {
        $anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.getElementById(this.getAttribute('href').substring(1)).scrollIntoView({
                behavior: 'smooth',
                block: 'start' //scroll to top of the target element
            });
        });
    });
}

function createScrollSpy() {
    var elements = document.querySelectorAll('#TableOfContents a');
    document.addEventListener('scroll', function () {
        elements.forEach(function (element) {
          const boundingRect = document.getElementById(element.getAttribute('href').substring(1)).getBoundingClientRect();
          if (boundingRect.top <= 55 && boundingRect.bottom >= 0) {
            elements.forEach(function (elem) {
              elem.classList.remove('active');
            });
            element.classList.add('active');
          }
        });
    });
}

function toggleHeaderShadow(scrollY) {
    const headerElements = document.querySelectorAll('.header');
    headerElements.forEach(function(item) {
        if (window.scrollY > scrollY) {
            item.classList.add('header-shadow');
        } else {
            item.classList.remove('header-shadow');
        }
    });
}

function setThemeByUserPref() {
    let darkThemeCss = document.getElementById("dark-theme");
    const savedTheme = localStorage.getItem(THEME_PREF_STORAGE_KEY) ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark': 'light');
    const darkThemeToggles = document.querySelectorAll('.dark-theme-toggle');
    setTheme(savedTheme, darkThemeToggles);
    darkThemeToggles.forEach(el => el.addEventListener('click', toggleTheme, {capture: true}))
}

function toggleTheme(event) {
    let toggleIcon = event.currentTarget.querySelector("a svg.feather");
    if (toggleIcon.classList.contains(THEME_TO_ICON_CLASS.dark)) {
        setTheme('light', [event.currentTarget]);
    } else if (toggleIcon.classList.contains(THEME_TO_ICON_CLASS.light)) {
        setTheme('dark', [event.currentTarget]);
    }
}

function setTheme(themeToSet, targets) {
    localStorage.setItem(THEME_PREF_STORAGE_KEY, themeToSet);
    let darkThemeCss = document.getElementById("dark-theme");
    darkThemeCss.disabled = themeToSet === 'light';
    targets.forEach((target) => {
        target.querySelector('a').innerHTML = feather.icons[THEME_TO_ICON_CLASS[themeToSet].split('-')[1]].toSvg();
        target.querySelector("#dark-theme-toggle-screen-reader-target").textContent = THEME_TO_ICON_TEXT_CLASS[themeToSet];
    });
}
