# Update Authentication Pages Styles - 2026-01-24

## Task
Update the Login.tsx, Signup.tsx, and ForgotPassword.tsx components to match the application style shown in the reference images.

## Current State
The Login.tsx component exists at `src/pages/login/Login.tsx` with:
- White card with shadow and rounded corners
- Basic email/password input fields
- Indigo button for login
- Links for registration and forgot password
- Background with flex centering

## Design Requirements (from reference image)
- Dark background (appears to be #2d2d2d or similar dark gray)
- Centered white card with rounded corners
- Input fields with light gray backgrounds (no visible borders in normal state)
- Purple/blue button labeled "Accedi"
- Two centered links below the button: "Registrati" and "Hai dimenticato la password?"
- Clean, minimal design with good spacing

## Implementation Plan

### Changes to Login.tsx
1. **Background**: Update container background to dark gray (`bg-[#2d2d2d]` or `bg-gray-800`)
2. **Card styling**: Maintain white card with rounded corners and shadow
3. **Input fields**:
   - Add light gray background (`bg-gray-100` or similar)
   - Remove visible borders or use subtle borders
   - Add proper padding for better visual appearance
   - Ensure proper spacing between fields
4. **Button styling**:
   - Keep the indigo/purple color scheme
   - Ensure proper hover and disabled states
5. **Links**:
   - Center align the links
   - Use indigo color matching the button
   - Proper spacing between links

### Affected Files
- `src/pages/login/Login.tsx` - Login component updated ✓
- `src/pages/signup/Signup.tsx` - Signup component updated ✓
- `src/pages/forgotPassword/ForgotPassword.tsx` - Forgot password component updated ✓

### Styling Approach
- Use only Tailwind CSS utility classes (per CLAUDE.md requirements)
- No CSS modules, no inline styles
- Maintain responsive design with proper mobile support

## Technical Notes
- The component already uses `signInWithEmail` from AuthProvider
- Navigation to signup and forgot password routes already implemented
- Error handling already in place
- Loading state already implemented

## Post-Implementation
All authentication pages (Login, Signup, and ForgotPassword) now have a modern, clean design matching the reference images. All changes implemented:

- Dark gray background (#2d2d2d) across all auth pages
- Consistent card styling with proper padding (p-8)
- Input fields with visible text (text-gray-900) and placeholder text (text-gray-500)
- Enhanced button states (hover, disabled) with smooth transitions
- Simplified link layout - removed redundant text, showing only essential links
- All existing functionality maintained (authentication, error handling, loading states, navigation, success messages)
