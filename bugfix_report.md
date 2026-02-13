# Bug Fix: Navbar Dropdown and Responsive Consistency

## Issues Identified
1.  **Breakpoint Mismatch**: The navbar was configured to expand at the `xl` breakpoint (1200px), but the mobile toggler button used `d-lg-none` (hidden at 992px). This caused the navigation menu to be unreachable between 992px and 1200px.
2.  **Logic Inconsistency**: The Javascript logic in `components.js` used a 992px threshold for mobile-specific behaviors (like closing the menu on link click), creating a mismatch with the actual 1200px collapse point.
3.  **Event Conflicts**: Redundant manual initialization of Bootstrap Dropdowns in `components.js` could conflict with the native `data-bs-toggle` handlers, causing erratic behavior on click.
4.  **Missing Safety Checks**: Potential race conditions where the navbar logic might run before the Bootstrap library is fully loaded.

## Changes Made
-   **`components/navbar.html`**:
    -   Changed navbar toggler visibility from `d-lg-none` to `d-xl-none` to correctly match the 1200px expansion point.
-   **`components.js`**:
    -   Updated all responsive checks from `992` to `1200`.
    -   Removed redundant manual `bootstrap.Dropdown` initialization.
    -   Wrapped Bootstrap-dependent logic in `if (typeof bootstrap !== 'undefined')` safety checks.
    -   Improved dropdown hover and close logic for better reliability on desktop resolutions (>= 1200px).

## Verification
-   The navbar will now correctly show the mobile toggler whenever the menu is collapsed (up to 1200px).
-   Dropdowns will behave consistently at 1440px and other desktop resolutions, correctly responding to both hover and click events.
-   The "dead zone" between 992px and 1200px is eliminated.
