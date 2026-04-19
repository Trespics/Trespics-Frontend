import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  CheckCircle, ArrowLeft, Upload, Github, Link as LinkIcon, 
  Video, Shield, Users, BookOpen, Code, Globe, Zap,
  Mail, User, School, Trash2, Plus, Eye, Lock,
  FileText, Award, Sparkles, ChevronRight, ChevronLeft
} from "lucide-react";
import api from "../lib/api";
import "./styles/ProjectSubmit.css";

export default function ProjectSubmit() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [currentSection, setCurrentSection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isCheckingReg, setIsCheckingReg] = useState(true);
  const [needsRegistration, setNeedsRegistration] = useState(false);
  const [registrationData, setRegistrationData] = useState<any>(null);

  // Section 1: Registration & Team Info
  const [projectName, setProjectName] = useState("");
  const [university, setUniversity] = useState("");
  const [isTeam, setIsTeam] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState([{ name: "", email: "", role: "" }]);

  // Section 2: Project Description
  const [programmingLanguages, setProgrammingLanguages] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [problemSolved, setProblemSolved] = useState("");
  const [impact, setImpact] = useState("");
  const [keyFeatures, setKeyFeatures] = useState("");
  const [challenges, setChallenges] = useState("");

  // Section 3: Media & Links
  const [videoUrl, setVideoUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveDemoUrl, setLiveDemoUrl] = useState("");
  const [screenshots, setScreenshots] = useState([]);
  const [additionalLinks, setAdditionalLinks] = useState([{ title: "", url: "" }]);

  // Section 4: Declaration & Credentials
  const [hasCredentials, setHasCredentials] = useState(false);
  const [credentials, setCredentials] = useState("");
  const [declarationConfirmed, setDeclarationConfirmed] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  useEffect(() => {
    // Check registration status
    const checkRegistration = async () => {
      try {
        const savedData = localStorage.getItem(`hackathon_reg_${id}`);
        let leaderName = "";
        if (savedData) {
          const { leaderName: savedName, expiry } = JSON.parse(savedData);
          if (Date.now() < expiry) {
            leaderName = savedName;
          }
        }

        const { data } = await api.get(`/hackathons/${id}/registration-status`, {
          params: leaderName ? { leader_name: leaderName } : {}
        });
        
        if (!data.registered) {
          setNeedsRegistration(true);
        } else {
          setRegistrationData(data.registration);
          // Pre-fill some data if available
          if (data.registration.project_name) setProjectName(data.registration.project_name);
          if (data.registration.university_name) setUniversity(data.registration.university_name);
        }
      } catch (error) {
        console.error("Error checking registration:", error);
      } finally {
        setIsCheckingReg(false);
      }
    };

    checkRegistration();
  }, [id, navigate]);

  const addMember = () => {
    if (members.length < 8) {
      setMembers([...members, { name: "", email: "", role: "" }]);
    }
  };

  const updateMember = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  const removeMember = (index) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const addLink = () => {
    setAdditionalLinks([...additionalLinks, { title: "", url: "" }]);
  };

  const updateLink = (index, field, value) => {
    const newLinks = [...additionalLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setAdditionalLinks(newLinks);
  };

  const removeLink = (index) => {
    setAdditionalLinks(additionalLinks.filter((_, i) => i !== index));
  };

  const handleScreenshotUpload = (e) => {
    const files = Array.from(e.target.files);
    const newScreenshots = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));
    setScreenshots([...screenshots, ...newScreenshots]);
  };

  const removeScreenshot = (index) => {
    const newScreenshots = screenshots.filter((_, i) => i !== index);
    setScreenshots(newScreenshots);
  };

  const validateSection = () => {
    switch(currentSection) {
      case 1:
        if (!projectName.trim()) return "Please enter a project name";
        if (!university.trim()) return "Please enter your university";
        if (isTeam) {
          if (!teamName.trim()) return "Please enter a team name";
          if (members.some(m => !m.name.trim() || !m.email.trim())) {
            return "Please fill in all team member details";
          }
        }
        break;
      case 2:
        if (!programmingLanguages.trim()) return "Please specify programming languages used";
        if (!projectDescription.trim()) return "Please provide a project description";
        if (!problemSolved.trim()) return "Please describe the problem solved";
        if (!impact.trim()) return "Please describe the project's impact";
        break;
      case 3:
        if (!videoUrl.trim()) return "Please provide a demo video link";
        if (!githubUrl.trim()) return "Please provide a GitHub repository link";
        break;
      case 4:
        if (!declarationConfirmed) return "Please confirm the declaration";
        if (!agreeToTerms) return "Please agree to the terms and conditions";
        break;
      default:
        return null;
    }
    return null;
  };

  const handleNext = () => {
    const error = validateSection();
    if (error) {
      alert(error);
      return;
    }
    if (currentSection < 4) {
      setCurrentSection(currentSection + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateSection();
    if (error) {
      alert(error);
      return;
    }

    setLoading(true);

    try {
      const submissionData = {
        hackathon_id: id,
        project_title: projectName,
        university,
        is_team: isTeam,
        team_name: isTeam ? teamName : null,
        members: isTeam ? members : null,
        programming_languages: programmingLanguages,
        description: projectDescription,
        problem_solved: problemSolved,
        impact,
        key_features: keyFeatures,
        challenges,
        video_link: videoUrl,
        github_link: githubUrl,
        live_demo_url: liveDemoUrl,
        additional_links: additionalLinks.filter(l => l.title && l.url),
        has_credentials: hasCredentials,
        credentials: hasCredentials ? credentials : null
      };

      await api.post('/submissions', submissionData);
      
      setSubmitted(true);
      
      setTimeout(() => {
        navigate(`/projects/${id}`);
      }, 3000);
    } catch (error) {
      alert("Failed to submit project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingReg) {
    return (
      <div className="submit-loading">
        <div className="loading-spinner"></div>
        <p>Verifying registration...</p>
      </div>
    );
  }

  if (needsRegistration) {
    return (
      <div className="registration-required-container">
        <div className="registration-card">
          <Shield className="error-icon" size={64} />
          <h1>Registration Required</h1>
          <p>You must register for this hackathon before you can submit a project.</p>
          <div className="action-steps">
            <div className="step">
              <span className="step-num">1</span>
              <span>Go to the hackathon details page</span>
            </div>
            <div className="step">
              <span className="step-num">2</span>
              <span>Click the "Register Now" button</span>
            </div>
            <div className="step">
              <span className="step-num">3</span>
              <span>Return here to submit your project</span>
            </div>
          </div>
          <Link to={`/projects/${id}`} className="return-btn">
            <ArrowLeft size={20} />
            Return to Hackathon Details
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="success-container">
        <div className="success-card">
          <div className="success-icon">
            <CheckCircle size={64} />
          </div>
          <h1>Submission Successful!</h1>
          <p>Your project has been successfully submitted to the hackathon.</p>
          <div className="success-details">
            <p>You will receive a confirmation email shortly.</p>
            <p>Our team will review your submission and get back to you within 48 hours.</p>
          </div>
          <Link to={`/projects/${id}`} className="success-btn">
            Return to Hackathon
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="submit-container">
      {/* Background Elements */}
      <div className="submit-bg">
        <div className="bg-sphere sphere-1"></div>
        <div className="bg-sphere sphere-2"></div>
        <div className="bg-sphere sphere-3"></div>
      </div>

      <div className="submit-wrapper">
        {/* Header */}
        <div className="submit-header">
          <Link to={`/projects/${id}`} className="back-button">
            <ArrowLeft size={20} />
            Back to Hackathon
          </Link>
          <div className="header-badge">
            <Sparkles size={16} />
            <span>Project Submission Portal</span>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="progress-section">
          <div className="progress-steps">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="progress-step-wrapper">
                <div 
                  className={`progress-step ${currentSection >= step ? 'active' : ''} ${currentSection > step ? 'completed' : ''}`}
                  onClick={() => currentSection > step && setCurrentSection(step)}
                >
                  <span className="step-number">{step}</span>
                  <span className="step-label">
                    {step === 1 && "Registration"}
                    {step === 2 && "Description"}
                    {step === 3 && "Media & Links"}
                    {step === 4 && "Declaration"}
                  </span>
                </div>
                {step < 4 && <div className={`progress-line ${currentSection > step ? 'completed' : ''}`}></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="submit-form">
          {/* Section 1: Registration & Team Info */}
          {currentSection === 1 && (
            <div className="form-section animate-fadeIn">
              <div className="section-header">
                <div className="section-icon">
                  <Users size={24} />
                </div>
                <div>
                  <h2>Registration & Team Information</h2>
                  <p>Tell us about your project and team</p>
                </div>
              </div>

              <div className="section-content">
                <div className="form-group">
                  <label className="form-label required">
                    <Code size={16} />
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Enter your project name"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required">
                    <School size={16} />
                    University / Organization
                  </label>
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    placeholder="Enter your university or organization name"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Participation Type</label>
                  <div className="toggle-group">
                    <button
                      type="button"
                      className={`toggle-btn ${!isTeam ? 'active' : ''}`}
                      onClick={() => setIsTeam(false)}
                    >
                      <User size={16} />
                      Individual
                    </button>
                    <button
                      type="button"
                      className={`toggle-btn ${isTeam ? 'active' : ''}`}
                      onClick={() => setIsTeam(true)}
                    >
                      <Users size={16} />
                      Team
                    </button>
                  </div>
                </div>

                {isTeam && (
                  <div className="team-section">
                    <div className="form-group">
                      <label className="form-label required">
                        <Users size={16} />
                        Team Name
                      </label>
                      <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="Enter your team name"
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="team-members">
                      <label className="form-label required">Team Members</label>
                      {members.map((member, index) => (
                        <div key={index} className="member-card">
                          <div className="member-header">
                            <span className="member-number">Member {index + 1}</span>
                            {index > 0 && (
                              <button
                                type="button"
                                className="remove-member"
                                onClick={() => removeMember(index)}
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                          <div className="member-fields">
                            <div className="field">
                              <User size={14} />
                              <input
                                type="text"
                                placeholder="Full Name"
                                value={member.name}
                                onChange={(e) => updateMember(index, 'name', e.target.value)}
                                required
                              />
                            </div>
                            <div className="field">
                              <Mail size={14} />
                              <input
                                type="email"
                                placeholder="Email Address"
                                value={member.email}
                                onChange={(e) => updateMember(index, 'email', e.target.value)}
                                required
                              />
                            </div>
                            <div className="field">
                              <Zap size={14} />
                              <input
                                type="text"
                                placeholder="Role (e.g., Developer, Designer)"
                                value={member.role}
                                onChange={(e) => updateMember(index, 'role', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      {members.length < 8 && (
                        <button type="button" className="add-member" onClick={addMember}>
                          <Plus size={16} />
                          Add Team Member
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section 2: Project Description */}
          {currentSection === 2 && (
            <div className="form-section animate-fadeIn">
              <div className="section-header">
                <div className="section-icon">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h2>Project Description</h2>
                  <p>Tell us about your innovative solution</p>
                </div>
              </div>

              <div className="section-content">
                <div className="form-group">
                  <label className="form-label required">
                    <Code size={16} />
                    Programming Languages & Technologies
                  </label>
                  <input
                    type="text"
                    value={programmingLanguages}
                    onChange={(e) => setProgrammingLanguages(e.target.value)}
                    placeholder="e.g., Python, React, Node.js, MongoDB"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required">
                    <FileText size={16} />
                    Project Description
                  </label>
                  <textarea
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Describe what your project does, its main features, and how it works..."
                    className="form-textarea"
                    rows="4"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required">
                    <Globe size={16} />
                    Problem Solved
                  </label>
                  <textarea
                    value={problemSolved}
                    onChange={(e) => setProblemSolved(e.target.value)}
                    placeholder="What problem does your project solve? Why is it important?"
                    className="form-textarea"
                    rows="3"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required">
                    <Award size={16} />
                    Global Impact
                  </label>
                  <textarea
                    value={impact}
                    onChange={(e) => setImpact(e.target.value)}
                    placeholder="How does your project help the world? What positive impact does it create?"
                    className="form-textarea"
                    rows="3"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Key Features</label>
                  <textarea
                    value={keyFeatures}
                    onChange={(e) => setKeyFeatures(e.target.value)}
                    placeholder="List the key features and functionalities of your project"
                    className="form-textarea"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Challenges Faced</label>
                  <textarea
                    value={challenges}
                    onChange={(e) => setChallenges(e.target.value)}
                    placeholder="What challenges did you face during development and how did you overcome them?"
                    className="form-textarea"
                    rows="3"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Media & Links */}
          {currentSection === 3 && (
            <div className="form-section animate-fadeIn">
              <div className="section-header">
                <div className="section-icon">
                  <Video size={24} />
                </div>
                <div>
                  <h2>Media & Links</h2>
                  <p>Share your project demo and resources</p>
                </div>
              </div>

              <div className="section-content">
                <div className="form-group">
                  <label className="form-label required">
                    <Video size={16} />
                    Demo Video (2-4 minutes)
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="YouTube or Vimeo link"
                    className="form-input"
                    required
                  />
                  <p className="field-hint">Please ensure your video demonstrates the project functionality</p>
                </div>

                <div className="form-group">
                  <label className="form-label required">
                    <Github size={16} />
                    GitHub Repository
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Globe size={16} />
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={liveDemoUrl}
                    onChange={(e) => setLiveDemoUrl(e.target.value)}
                    placeholder="https://your-project-demo.com"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Additional Links</label>
                  {additionalLinks.map((link, index) => (
                    <div key={index} className="link-group">
                      <input
                        type="text"
                        placeholder="Link Title"
                        value={link.title}
                        onChange={(e) => updateLink(index, 'title', e.target.value)}
                        className="link-title"
                      />
                      <input
                        type="url"
                        placeholder="URL"
                        value={link.url}
                        onChange={(e) => updateLink(index, 'url', e.target.value)}
                        className="link-url"
                      />
                      {index > 0 && (
                        <button type="button" className="remove-link" onClick={() => removeLink(index)}>
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" className="add-link" onClick={addLink}>
                    <Plus size={16} />
                    Add Link
                  </button>
                </div>

                <div className="form-group">
                  <label className="form-label">Screenshots (Optional)</label>
                  <div className="screenshot-upload">
                    <label className="upload-area">
                      <Upload size={32} />
                      <span>Click or drag to upload screenshots</span>
                      <span className="upload-hint">PNG, JPG up to 5MB each</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleScreenshotUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                  {screenshots.length > 0 && (
                    <div className="screenshot-preview">
                      {screenshots.map((screenshot, index) => (
                        <div key={index} className="preview-item">
                          <img src={screenshot.preview} alt={`Screenshot ${index + 1}`} />
                          <button onClick={() => removeScreenshot(index)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Declaration & Credentials */}
          {currentSection === 4 && (
            <div className="form-section animate-fadeIn">
              <div className="section-header">
                <div className="section-icon">
                  <Shield size={24} />
                </div>
                <div>
                  <h2>Declaration & Credentials</h2>
                  <p>Confirm your submission details</p>
                </div>
              </div>

              <div className="section-content">
                <div className="form-group">
                  <label className="form-label">
                    <Lock size={16} />
                    Login Credentials (If applicable)
                  </label>
                  <div className="toggle-group">
                    <button
                      type="button"
                      className={`toggle-btn ${hasCredentials ? 'active' : ''}`}
                      onClick={() => setHasCredentials(true)}
                    >
                      Yes, provide credentials
                    </button>
                    <button
                      type="button"
                      className={`toggle-btn ${!hasCredentials ? 'active' : ''}`}
                      onClick={() => setHasCredentials(false)}
                    >
                      No credentials needed
                    </button>
                  </div>
                  {hasCredentials && (
                    <textarea
                      value={credentials}
                      onChange={(e) => setCredentials(e.target.value)}
                      placeholder="Please provide test login credentials (email/username and password) for demo purposes"
                      className="form-textarea"
                      rows="3"
                    />
                  )}
                </div>

                <div className="declaration-card">
                  <div className="declaration-content">
                    <h3>Declaration of Originality</h3>
                    <p>I/We hereby declare that:</p>
                    <ul>
                      <li>This project is our original work and has not been copied from any source</li>
                      <li>All code and materials submitted are our own, except where properly credited</li>
                      <li>We have not violated any intellectual property rights</li>
                      <li>The project does not contain any malicious code or harmful content</li>
                      <li>We have the right to submit this project to the hackathon</li>
                    </ul>
                  </div>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={declarationConfirmed}
                      onChange={(e) => setDeclarationConfirmed(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    <span>I/We confirm the above declaration and take full responsibility for the originality of this project</span>
                  </label>
                </div>

                <div className="terms-card">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    <span>I/We agree to the hackathon terms and conditions, including the judging criteria and code of conduct</span>
                  </label>
                </div>

                <div className="submission-summary">
                  <h3>Submission Summary</h3>
                  <div className="summary-items">
                    <div className="summary-item">
                      <span>Project Name:</span>
                      <strong>{projectName || "Not specified"}</strong>
                    </div>
                    <div className="summary-item">
                      <span>Team:</span>
                      <strong>{isTeam ? teamName : "Individual"}</strong>
                    </div>
                    <div className="summary-item">
                      <span>University:</span>
                      <strong>{university || "Not specified"}</strong>
                    </div>
                    <div className="summary-item">
                      <span>GitHub:</span>
                      <strong>{githubUrl ? "✓ Provided" : "Not provided"}</strong>
                    </div>
                    <div className="summary-item">
                      <span>Video:</span>
                      <strong>{videoUrl ? "✓ Provided" : "Not provided"}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="form-navigation">
            {currentSection > 1 && (
              <button type="button" className="nav-btn prev" onClick={handlePrevious}>
                <ChevronLeft size={20} />
                Previous
              </button>
            )}
            {currentSection < 4 ? (
              <button type="button" className="nav-btn next" onClick={handleNext}>
                Next
                <ChevronRight size={20} />
              </button>
            ) : (
              <button type="submit" className="nav-btn submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="btn-spinner"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Project
                    <CheckCircle size={20} />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}