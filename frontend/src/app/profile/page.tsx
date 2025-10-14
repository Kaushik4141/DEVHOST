"use client";
import React, { useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser, useAuth } from "@clerk/nextjs";
import { getAuthMe } from "@/libs/api";
import gsap from "gsap";
import Lenis from "lenis";

export default function ProfilePage() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [showRequestForm, setShowRequestForm] = React.useState(false);
  const [requestData, setRequestData] = React.useState({
    title: "",
    description: "",
    priority: "medium",
  });
  const [submitting, setSubmitting] = React.useState(false);

  // Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (isLoaded) {
      const tl = gsap.timeline();
      
      tl.fromTo(".profile-header", 
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
      
      tl.fromTo(".profile-content", 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.4"
      );

      tl.fromTo(".quick-actions button", 
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)" },
        "-=0.2"
      );
    }
  }, [isLoaded]);

  const fetchProfile = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      if (!token) throw new Error("No token available");
      const res = await getAuthMe(token);
      setData(res);
      
      // Success animation
      gsap.fromTo(".success-message", 
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }
      );
    } catch (e: any) {
      setError(e?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Animate submit button
      gsap.to(".btn-primary", {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1
      });

      // Simulate API call to send request to admin
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Request submitted:", requestData);
      
      // Animate modal close
      gsap.to(".modal-content", {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          setRequestData({ title: "", description: "", priority: "medium" });
          setShowRequestForm(false);
        }
      });

      // Show success animation
      gsap.fromTo(".success-message", 
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }
      );
      
    } catch (error) {
      setError("Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  const openRequestForm = () => {
    setShowRequestForm(true);
    // Animate modal opening
    setTimeout(() => {
      gsap.fromTo(".modal-content", 
        { scale: 0.7, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    }, 10);
  };

  const closeRequestForm = () => {
    // Animate modal closing
    gsap.to(".modal-content", {
      scale: 0.7,
      opacity: 0,
      duration: 0.3,
      onComplete: () => setShowRequestForm(false)
    });
  };

  React.useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchProfile();
    }
  }, [isLoaded, isSignedIn, fetchProfile]);

  return (
    <main className="profile-container">
      <header className="profile-header">
        <div className="header-content">
          <h1 className="profile-title">User Profile</h1>
          <p className="profile-subtitle">Manage your account and send requests to admin</p>
          {user && (
            <div className="user-welcome">
              Welcome back, <span className="user-name">{user.fullName || user.username || user.primaryEmailAddress?.emailAddress}</span>
            </div>
          )}
        </div>
        <div className="user-controls">
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <SignedOut>
        <div className="signed-out-section">
          <div className="signed-out-card">
            <div className="user-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h2>Welcome!</h2>
            <p>Please sign in to access your profile and send requests to admin</p>
            <SignInButton mode="modal">
              <button className="sign-in-btn">Sign In</button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="profile-content">
          {/* Status Indicators */}
          <div className="status-section">
            {loading && (
              <div className="status-card loading">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                <span>Loading your profile...</span>
              </div>
            )}
            
            {error && (
              <div className="status-card error">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {data && (
              <div className="status-card success success-message">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>Profile loaded successfully</span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <button 
              className="action-btn primary"
              onClick={openRequestForm}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Send Request to Admin
            </button>
            <button 
              className="action-btn secondary"
              onClick={fetchProfile}
              disabled={loading}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              Refresh Status
            </button>
          </div>

          {/* Request Form Modal */}
          {showRequestForm && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h3>Send Request to Admin</h3>
                  <button 
                    className="close-btn"
                    onClick={closeRequestForm}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmitRequest} className="request-form">
                    <div className="form-group">
                      <label htmlFor="title">Request Title *</label>
                      <input
                        id="title"
                        type="text"
                        required
                        value={requestData.title}
                        onChange={(e) => setRequestData({...requestData, title: e.target.value})}
                        placeholder="Enter a brief title for your request"
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="description">Description *</label>
                      <textarea
                        id="description"
                        required
                        rows={5}
                        value={requestData.description}
                        onChange={(e) => setRequestData({...requestData, description: e.target.value})}
                        placeholder="Please describe your request in detail. Include any relevant information that will help us understand your needs."
                        className="form-textarea"
                      />
                    </div>

                    <div className="form-footer">
                      <p className="form-note">
                        All fields marked with * are required. We'll get back to you within 24 hours.
                      </p>
                    </div>
                    
                    <div className="form-actions">
                      <button
                        type="button"
                        className="btn-outline"
                        onClick={closeRequestForm}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-primary"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <svg className="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                            </svg>
                            Send Request
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </SignedIn>

      <style jsx>{`
        .profile-container {
          max-width: 800px;
          margin: 40px auto;
          padding: 0 20px;
          position: relative;
        }

        .profile-header {
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .header-content {
          flex: 1;
        }

        .profile-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a202c;
          margin: 0 0 8px 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .profile-subtitle {
          color: #718096;
          font-size: 1.1rem;
          margin: 0 0 12px 0;
        }

        .user-welcome {
          color: #4a5568;
          font-size: 1rem;
        }

        .user-name {
          font-weight: 600;
          color: #2d3748;
        }

        .user-controls {
          margin-left: 20px;
        }

        .signed-out-section {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
        }

        .signed-out-card {
          text-align: center;
          padding: 60px 40px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
          max-width: 400px;
          width: 100%;
        }

        .user-icon {
          margin-bottom: 20px;
          color: #cbd5e0;
        }

        .signed-out-card h2 {
          margin: 0 0 16px 0;
          color: #2d3748;
          font-weight: 600;
        }

        .signed-out-card p {
          color: #718096;
          margin-bottom: 30px;
          line-height: 1.6;
        }

        .sign-in-btn {
          background: #2d3748;
          color: white;
          border: none;
          padding: 12px 32px;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sign-in-btn:hover {
          background: #4a5568;
          transform: translateY(-1px);
        }

        .profile-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .status-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .status-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-radius: 8px;
          font-weight: 500;
        }

        .status-card.loading {
          background: #fffaf0;
          border: 1px solid #feebc8;
          color: #dd6b20;
        }

        .status-card.error {
          background: #fed7d7;
          border: 1px solid #feb2b2;
          color: #c53030;
        }

        .status-card.success {
          background: #f0fff4;
          border: 1px solid #9ae6b4;
          color: #38a169;
        }

        .quick-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .action-btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.95rem;
        }

        .action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .action-btn.primary {
          background: #2d3748;
          color: white;
        }

        .action-btn.primary:hover:not(:disabled) {
          background: #4a5568;
          transform: translateY(-2px);
        }

        .action-btn.secondary {
          background: #f7fafc;
          color: #4a5568;
          border: 1px solid #e2e8f0;
        }

        .action-btn.secondary:hover:not(:disabled) {
          background: #edf2f7;
          transform: translateY(-1px);
        }

        /* Modal Styles - FIXED */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: #000000;
          border-radius: 16px;
          width: 100%;
          max-width: 520px;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          border: 1px solid #333;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          border-bottom: 1px solid #333;
          background: #111;
          flex-shrink: 0;
        }

        .modal-header h3 {
          margin: 0;
          color: #ffffff;
          font-weight: 600;
          font-size: 1.25rem;
        }

        .close-btn {
          background: #222;
          border: 1px solid #333;
          cursor: pointer;
          color: #999;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
        }

        .close-btn:hover {
          color: #fff;
          background: #333;
          border-color: #555;
        }

        .modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 0;
        }

        .request-form {
          padding: 32px;
          background: #000;
          display: flex;
          flex-direction: column;
          min-height: min-content;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #e2e8f0;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid #333;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s ease;
          background: #111;
          color: #ffffff;
          font-family: inherit;
          box-sizing: border-box;
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
          color: #666;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #4a5568;
          box-shadow: 0 0 0 3px rgba(74, 85, 104, 0.2);
          background: #1a1a1a;
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
          line-height: 1.5;
        }

        .form-footer {
          margin-bottom: 24px;
        }

        .form-note {
          color: #666;
          font-size: 0.875rem;
          line-height: 1.4;
          margin: 0;
          font-style: italic;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
          flex-shrink: 0;
        }

        .btn-outline {
          padding: 14px 24px;
          border: 1px solid #333;
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          color: #e2e8f0;
          transition: all 0.2s ease;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 100px;
          justify-content: center;
          flex-shrink: 0;
        }

        .btn-outline:hover {
          background: #222;
          border-color: #555;
          color: #ffffff;
        }

        .btn-primary {
          padding: 14px 24px;
          border: none;
          background: #2d3748;
          color: white;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 140px;
          justify-content: center;
          flex-shrink: 0;
        }

        .btn-primary:hover:not(:disabled) {
          background: #4a5568;
          transform: translateY(-1px);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .profile-header {
            flex-direction: column;
            gap: 16px;
          }

          .profile-title {
            font-size: 2rem;
          }

          .user-controls {
            margin-left: 0;
            align-self: flex-end;
          }

          .quick-actions {
            flex-direction: column;
          }

          .action-btn {
            justify-content: center;
          }

          .form-actions {
            flex-direction: column;
          }

          .modal-content {
            margin: 0;
            max-height: 90vh;
          }

          .request-form {
            padding: 24px;
          }

          .btn-outline,
          .btn-primary {
            width: 100%;
          }
        }

        @media (max-height: 700px) {
          .modal-content {
            max-height: 95vh;
          }
          
          .request-form {
            padding: 20px;
          }
          
          .form-group {
            margin-bottom: 16px;
          }
        }
      `}</style>
    </main>
  );
}