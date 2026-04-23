import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { format, differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";
import { 
  Calendar, Users, FileText, Clock, ArrowLeft, 
  Rocket, CheckCircle, AlertCircle, 
  Trophy, Zap, Globe, 
  Award, Code, Play
} from "lucide-react";
import api from "../lib/api";
import "./styles/ProjectDetails.css";

// New Components
import Prizes from "../components/hackathon/Prizes";
import Schedule from "../components/hackathon/Schedule";
import Rules from "../components/hackathon/Rules";
import Resources from "../components/hackathon/Resources";
import VideoPlayer from "../components/ui/VideoPlayer";


export default function ProjectDetail() {
  const { id } = useParams();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [activeTab, setActiveTab] = useState("overview");
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [modalReason, setModalReason] = useState<"register" | "submit" | "login">("register");
  const [showVideoModal, setShowVideoModal] = useState(false);


  const [hackathon, setHackathon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Registration Form States
  const [regLeader, setRegLeader] = useState("");
  const [regEmail, setRegEmail] = useState("");
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
          email: regEmail,
          university_name: regSchool,
          project_name: regProject
        });
        
        // Fetch updated hackathon data to get real-time participant count
        const updatedHackathon = await api.get(`/hackathons/${id}`);
        setHackathon(updatedHackathon.data);
        
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

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("T")[0].split("-").map(Number);
    return format(new Date(year, month - 1, day), "MMM d, yyyy");
  };

  const getStatusIcon = () => {
    switch (hackathon.status) {
      case "Ongoing": return <Zap size={16} />;
      case "Upcoming": return <Clock size={16} />;
      default: return <CheckCircle size={16} />;
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
      {/* Navigation Bar */}
      <nav className="detail-nav">
        <div className="nav-container">
          <Link to="/projects" className="back-link">
            <ArrowLeft size={18} />
            Back to Hackathons
          </Link>
          <div className="nav-links">
            <button 
              onClick={() => {
                setActiveTab("overview");
                document.getElementById("overview")?.scrollIntoView({ behavior: "smooth" });
              }} 
              className={`nav-link ${activeTab === "overview" ? "active" : ""}`}
            >
              Overview
            </button>
            <button onClick={() => setActiveTab("prizes")} className={`nav-link ${activeTab === "prizes" ? "active" : ""}`}>
              <Trophy size={14} />
              Prizes
            </button>
            <button onClick={() => setActiveTab("schedule")} className={`nav-link ${activeTab === "schedule" ? "active" : ""}`}>
              <Calendar size={14} />
              Schedule
            </button>
            <button onClick={() => setActiveTab("rules")} className={`nav-link ${activeTab === "rules" ? "active" : ""}`}>
              <FileText size={14} />
              Rules
            </button>
            <button onClick={() => setActiveTab("resources")} className={`nav-link ${activeTab === "resources" ? "active" : ""}`}>
              <Code size={14} />
              Resources
            </button>
          </div>
        </div>
      </nav>

      {/* Compact Hero Section */}
      <div className="detail-hero">
        <div className="hero-container">
          <div className="hero-main">
            <div className="hero-badges">
              <div className={`hero-status ${getStatusClass()}`}>
                {getStatusIcon()}
                <span>{hackathon.status}</span>
              </div>
              <div className="hero-participants">
                <Users size={14} />
                <span>{(hackathon.participants_count || 0).toLocaleString()} participants</span>
              </div>
            </div>
            
            <h1 className="hero-title">{hackathon.title}</h1>
            <p className="hero-description">{hackathon.description}</p>

            {/* Compact Countdown */}
            <div className="hero-countdown">
              <Clock size={14} />
              <span className="countdown-label">
                {hackathon.status === "Ongoing" ? "Time remaining:" : "Ends in:"}
              </span>
              <div className="countdown-numbers">
                <span className="countdown-number">{String(timeLeft.days).padStart(2, '0')}d</span>
                <span className="countdown-sep">:</span>
                <span className="countdown-number">{String(timeLeft.hours).padStart(2, '0')}h</span>
                <span className="countdown-sep">:</span>
                <span className="countdown-number">{String(timeLeft.mins).padStart(2, '0')}m</span>
                <span className="countdown-sep">:</span>
                <span className="countdown-number">{String(timeLeft.secs).padStart(2, '0')}s</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="hero-actions">
              {isRegistered ? (
                <Link to={`/projects/${id}/submit`} className="action-btn primary">
                  <Rocket size={18} />
                  Submit Project
                </Link>
              ) : (
                <button 
                  className="action-btn primary"
                  onClick={() => {
                    setModalReason("register");
                    setShowRegisterModal(true);
                  }}
                  disabled={hackathon.status === "Closed"}
                >
                  <Rocket size={18} />
                  Register Now
                </button>
              )}
              <button 
                className="action-btn secondary"
                onClick={() => setShowVideoModal(true)}
              >
                <Play size={18} />
                Watch Trailer
              </button>

            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="hero-info-grid">
            <div className="info-chip">
              <Calendar size={14} />
              <span>Starts {formatDate(hackathon.start_date)}</span>
            </div>
            <div className="info-chip">
              <Clock size={14} />
              <span>Deadline {formatDate(hackathon.deadline)}</span>
            </div>
            <div className="info-chip">
              <Users size={14} />
              <span>Team Size: 2-6 members</span>
            </div>
            <div className="info-chip">
              <Globe size={14} />
              <span>Global (Online)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="detail-content" id="overview">
        <div className="content-container">
          {/* Sidebar */}
          <aside className="detail-sidebar">
            {hackathon.tech_stack && hackathon.tech_stack.length > 0 && (
              <div className="sidebar-card">
                <h3>
                  <Code size={16} />
                  Tech Stack
                </h3>
                <div className="tech-tags">
                  {hackathon.tech_stack.map((tech: any, i: number) => (
                    <span key={i} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            )}

            {hackathon.prize_pool && (
              <div className="sidebar-card highlight">
                <h3>
                  <Award size={16} />
                  Prize Pool
                </h3>
                <div className="prize-pool-value">{hackathon.prize_pool}</div>
                {hackathon.prize_pool_desc && (
                  <p className="prize-pool-desc">{hackathon.prize_pool_desc}</p>
                )}
              </div>
            )}

            {hackathon.judges && hackathon.judges.length > 0 && (
              <div className="sidebar-card">
                <h3>
                  <Users size={16} />
                  Judges
                </h3>
                {hackathon.judges.map((judge: any, i: number) => (
                  <div key={i} className="judge-item">
                    <div className="judge-avatar">{judge.name.charAt(0)}</div>
                    <div className="judge-info">
                      <strong>{judge.name}</strong>
                      <span>{judge.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </aside>

          {/* Main Article */}
          <main className="detail-main">
            {/* Tab Navigation */}
            <div className="tab-navigation">
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
                <Trophy size={14} />
                Prizes
              </button>
              <button 
                className={`tab-btn ${activeTab === "schedule" ? "active" : ""}`}
                onClick={() => setActiveTab("schedule")}
              >
                <Calendar size={14} />
                Schedule
              </button>
              <button 
                className={`tab-btn ${activeTab === "rules" ? "active" : ""}`}
                onClick={() => setActiveTab("rules")}
              >
                <FileText size={14} />
                Rules
              </button>
              <button 
                className={`tab-btn ${activeTab === "resources" ? "active" : ""}`}
                onClick={() => setActiveTab("resources")}
              >
                <Code size={14} />
                Resources
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === "overview" && (
                <div className="overview-section">
                  {hackathon.long_description && (
                    <div className="content-card">
                      <h2>About the Hackathon</h2>
                      <p>{hackathon.long_description}</p>
                    </div>
                  )}

                  {hackathon.objectives && hackathon.objectives.length > 0 && (
                    <div className="content-card">
                      <h2>Objectives</h2>
                      <div className="objectives-list">
                        {hackathon.objectives.map((obj: any, i: number) => (
                          <div key={i} className="objective-item">
                            <CheckCircle size={18} />
                            <span>{obj}</span>
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
                <AlertCircle size={18} />
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
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalReason === "submit" ? "Register to Submit" : 
                 modalReason === "login" ? "Login to Hackathon" : "Hackathon Registration"}
              </h2>
              <button className="modal-close" onClick={() => setShowRegisterModal(false)}>×</button>
            </div>
            
            {modalReason === "submit" && (
              <div className="modal-notice">
                <AlertCircle size={16} />
                <span>You need to register your team before you can submit.</span>
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
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    value={regEmail} 
                    onChange={e => setRegEmail(e.target.value)} 
                    required 
                    placeholder="Enter your email"
                  />
                </div>
              )}
              
              {modalReason !== "login" && (
                <>
                  <div className="form-group">
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
                      <ul className="suggestions-list">
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

              <button type="submit" className="submit-btn" disabled={isRegistering}>
                {isRegistering ? "Processing..." : 
                 modalReason === "login" ? "Login" : "Confirm Registration"}
              </button>

              <div className="modal-footer">
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
      {/* Video Modal */}
      {showVideoModal && (
        <div className="modal-overlay" onClick={() => setShowVideoModal(false)}>
          <div className="modal-container video-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{hackathon.title} - Trailer</h2>
              <button className="modal-close" onClick={() => setShowVideoModal(false)}>×</button>
            </div>
            <div className="modal-body video-body">
              {hackathon.video_url ? (
                <VideoPlayer url={hackathon.video_url} title={hackathon.title} />
              ) : (
                <div className="no-video">
                  <Play size={48} />
                  <p>No trailer available for this hackathon.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>

  );
}