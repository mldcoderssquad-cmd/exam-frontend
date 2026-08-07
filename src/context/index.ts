export { AuthContext, AuthProvider, useAuthContext } from './AuthContext'

/**
 * NotificationContext, LoadingContext and ThemeContext are intentionally
 * NOT implemented here.
 *
 * There is no genuine shared/global state behind any of them in the current
 * project:
 *  - Notifications are rendered per-dashboard from fixed mock data via
 *    <NotificationList items={...} /> — there is no open/close, dismiss,
 *    or cross-screen notification state to lift into a context.
 *  - There is no app-wide loading/spinner state; `Spinner`/`Toast` loading
 *    states that exist are local to individual steps (e.g. StepProcessing)
 *    and are not shared across components.
 *  - There is no theme switching (dark mode, etc.) anywhere in the app —
 *    styling is a fixed design system, not a runtime-toggleable theme.
 *
 * Fabricating these contexts would mean inventing state that doesn't
 * exist, which the approved refactor explicitly rules out. If any of
 * this behavior is added to the product later, the corresponding
 * context can be introduced at that point.
 */
