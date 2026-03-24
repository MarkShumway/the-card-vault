import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from '../services/supabase'

// ─── Zod schemas ──────────────────────────────────────────────────────────────

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

const signUpSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
})

type LoginFormValues = z.infer<typeof loginSchema>
type SignUpFormValues = z.infer<typeof signUpSchema>

// ─── Features list ────────────────────────────────────────────────────────────

const FEATURES = [
    {
        icon: '🃏',
        title: 'Track your entire collection',
        desc: 'Log every card with player, year, brand, series, condition, and card number.',
    },
    {
        icon: '📈',
        title: 'Monitor value over time',
        desc: 'Track purchase price vs current value and see your profit and loss at a glance.',
    },
    {
        icon: '🔍',
        title: 'Search and filter instantly',
        desc: 'Find any card in seconds by player name, brand, sport, or condition.',
    },
    {
        icon: '📷',
        title: 'Photo storage included',
        desc: 'Upload card images and keep a visual record of every card you own.',
    },
]

// ─── Component ────────────────────────────────────────────────────────────────

function WelcomePage() {
    const { user, isInitialized } = useAppSelector((state) => state.auth)
    const [isSignUp, setIsSignUp] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const loginForm = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    })

    const signUpForm = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: { email: '', password: '', confirmPassword: '' },
    })

    // Already logged in — go straight to collection
    if (isInitialized && user) return <Navigate to="/collection" replace />

    const handleLogin = async (values: LoginFormValues) => {
        setServerError(null)
        setIsLoading(true)
        const { error } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
        })
        if (error) setServerError(error.message)
        setIsLoading(false)
    }

    const handleSignUp = async (values: SignUpFormValues) => {
        setServerError(null)
        setIsLoading(true)
        const { error } = await supabase.auth.signUp({
            email: values.email,
            password: values.password,
        })
        if (error) {
            setServerError(error.message)
        } else {
            setServerError('Check your email to confirm your account before signing in.')
        }
        setIsLoading(false)
    }

    const toggleMode = () => {
        setServerError(null)
        loginForm.reset()
        signUpForm.reset()
        setIsSignUp((prev) => !prev)
    }

    return (
        <div className="welcome">

            {/* ── Left — Hero ── */}
            <div className="welcome__hero">
                <div className="welcome__logo">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img src="/favicon.svg" alt="The Card Vault" style={{ width: '52px', height: '52px' }} />
                        <h1 className="welcome__title">The Card Vault</h1>
                    </div>
                    <p className="welcome__tagline">
                        The modern way to manage your sports card collection.
                        Track value, organize by sport, and never lose sight of
                        what your collection is worth.
                    </p>
                </div>

                <div className="welcome__features">
                    {FEATURES.map((feature) => (
                        <div key={feature.title} className="welcome__feature">
                            <div className="welcome__feature-icon">{feature.icon}</div>
                            <div className="welcome__feature-text">
                                <span className="welcome__feature-title">{feature.title}</span>
                                <span className="welcome__feature-desc">{feature.desc}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Right — Auth ── */}
            <div className="welcome__auth">
                <div className="welcome__auth-inner">

                    {serverError && (
                        <div className="login__server-error" style={{ marginBottom: '1rem' }}>
                            {serverError}
                        </div>
                    )}

                    {isSignUp ? (
                        <form
                            className="login__form"
                            onSubmit={signUpForm.handleSubmit(handleSignUp)}
                        >
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-text-primary, #fff)', marginBottom: '0.25rem' }}>
                                    Create your account
                                </h2>
                                <p style={{ fontSize: '0.875rem', color: '#a0a0c0' }}>
                                    Free forever. No credit card required.
                                </p>
                            </div>

                            <div className="login__field">
                                <label className="login__label">Email</label>
                                <input
                                    className={`login__input${signUpForm.formState.errors.email ? ' login__input--error' : ''}`}
                                    type="email"
                                    placeholder="you@example.com"
                                    {...signUpForm.register('email')}
                                />
                                {signUpForm.formState.errors.email && (
                                    <span className="login__error">{signUpForm.formState.errors.email.message}</span>
                                )}
                            </div>

                            <div className="login__field">
                                <label className="login__label">Password</label>
                                <input
                                    className={`login__input${signUpForm.formState.errors.password ? ' login__input--error' : ''}`}
                                    type="password"
                                    placeholder="Min 8 characters"
                                    {...signUpForm.register('password')}
                                />
                                {signUpForm.formState.errors.password && (
                                    <span className="login__error">{signUpForm.formState.errors.password.message}</span>
                                )}
                            </div>

                            <div className="login__field">
                                <label className="login__label">Confirm Password</label>
                                <input
                                    className={`login__input${signUpForm.formState.errors.confirmPassword ? ' login__input--error' : ''}`}
                                    type="password"
                                    placeholder="Re-enter your password"
                                    {...signUpForm.register('confirmPassword')}
                                />
                                {signUpForm.formState.errors.confirmPassword && (
                                    <span className="login__error">{signUpForm.formState.errors.confirmPassword.message}</span>
                                )}
                            </div>

                            <button
                                className="login__button"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating account...' : 'Create Account'}
                            </button>

                            <div className="login__toggle">
                                Already have an account?
                                <button type="button" onClick={toggleMode}>Sign In</button>
                            </div>
                        </form>
                    ) : (
                        <form
                            className="login__form"
                            onSubmit={loginForm.handleSubmit(handleLogin)}
                        >
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-text-primary, #fff)', marginBottom: '0.25rem' }}>
                                    Welcome back
                                </h2>
                                <p style={{ fontSize: '0.875rem', color: '#a0a0c0' }}>
                                    Sign in to view your collection
                                </p>
                            </div>

                            <div className="login__field">
                                <label className="login__label">Email</label>
                                <input
                                    className={`login__input${loginForm.formState.errors.email ? ' login__input--error' : ''}`}
                                    type="email"
                                    placeholder="you@example.com"
                                    {...loginForm.register('email')}
                                />
                                {loginForm.formState.errors.email && (
                                    <span className="login__error">{loginForm.formState.errors.email.message}</span>
                                )}
                            </div>

                            <div className="login__field">
                                <label className="login__label">Password</label>
                                <input
                                    className={`login__input${loginForm.formState.errors.password ? ' login__input--error' : ''}`}
                                    type="password"
                                    placeholder="Your password"
                                    {...loginForm.register('password')}
                                />
                                {loginForm.formState.errors.password && (
                                    <span className="login__error">{loginForm.formState.errors.password.message}</span>
                                )}
                            </div>

                            <button
                                className="login__button"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </button>

                            <div className="login__toggle">
                                Don't have an account?
                                <button type="button" onClick={toggleMode}>Sign Up</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default WelcomePage
