import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from '../services/supabase'
import { useAppSelector } from '../store/hooks'

// ─── Zod validation schema ────────────────────────────────────────────────────
const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

const signUpSchema = loginSchema.extend({
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
})

type LoginFormValues = z.infer<typeof loginSchema>
type SignUpFormValues = z.infer<typeof signUpSchema>

// ─── Component ────────────────────────────────────────────────────────────────
function LoginPage() {
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

    // Already logged in — redirect to collection
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
            setServerError('Check your email to confirm your account before logging in.')
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
        <div className="login">
            <div className="login__card">

                <div className="login__header">
                    <h1 className="login__title">Sports Card Tracker</h1>
                    <p className="login__subtitle">
                        {isSignUp ? 'Create your account' : 'Sign in to your collection'}
                    </p>
                </div>

                {serverError && (
                    <div className="login__server-error">{serverError}</div>
                )}

                {isSignUp ? (
                    <form
                        className="login__form"
                        onSubmit={signUpForm.handleSubmit(handleSignUp)}
                    >
                        <div className="login__field">
                            <label className="login__label">Email</label>
                            <input
                                className={`login__input${signUpForm.formState.errors.email ? ' login__input--error' : ''}`}
                                type="email"
                                placeholder="you@example.com"
                                {...signUpForm.register('email')}
                            />
                            {signUpForm.formState.errors.email && (
                                <span className="login__error">
                                    {signUpForm.formState.errors.email.message}
                                </span>
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
                                <span className="login__error">
                                    {signUpForm.formState.errors.password.message}
                                </span>
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
                                <span className="login__error">
                                    {signUpForm.formState.errors.confirmPassword.message}
                                </span>
                            )}
                        </div>

                        <button
                            className="login__button"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>
                ) : (
                    <form
                        className="login__form"
                        onSubmit={loginForm.handleSubmit(handleLogin)}
                    >
                        <div className="login__field">
                            <label className="login__label">Email</label>
                            <input
                                className={`login__input${loginForm.formState.errors.email ? ' login__input--error' : ''}`}
                                type="email"
                                placeholder="you@example.com"
                                {...loginForm.register('email')}
                            />
                            {loginForm.formState.errors.email && (
                                <span className="login__error">
                                    {loginForm.formState.errors.email.message}
                                </span>
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
                                <span className="login__error">
                                    {loginForm.formState.errors.password.message}
                                </span>
                            )}
                        </div>

                        <button
                            className="login__button"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                )}

                <div className="login__toggle">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                    <button type="button" onClick={toggleMode}>
                        {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                </div>

            </div>
        </div>
    )
}

export default LoginPage
