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
        const iconElement = target.querySelector('a');
        if (themeToSet === 'dark') {
            // Use the moon SVG for dark theme
            iconElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-moon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
        } else {
            // Use the sun SVG for light theme
            iconElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sun"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
        }
        target.querySelector("#dark-theme-toggle-screen-reader-target").textContent = THEME_TO_ICON_TEXT_CLASS[themeToSet];
    });
}
