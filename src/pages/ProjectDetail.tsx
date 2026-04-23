import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { format, differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";
import { 
  Calendar, Users, FileText, Clock, ArrowLeft, 
  Rocket, CheckCircle, AlertCircle, 
  Trophy,Sparkles, Zap, Globe
} from "lucide-react";
import api from "../lib/api";
import "./styles/ProjectDetails.css";

// New Components
import Prizes from "../components/hackathon/Prizes";
import Schedule from "../components/hackathon/Schedule";
import Rules from "../components/hackathon/Rules";
import Resources from "../components/hackathon/Resources";

export default function ProjectDetail() {
  const { id } = useParams();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [activeTab, setActiveTab] = useState("overview");
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [modalReason, setModalReason] = useState<"register" | "submit" | "login">("register");

  const [hackathon, setHackathon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Registration Form States
  const [regLeader, setRegLeader] = useState("");
  const [regSchool, setRegSchool] = useState("");
  const [regProject, setRegProject] = useState("");
  const [universities, setUniversities] = useState<string[]>([]);
  const [showUniSuggestions, setShowUniSuggestions] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [regError, setRegError] = useState("");

  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        const response = await api.get(`/hackathons/${id}`);
        setHackathon(response.data);
        
        // Check local storage for persistent registration
        const savedData = localStorage.getItem(`hackathon_reg_${id}`);
        let leaderName = "";
        if (savedData) {
          const { leaderName: savedName, expiry } = JSON.parse(savedData);
          if (Date.now() < expiry) {
            leaderName = savedName;
          } else {
            localStorage.removeItem(`hackathon_reg_${id}`);
          }
        }

        // Check registration status with backend
        const regStatus = await api.get(`/hackathons/${id}/registration-status`, {
          params: leaderName ? { leader_name: leaderName } : {}
        });
        
        if (regStatus.data.registered) {
          setIsRegistered(true);
          // Refresh expiry if already registered
          if (leaderName) {
            localStorage.setItem(`hackathon_reg_${id}`, JSON.stringify({
              leaderName,
              expiry: Date.now() + 24 * 60 * 60 * 1000
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching hackathon details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHackathon();
  }, [id]);

  useEffect(() => {
    if (!hackathon) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const end = new Date(hackathon.deadline);
      if (now >= end) return { days: 0, hours: 0, mins: 0, secs: 0 };
      
      const diff = end.getTime() - now.getTime();
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (86400000)) / (1000 * 60 * 60)),
        mins: Math.floor((diff % (3600000)) / (1000 * 60)),
        secs: Math.floor((diff % (60000)) / 1000)
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [hackathon?.deadline]);

  const handleUniversitySearch = async (val: string) => {
    setRegSchool(val);
    if (val.length > 2) {
      try {
        const res = await api.get(`/universities/search?q=${val}`);
        setUniversities(res.data.map((u: any) => u.name));
        setShowUniSuggestions(true);
      } catch (e) {
        console.error(e);
      }
    } else {
      setUniversities([]);
      setShowUniSuggestions(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    setRegError("");
    try {
      if (modalReason === "login") {
        const res = await api.get(`/hackathons/${id}/registration-status`, {
          params: { leader_name: regLeader }
        });
        
        if (res.data.registered) {
          setIsRegistered(true);
          localStorage.setItem(`hackathon_reg_${id}`, JSON.stringify({
            leaderName: regLeader,
            expiry: Date.now() + 24 * 60 * 60 * 1000
          }));
          setShowRegisterModal(false);
        } else {
          setRegError("No registration found with this leader name.");
        }
      } else {
        await api.post(`/hackathons/${id}/register`, {
          leader_name: regLeader,
          university_name: regSchool,
          project_name: regProject
        });
        
        setIsRegistered(true);
        // Save to local storage for 24 hours
        localStorage.setItem(`hackathon_reg_${id}`, JSON.stringify({
          leaderName: regLeader,
          expiry: Date.now() + 24 * 60 * 60 * 1000
        }));
        setShowRegisterModal(false);
      }
    } catch (error: any) {
      console.error("Registration/Login error:", error);
      const msg = error.response?.data?.message || "Action failed. Please try again.";
      setRegError(msg);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleSubmissionClick = (e: React.MouseEvent) => {
    // We no longer trigger registration modal from here as per user request.
    // However, we can keep the logic if we want to show a hint, but the user said "remove the register process"
    // from the submission section. So we'll just let it go through and let the page handle it.
  };

  const getStatusIcon = () => {
    switch (hackathon.status) {
      case "Ongoing": return <Zap size={18} />;
      case "Upcoming": return <Clock size={18} />;
      default: return <CheckCircle size={18} />;
    }
  };

  const getStatusClass = () => {
    switch (hackathon.status) {
      case "Ongoing": return "status-ongoing";
      case "Upcoming": return "status-upcoming";
      default: return "status-closed";
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading hackathon details...</p>
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="error-state">
        <h2>Hackathon not found</h2>
        <Link to="/projects">Back to Hackathons</Link>
      </div>
    );
  }

  const isDeadlineNear = timeLeft.days < 3 && hackathon.status === "Ongoing";

  return (
    <div className="project-detail-container">
      {/* Animated Background */}
      <div className="detail-bg">
        <div className="detail-sphere sphere-1"></div>
        <div className="detail-sphere sphere-2"></div>
        <div className="detail-sphere sphere-3"></div>
        <div className="grid-pattern"></div>
      </div>

      {/* Navigation */}
      <nav className="detail-nav">
        <div className="nav-container">
          <Link to="/projects" className="back-link">
            <ArrowLeft size={20} />
            Back to Hackathons
          </Link>
          <div className="nav-links">
            <button 
              onClick={() => {
                setActiveTab("overview");
                const el = document.getElementById("overview");
                el?.scrollIntoView({ behavior: "smooth" });
              }} 
              className={`nav-link ${activeTab === "overview" ? "highlight" : ""}`}
            >
              Overview
            </button>
            <button onClick={() => setActiveTab("prizes")} className={`nav-link ${activeTab === "prizes" ? "highlight" : ""}`}>Prizes</button>
            <button onClick={() => setActiveTab("schedule")} className={`nav-link ${activeTab === "schedule" ? "highlight" : ""}`}>Schedule</button>
            <button onClick={() => setActiveTab("rules")} className={`nav-link ${activeTab === "rules" ? "highlight" : ""}`}>Rules</button>
            <button onClick={() => setActiveTab("resources")} className={`nav-link ${activeTab === "resources" ? "highlight" : ""}`}>Resources</button>
            <Link 
              to={`/projects/${id}/submit`} 
              className="nav-link"
            >
              Submission
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="detail-hero">
        <div className="hero-content">
          <div className="hero-badge-group">
            <div className={`hero-status ${getStatusClass()}`}>
              {getStatusIcon()}
              <span>{hackathon.status}</span>
            </div>
            <div className="hero-badge">
              <Users size={14} />
              <span>{(hackathon.participants || 0).toLocaleString()} Participants</span>
            </div>
          </div>
          
          <h1 className="hero-title">
            {hackathon.title}
            <span className="hero-title-accent">🏆</span>
          </h1>
          <p className="hero-tagline">{hackathon.tagline}</p>
          <p className="hero-description">{hackathon.description}</p>

          {/* Countdown Timer */}
          <div className="countdown-timer">
            <div className="timer-label">
              <Clock size={16} />
              <span>{hackathon.status === "Ongoing" ? "Time Remaining" : "Starts In"}</span>
            </div>
            <div className="timer-values">
              <div className="timer-unit">
                <span className="timer-number">{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="timer-unit-label">Days</span>
              </div>
              <span className="timer-separator">:</span>
              <div className="timer-unit">
                <span className="timer-number">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="timer-unit-label">Hours</span>
              </div>
              <span className="timer-separator">:</span>
              <div className="timer-unit">
                <span className="timer-number">{String(timeLeft.mins).padStart(2, '0')}</span>
                <span className="timer-unit-label">Minutes</span>
              </div>
              <span className="timer-separator">:</span>
              <div className="timer-unit">
                <span className="timer-number">{String(timeLeft.secs).padStart(2, '0')}</span>
                <span className="timer-unit-label">Seconds</span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hero-actions">
            {isRegistered ? (
              <Link 
                to={`/projects/${id}/submit`}
                className="register-btn submit-btn"
                style={{ textDecoration: 'none' }}
              >
                <Rocket size={20} />
                Submit Project
              </Link>
            ) : (
              <button 
                className="register-btn"
                onClick={() => {
                  setModalReason("register");
                  setShowRegisterModal(true);
                }}
                disabled={hackathon.status === "Closed"}
              >
                <Rocket size={20} />
                Register Now
              </button>
            )}
            {!isRegistered && (
              <button 
                className="login-hero-btn"
                onClick={() => {
                  setModalReason("login");
                  setShowRegisterModal(true);
                }}
              >
                Login
              </button>
            )}
            <button className="watch-btn">
              <Play size={20} />
              Watch Trailer
            </button>
          </div>

          {hackathon.sponsors && hackathon.sponsors.length > 0 && (
            <div className="sponsor-section">
              <p className="sponsor-label">Powered by</p>
              <div className="sponsor-logos">
                {hackathon.sponsors.map((sponsor: any, i: number) => (
                  <div key={i} className="sponsor-logo">
                    <span>{sponsor}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="detail-content" id="overview">
        <div className="content-container">
          {/* Sidebar */}
          <aside className="detail-sidebar">
            <div className="info-card">
              <h3>Quick Info</h3>
              <div className="info-items">
                <div className="info-item">
                  <Calendar size={18} />
                  <div>
                    <span>Start Date</span>
                    <strong>{format(new Date(hackathon.start_date), "MMM d, yyyy")}</strong>
                  </div>
                </div>
                <div className="info-item">
                  <Clock size={18} />
                  <div>
                    <span>Deadline</span>
                    <strong>{format(new Date(hackathon.deadline), "MMM d, yyyy")}</strong>
                  </div>
                </div>
                <div className="info-item">
                  <Users size={18} />
                  <div>
                    <span>Team Size</span>
                    <strong>2-6 members</strong>
                  </div>
                </div>
                <div className="info-item">
                  <Globe size={18} />
                  <div>
                    <span>Location</span>
                    <strong>Global (Online)</strong>
                  </div>
                </div>
              </div>
            </div>

            {hackathon.tech_stack && hackathon.tech_stack.length > 0 && (
              <div className="tech-card">
                <h3>Tech Stack</h3>
                <div className="tech-tags">
                  {hackathon.tech_stack.map((tech: any, i: number) => (
                    <span key={i} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            )}

            {hackathon.judges && hackathon.judges.length > 0 && (
              <div className="judges-card">
                <h3>Lead Judges</h3>
                {hackathon.judges.map((judge: any, i: number) => (
                  <div key={i} className="judge-item">
                    <div className="judge-avatar">
                      {judge.name.charAt(0)}
                    </div>
                    <div>
                      <strong>{judge.name}</strong>
                      <span>{judge.role}, {judge.company}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </aside>

          {/* Main Article */}
          <main className="detail-main">
            {/* Tabs */}
            <div className="detail-tabs">
              <button 
                className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button 
                className={`tab-btn ${activeTab === "prizes" ? "active" : ""}`}
                onClick={() => setActiveTab("prizes")}
              >
                <Trophy size={16} />
                Prizes
              </button>
              <button 
                className={`tab-btn ${activeTab === "schedule" ? "active" : ""}`}
                onClick={() => setActiveTab("schedule")}
              >
                <Calendar size={16} />
                Schedule
              </button>
              <button 
                className={`tab-btn ${activeTab === "resources" ? "active" : ""}`}
                onClick={() => setActiveTab("resources")}
              >
                <FileText size={16} />
                Resources
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === "overview" && (
                <div className="overview-section">
                  {hackathon.long_description && (
                    <div className="section-card">
                      <h2>About the Hackathon</h2>
                      <p>{hackathon.long_description}</p>
                    </div>
                  )}

                  {hackathon.objectives && hackathon.objectives.length > 0 && (
                    <div className="section-card">
                      <h2>Objectives</h2>
                      <div className="objectives-grid">
                        {hackathon.objectives.map((obj: any, i: number) => (
                          <div key={i} className="objective-item">
                            <CheckCircle size={20} className="objective-icon" />
                            <span>{obj}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {hackathon.resources && hackathon.resources.length > 0 && (
                    <div className="section-card">
                      <h2>What You'll Get</h2>
                      <div className="resources-grid">
                        {hackathon.resources.map((resource: any, i: number) => (
                          <div key={i} className="resource-item">
                            <Sparkles size={16} />
                            <span>{resource}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "prizes" && (
                <Prizes prizes={hackathon.prizes} prizePoolDesc={hackathon.prize_pool_desc} />
              )}

              {activeTab === "schedule" && (
                <Schedule schedule={hackathon.schedule} />
              )}

              {activeTab === "rules" && (
                <Rules rules={hackathon.rules} />
              )}

              {activeTab === "resources" && (
                <Resources resources={hackathon.resources} />
              )}
            </div>

            {/* Deadline Warning */}
            {isDeadlineNear && (
              <div className="deadline-warning">
                <AlertCircle size={20} />
                <div>
                  <strong>Deadline approaching!</strong>
                  <p>Submit your project before time runs out</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegisterModal && (
        <div className="modal-overlay" onClick={() => !isRegistering && setShowRegisterModal(false)}>
          <div className="modal-container register-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalReason === "submit" ? "Register to Submit" : 
                 modalReason === "login" ? "Login to Hackathon" : "Hackathon Registration"}
              </h2>
              <button className="close-btn" onClick={() => setShowRegisterModal(false)}>×</button>
            </div>
            {modalReason === "submit" && (
              <div className="modal-notice">
                <AlertCircle size={16} />
                <span>You need to register your team/project before you can submit.</span>
              </div>
            )}
            
            {regError && (
              <div className="modal-error">
                <AlertCircle size={16} />
                <span>{regError}</span>
              </div>
            )}
            
            <form onSubmit={handleRegister} className="registration-form">
              <div className="form-group">
                <label>Project Leader Name</label>
                <input 
                  type="text" 
                  value={regLeader} 
                  onChange={e => setRegLeader(e.target.value)} 
                  required 
                  placeholder="Enter leader's full name"
                />
              </div>
              
              {modalReason !== "login" && (
                <>
                  <div className="form-group autocomplete">
                    <label>School / University</label>
                    <input 
                      type="text" 
                      value={regSchool} 
                      onChange={e => handleUniversitySearch(e.target.value)} 
                      onFocus={() => regSchool.length > 2 && setShowUniSuggestions(true)}
                      required 
                      placeholder="Type to search university..."
                    />
                    {showUniSuggestions && universities.length > 0 && (
                      <ul className="suggestions">
                        {universities.map((uni, idx) => (
                          <li key={idx} onClick={() => {
                            setRegSchool(uni);
                            setShowUniSuggestions(false);
                          }}>{uni}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Project Name</label>
                    <input 
                      type="text" 
                      value={regProject} 
                      onChange={e => setRegProject(e.target.value)} 
                      required 
                      placeholder="What's your project called?"
                    />
                  </div>
                </>
              )}

              <button type="submit" className="submit-reg-btn" disabled={isRegistering}>
                {isRegistering ? "Processing..." : 
                 modalReason === "login" ? "Login" : "Confirm Registration"}
              </button>

              <div className="modal-footer-text">
                {modalReason === "login" ? (
                  <p>Don't have a registration? <button type="button" onClick={() => setModalReason("register")}>Register Now</button></p>
                ) : (
                  <p>Already registered? <button type="button" onClick={() => setModalReason("login")}>Login here</button></p>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Play icon component
const Play = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const Crown = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L15 9H21L16 14L19 21L12 17.5L5 21L8 14L3 9H9L12 2Z"/>
  </svg>
);