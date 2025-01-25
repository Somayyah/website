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
