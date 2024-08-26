const toggleSwitches = document.querySelectorAll('.toggleSwitch');
const body = document.body;
const savedTheme = localStorage.getItem('theme');

// Apply the saved theme and set the toggle switches' position based on savedTheme
function applySavedTheme() {
    if (savedTheme) {
        body.classList.add(savedTheme);
    }
    toggleSwitches.forEach((button) => {
        button.checked = savedTheme === 'dark-mode';
    });
}

// Theme toggle function
export function themeToggle() {
    toggleSwitches.forEach((button) => {
        button.addEventListener('change', () => {
            if (button.checked) {
                body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark-mode');
            } else {
                body.classList.remove('dark-mode');
                localStorage.setItem('theme', '');
            }

            // Synchronize the state of all toggle switches
            toggleSwitches.forEach((switchElement) => {
                switchElement.checked = body.classList.contains('dark-mode');
            });
        });
    });
}

// Initialize theme and toggle switches
applySavedTheme();
themeToggle();
