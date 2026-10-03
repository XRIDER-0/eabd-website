// =========================
// EABD WEBSITE JAVASCRIPT
// =========================


// =========================
// DOM ELEMENTS
// =========================

const body = document.body;

const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const navbar = document.querySelector(".navbar");


// =========================
// MOBILE MENU
// =========================

function openMobileMenu() {
    if (!navLinks || !menuBtn) {
        return;
    }

    navLinks.classList.add("active");

    menuBtn.setAttribute("aria-expanded", "true");
    menuBtn.setAttribute("aria-label", "Close navigation menu");

    const firstNavItem = navLinks.querySelector("a");

    if (firstNavItem) {
        firstNavItem.focus();
    }
}


function closeMobileMenu() {
    if (!navLinks || !menuBtn) {
        return;
    }

    navLinks.classList.remove("active");

    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open navigation menu");
}


function toggleMobileMenu() {
    if (!navLinks) {
        return;
    }

    const isOpen = navLinks.classList.contains("active");

    if (isOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}


if (menuBtn) {
    menuBtn.addEventListener("click", toggleMobileMenu);
}


navItems.forEach((item) => {

    item.addEventListener("click", () => {
        closeMobileMenu();
    });

});


// =========================
// MOBILE MENU KEYBOARD
// =========================

document.addEventListener("keydown", (event) => {

    if (event.key !== "Escape") {
        return;
    }

    if (navLinks?.classList.contains("active")) {
        closeMobileMenu();

        if (menuBtn) {
            menuBtn.focus();
        }
    }

});


// =========================
// NAVBAR SCROLL EFFECT
// =========================

function handleNavbarScroll() {

    if (!navbar) {
        return;
    }

    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }

}


window.addEventListener("scroll", handleNavbarScroll);

handleNavbarScroll();


// =========================
// ACCESSIBILITY HUB ELEMENTS
// =========================

const accessibilityToggle =
    document.getElementById("accessibilityToggle");

const accessibilityPanel =
    document.getElementById("accessibilityPanel");

const accessibilityClose =
    document.getElementById("accessibilityClose");

const accessibilityOverlay =
    document.getElementById("accessibilityOverlay");

const accessibilityStatus =
    document.getElementById("accessibilityStatus");

const accessibilityReset =
    document.getElementById("accessibilityReset");


// =========================
// ACCESSIBILITY STORAGE
// =========================

const accessibilityStorageKey =
    "eabdAccessibilitySettings";


const defaultAccessibilitySettings = {

    textSize: "normal",

    spacing: false,

    contrast: false,

    darkMode: false,

    focus: false,

    motion: false

};


let accessibilitySettings = {
    ...defaultAccessibilitySettings
};


// =========================
// LOAD SAVED SETTINGS
// =========================

function loadAccessibilitySettings() {

    try {

        const savedSettings =
            localStorage.getItem(
                accessibilityStorageKey
            );


        if (!savedSettings) {
            return;
        }


        const parsedSettings =
            JSON.parse(savedSettings);


        if (
            parsedSettings &&
            typeof parsedSettings === "object"
        ) {

            accessibilitySettings = {

                ...defaultAccessibilitySettings,

                ...parsedSettings

            };

        }


    } catch (error) {

        console.warn(
            "Could not load accessibility settings.",
            error
        );

        accessibilitySettings = {
            ...defaultAccessibilitySettings
        };

    }

}


loadAccessibilitySettings();


// =========================
// SAVE ACCESSIBILITY SETTINGS
// =========================

function saveAccessibilitySettings() {

    try {

        localStorage.setItem(

            accessibilityStorageKey,

            JSON.stringify(
                accessibilitySettings
            )

        );

    } catch (error) {

        console.warn(
            "Could not save accessibility settings.",
            error
        );

    }

}


// =========================
// ACCESSIBILITY STATUS MESSAGE
// =========================

function announceAccessibility(message) {

    if (!accessibilityStatus) {
        return;
    }


    accessibilityStatus.textContent = message;

}


// =========================
// OPEN ACCESSIBILITY PANEL
// =========================

function openAccessibilityPanel() {

    if (!accessibilityPanel) {
        return;
    }


    closeMobileMenu();


    accessibilityPanel.classList.add("active");

    accessibilityPanel.setAttribute(
        "aria-hidden",
        "false"
    );


    if (accessibilityOverlay) {

        accessibilityOverlay.classList.add(
            "active"
        );

        accessibilityOverlay.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    if (accessibilityToggle) {

        accessibilityToggle.setAttribute(
            "aria-expanded",
            "true"
        );

    }


    body.style.overflow = "hidden";


    if (accessibilityClose) {
        accessibilityClose.focus();
    }


    announceAccessibility(
        "Accessibility settings opened."
    );

}


// =========================
// CLOSE ACCESSIBILITY PANEL
// =========================

function closeAccessibilityPanel() {

    if (!accessibilityPanel) {
        return;
    }


    accessibilityPanel.classList.remove(
        "active"
    );


    accessibilityPanel.setAttribute(
        "aria-hidden",
        "true"
    );


    if (accessibilityOverlay) {

        accessibilityOverlay.classList.remove(
            "active"
        );

        accessibilityOverlay.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    if (accessibilityToggle) {

        accessibilityToggle.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    body.style.overflow = "";


    if (accessibilityToggle) {
        accessibilityToggle.focus();
    }

}


// =========================
// ACCESSIBILITY BUTTON
// =========================

if (accessibilityToggle) {

    accessibilityToggle.addEventListener(
        "click",
        () => {

            const isOpen =
                accessibilityPanel?.classList.contains(
                    "active"
                );


            if (isOpen) {

                closeAccessibilityPanel();

            } else {

                openAccessibilityPanel();

            }

        }
    );

}


// =========================
// CLOSE BUTTON
// =========================

if (accessibilityClose) {

    accessibilityClose.addEventListener(
        "click",
        closeAccessibilityPanel
    );

}


// =========================
// OVERLAY CLICK
// =========================

if (accessibilityOverlay) {

    accessibilityOverlay.addEventListener(
        "click",
        closeAccessibilityPanel
    );

}


// =========================
// ESCAPE KEY
// =========================

document.addEventListener(
    "keydown",
    (event) => {

        if (event.key !== "Escape") {
            return;
        }


        if (
            accessibilityPanel?.classList.contains(
                "active"
            )
        ) {

            closeAccessibilityPanel();

        }

    }
);


// =========================
// APPLY ACCESSIBILITY SETTINGS
// =========================

function applyAccessibilitySettings() {

    body.classList.remove(

        "accessibility-large-text",

        "accessibility-xl-text",

        "accessibility-spacing",

        "accessibility-high-contrast",

        "accessibility-dark-mode",

        "accessibility-focus-mode",

        "accessibility-reduced-motion"

    );


    // =========================
    // TEXT SIZE
    // =========================

    if (
        accessibilitySettings.textSize ===
        "large"
    ) {

        body.classList.add(
            "accessibility-large-text"
        );

    }


    if (
        accessibilitySettings.textSize ===
        "xl"
    ) {

        body.classList.add(
            "accessibility-xl-text"
        );

    }


    // =========================
    // READING SPACING
    // =========================

    if (
        accessibilitySettings.spacing
    ) {

        body.classList.add(
            "accessibility-spacing"
        );

    }


    // =========================
    // HIGH CONTRAST
    // =========================

    if (
        accessibilitySettings.contrast
    ) {

        body.classList.add(
            "accessibility-high-contrast"
        );

    }


    // =========================
    // DARK MODE
    // =========================

    if (
        accessibilitySettings.darkMode
    ) {

        body.classList.add(
            "accessibility-dark-mode"
        );

    }


    // =========================
    // FOCUS MODE
    // =========================

    if (
        accessibilitySettings.focus
    ) {

        body.classList.add(
            "accessibility-focus-mode"
        );

    }


    // =========================
    // REDUCED MOTION
    // =========================

    if (
        accessibilitySettings.motion
    ) {

        body.classList.add(
            "accessibility-reduced-motion"
        );

    }


    updateAccessibilityButtons();

}


// =========================
// UPDATE ACCESSIBILITY BUTTONS
// =========================

function updateAccessibilityButtons() {

    // =========================
    // TEXT SIZE BUTTONS
    // =========================

    const textSizeButtons =
        document.querySelectorAll(
            "[data-text-size]"
        );


    textSizeButtons.forEach(
        (button) => {

            const isActive =
                button.dataset.textSize ===
                accessibilitySettings.textSize;


            button.classList.toggle(
                "active",
                isActive
            );


            button.setAttribute(
                "aria-pressed",
                isActive
                    ? "true"
                    : "false"
            );

        }
    );


    // =========================
    // TOGGLE BUTTONS
    // =========================

    const toggleStates = {

        spacingToggle:
            accessibilitySettings.spacing,

        contrastToggle:
            accessibilitySettings.contrast,

        darkModeToggle:
            accessibilitySettings.darkMode,

        focusToggle:
            accessibilitySettings.focus,

        motionToggle:
            accessibilitySettings.motion

    };


    Object.entries(toggleStates)
        .forEach(
            ([id, isActive]) => {

                const button =
                    document.getElementById(id);


                if (!button) {
                    return;
                }


                button.classList.toggle(
                    "active",
                    isActive
                );


                button.setAttribute(
                    "aria-pressed",
                    isActive
                        ? "true"
                        : "false"
                );


                // =========================
                // ON / OFF STATUS
                // =========================

                const status =
                    button.querySelector(
                        ".toggle-status"
                    );


                if (status) {

                    status.textContent =
                        isActive
                            ? "ON"
                            : "OFF";

                }

            }
        );

}


// =========================
// TEXT SIZE CONTROLS
// =========================

const textSizeButtons =
    document.querySelectorAll(
        "[data-text-size]"
    );


textSizeButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                const selectedSize =
                    button.dataset.textSize ||
                    "normal";


                accessibilitySettings.textSize =
                    selectedSize;


                applyAccessibilitySettings();

                saveAccessibilitySettings();


                const sizeNames = {

                    normal: "Normal",

                    large: "Large",

                    xl: "Extra large"

                };


                announceAccessibility(

                    `${sizeNames[selectedSize]} text size enabled.`

                );

            }
        );

    }
);


// =========================
// ACCESSIBILITY TOGGLE SETUP
// =========================

function setupAccessibilityToggle(
    id,
    settingName,
    enabledMessage,
    disabledMessage
) {

    const button =
        document.getElementById(id);


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            accessibilitySettings[
                settingName
            ] =
                !accessibilitySettings[
                    settingName
                ];


            const isActive =
                accessibilitySettings[
                    settingName
                ];


            applyAccessibilitySettings();

            saveAccessibilitySettings();


            announceAccessibility(

                isActive
                    ? enabledMessage
                    : disabledMessage

            );

        }
    );

}


// =========================
// SET UP TOGGLES
// =========================

setupAccessibilityToggle(

    "spacingToggle",

    "spacing",

    "Reading spacing enabled.",

    "Reading spacing disabled."

);


setupAccessibilityToggle(

    "contrastToggle",

    "contrast",

    "High contrast enabled.",

    "High contrast disabled."

);


setupAccessibilityToggle(

    "darkModeToggle",

    "darkMode",

    "Dark mode enabled.",

    "Dark mode disabled."

);


setupAccessibilityToggle(

    "focusToggle",

    "focus",

    "Focus mode enabled.",

    "Focus mode disabled."

);


setupAccessibilityToggle(

    "motionToggle",

    "motion",

    "Reduced motion enabled.",

    "Reduced motion disabled."

);


// =========================
// READ ALOUD
// =========================

const readAloudToggle =
    document.getElementById(
        "readAloudToggle"
    );


let isReadingAloud = false;


// =========================
// GET READABLE PAGE CONTENT
// =========================

function getReadablePageContent() {

    const mainContent =
        document.querySelector("main");


    if (!mainContent) {

        return document.body.innerText
            .replace(/\s+/g, " ")
            .trim();

    }


    const clonedContent =
        mainContent.cloneNode(true);


    const elementsToRemove =
        clonedContent.querySelectorAll(

            "script, style, button, input, select, textarea, nav, aside"

        );


    elementsToRemove.forEach(
        (element) => {
            element.remove();
        }
    );


    return clonedContent.innerText
        .replace(/\s+/g, " ")
        .trim();

}


// =========================
// UPDATE READ ALOUD BUTTON
// =========================

function updateReadAloudButton() {

    if (!readAloudToggle) {
        return;
    }


    const status =
        readAloudToggle.querySelector(
            ".read-aloud-status"
        );


    if (isReadingAloud) {

        readAloudToggle.classList.add(
            "active"
        );


        readAloudToggle.setAttribute(
            "aria-pressed",
            "true"
        );


        readAloudToggle.setAttribute(
            "aria-label",
            "Stop reading page aloud"
        );


        if (status) {
            status.textContent = "Reading";
        }


    } else {

        readAloudToggle.classList.remove(
            "active"
        );


        readAloudToggle.setAttribute(
            "aria-pressed",
            "false"
        );


        readAloudToggle.setAttribute(
            "aria-label",
            "Start reading page aloud"
        );


        if (status) {
            status.textContent = "Ready";
        }

    }

}


// =========================
// STOP READING
// =========================

function stopReading() {

    if (
        "speechSynthesis" in window
    ) {

        window.speechSynthesis.cancel();

    }


    isReadingAloud = false;

    updateReadAloudButton();


    announceAccessibility(
        "Read Aloud stopped."
    );

}


// =========================
// START READING
// =========================

function startReading() {

    if (
        !("speechSynthesis" in window)
    ) {

        announceAccessibility(
            "Read Aloud is not supported by this browser."
        );


        alert(
            "Read Aloud is not supported by this browser. Please try a modern browser such as Chrome, Edge, Firefox, or Safari."
        );


        return;

    }


    const text =
        getReadablePageContent();


    if (!text) {

        announceAccessibility(
            "There is no page content available to read."
        );


        return;

    }


    window.speechSynthesis.cancel();


    const speech =
        new SpeechSynthesisUtterance(text);


    speech.rate = 0.95;

    speech.pitch = 1;

    speech.volume = 1;


    speech.onstart = () => {

        isReadingAloud = true;

        updateReadAloudButton();

        announceAccessibility(
            "Reading page content aloud."
        );

    };


    speech.onend = () => {

        isReadingAloud = false;

        updateReadAloudButton();

        announceAccessibility(
            "Read Aloud finished."
        );

    };


    speech.onerror = () => {

        isReadingAloud = false;

        updateReadAloudButton();

        announceAccessibility(
            "Read Aloud could not complete."
        );

    };


    window.speechSynthesis.speak(
        speech
    );

}


// =========================
// READ ALOUD BUTTON
// =========================

if (readAloudToggle) {

    readAloudToggle.addEventListener(
        "click",
        () => {

            if (isReadingAloud) {

                stopReading();

            } else {

                startReading();

            }

        }
    );

}


// =========================
// STOP SPEECH WHEN LEAVING PAGE
// =========================

window.addEventListener(
    "beforeunload",
    () => {

        if (
            "speechSynthesis" in window
        ) {

            window.speechSynthesis.cancel();

        }

    }
);


// =========================
// RESET ACCESSIBILITY
// =========================

if (accessibilityReset) {

    accessibilityReset.addEventListener(
        "click",
        () => {

            stopReading();


            accessibilitySettings = {
                ...defaultAccessibilitySettings
            };


            applyAccessibilitySettings();

            saveAccessibilitySettings();


            announceAccessibility(
                "Accessibility settings have been reset."
            );

        }
    );

}


// =========================
// CLOSE PANELS WHEN RESIZING
// =========================

window.addEventListener(
    "resize",
    () => {

        if (
            window.innerWidth > 900 &&
            navLinks?.classList.contains(
                "active"
            )
        ) {

            closeMobileMenu();

        }

    }
);


// =========================
// INITIALISE ACCESSIBILITY
// =========================

applyAccessibilitySettings();

updateReadAloudButton();


// =========================
// INITIAL PAGE STATE
// =========================

if (accessibilityPanel) {

    accessibilityPanel.setAttribute(
        "aria-hidden",
        "true"
    );

}


if (accessibilityOverlay) {

    accessibilityOverlay.setAttribute(
        "aria-hidden",
        "true"
    );

}


if (accessibilityToggle) {

    accessibilityToggle.setAttribute(
        "aria-expanded",
        "false"
    );

}


// =========================
// EABD WEBSITE READY
// =========================

console.log(
    "EABD website is ready!"
);