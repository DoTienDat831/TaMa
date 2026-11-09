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
            <span>tandem</span>
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
            <span>tandem</span>
          </div>

          {/* Login Heading */}
          <div className="login-heading">
            <span className="eyebrow">
              WELCOME BACK
            </span>

            <h2>Good to see you.</h2>

            <p>
              Sign in to pick up where you left off.
            </p>
          </div>

          {/* Login Form */}
          <form
            onSubmit={onSubmit}
            className="login-form"
          >

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
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            {/* Form Options */}
            <div className="form-meta">

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
              >
                Forgot password?
              </button>

            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="primary-button"
            >
              Sign in
              <span>→</span>
            </button>

          </form>

          {/* Additional Information */}
          <p className="login-foot">
            New to Tandem?{' '}
            <button className="text-button">
              Contact your admin
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
