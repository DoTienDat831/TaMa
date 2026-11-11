import type {
  FormEvent,
  Dispatch,
  SetStateAction,
} from 'react';

// ==========================================
// Types
// ==========================================

type Props = {
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;

  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  fullName: string;
  setFullName: Dispatch<SetStateAction<string>>;
  isRegistering: boolean;
  setIsRegistering: Dispatch<SetStateAction<boolean>>;
  error: string;
  isLoading: boolean;

  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

// ==========================================
// Component
// ==========================================

export default function LoginPage({
  email,
  setEmail,
  password,
  setPassword,
  fullName,
  setFullName,
  isRegistering,
  setIsRegistering,
  error,
  isLoading,
  onSubmit,
}: Props) {
  return (
    <main className="login-page">

      {/* =====================================
          Left Section: Login Illustration
      ====================================== */}

      <div className="login-art">
        <div className="art-grid" />

        <div className="art-copy">

          {/* Brand Logo */}
          <div className="brand brand-light">
            <span className="brand-mark">t</span>
            <span>TaMa</span>
          </div>

          {/* Introduction */}
          <h1>
            Make room for
            <br />
            <span>what matters.</span>
          </h1>

          <p>
            Bring your tasks, plans, and people together
            in one calm, clear space.
          </p>

          {/* Today's Focus Card */}
          <div className="art-card">

            <div className="art-card-top">
              <span className="art-dot" />
              TODAY'S FOCUS
              <span className="art-check">✓</span>
            </div>

            <div className="art-task-line wide" />
            <div className="art-task-line" />

            {/* Progress Bar */}
            <div className="art-progress">
              <span />
            </div>

            <div className="art-card-foot">
              <span>3 of 5 tasks complete</span>
              <span>60%</span>
            </div>

          </div>
        </div>

        {/* Decorative Elements */}
        <div className="art-orb orb-one" />
        <div className="art-orb orb-two" />
      </div>

      {/* =====================================
          Right Section: Login Form
      ====================================== */}

      <section className="login-panel">
        <div className="login-content">

          {/* Brand Logo */}
          <div className="brand brand-dark">
            <span className="brand-mark">t</span>
            <span>Tama</span>
          </div>

          {/* Login Heading */}
          <div className="login-heading">
            <span className="eyebrow">
              {isRegistering ? 'GET STARTED' : 'WELCOME BACK'}
            </span>

            <h2>{isRegistering ? 'Create your account.' : 'Good to see you.'}</h2>

            <p>
              {isRegistering ? 'Create an account to start organizing your work.' : 'Sign in to pick up where you left off.'}
            </p>
          </div>

          {/* Login Form */}
          <form
            onSubmit={onSubmit}
            className="login-form"
          >

            {isRegistering && <>
              <label htmlFor="fullName">Full name</label>
              <input id="fullName" autoComplete="name" value={fullName}
                onChange={event => setFullName(event.target.value)} required />
            </>}

            {/* Email Field */}
            <label htmlFor="email">
              Email address
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            {/* Password Field */}
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete={isRegistering ? 'new-password' : 'current-password'}
              placeholder="Enter your password"
              minLength={isRegistering ? 8 : undefined}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            {/* Form Options */}
            {!isRegistering && <div className="form-meta">

              <label className="remember">
                <input
                  type="checkbox"
                  defaultChecked
                />

                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="text-button"
                onClick={() => setIsRegistering(false)}
              >
                Forgot password?
              </button>

            </div>}

            {error && <p className="form-error" role="alert">{error}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              className="primary-button"
            >
              {isLoading ? 'Please wait…' : isRegistering ? 'Create account' : 'Sign in'}
              <span>→</span>
            </button>

          </form>

          {/* Additional Information */}
          <p className="login-foot">
            {isRegistering ? 'Already have an account? ' : 'New to Tandem? '}
            <button type="button" className="text-button" onClick={() => setIsRegistering(value => !value)}>
              {isRegistering ? 'Sign in' : 'Create account'}
            </button>
          </p>

          {/* Legal Information */}
          <div className="login-legal">
            © 2024 Tandem ·{' '}
            <a href="#privacy">Privacy</a>
            {' · '}
            <a href="#terms">Terms</a>
          </div>

        </div>
      </section>

    </main>
  );
}
