import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Calendar, Users, Trophy, Clock, ChevronRight, Sparkles, Target, Award, Flame, TrendingUp, Star } from "lucide-react";
import api from "../lib/api";
import "./styles/Projects.css";

interface Hackathon {
  id: string;
  title: string;
  description: string;
  start_date: string;
  deadline: string;
  status: string;
  participants?: number;
  prize?: string;
  level?: string;
}



export default function HackathonProjects() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(null);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const response = await api.get("/hackathons");
        setHackathons(response.data);
      } catch (error) {
        console.error("Error fetching hackathons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHackathons();
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Ongoing":
        return { color: "status-ongoing", icon: Flame, label: "Live Now" };
      case "Upcoming":
        return { color: "status-upcoming", icon: Clock, label: "Coming Soon" };
      case "Closed":
        return { color: "status-closed", icon: Trophy, label: "Completed" };
      default:
        return { color: "status-default", icon: Calendar, label: status };
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "level-beginner";
      case "Intermediate": return "level-intermediate";
      case "Advanced": return "level-advanced";
      case "Expert": return "level-expert";
      default: return "level-all";
    }
  };

  const filteredHackathons = hackathons.filter(h => {
    const matchesFilter = filter === "all" || h.status.toLowerCase() === filter;
    const matchesSearch = h.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         h.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: hackathons.length,
    ongoing: hackathons.filter(h => h.status === "Ongoing").length,
    upcoming: hackathons.filter(h => h.status === "Upcoming").length,
    participants: hackathons.reduce((sum, h) => sum + (h.participants || 0), 0)
  };

  return (
    <div className="hackathon-container">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="gradient-sphere sphere-1"></div>
        <div className="gradient-sphere sphere-2"></div>
        <div className="gradient-sphere sphere-3"></div>
      </div>

      {/* Hero Section */}
      <div className="hackathons-section">
        <div className="hackathons-badges">
          <Sparkles size={16} />
          <span>Innovation Meets Opportunity</span>
        </div>
        <h1 className="projects-title">
          Hackathon
          <span className="hackathons-title-gradient"> Project Portal</span>
        </h1>
        <p className="hackathons-subtitle">
          Browse upcoming challenges, form your team, and build something amazing that could change the world
        </p>
        
        {/* Stats Grid */}
        <div className="hackathons-stats">
          <div className="hackathons-stat">
            <div className="hackathons-stat-value">{stats.total}</div>
            <div className="hackathons-stat-label">Active Challenges</div>
          </div>
          <div className="hackathons-stat-divider"></div>
          <div className="hackathons-stat">
            <div className="hackathons-stat-value">{stats.ongoing}</div>
            <div className="hackathons-stat-label">Live Now</div>
          </div>
          <div className="hackathons-stat-divider"></div>
          <div className="hackathons-stat">
            <div className="hackathons-stat-value">{stats.upcoming}</div>
            <div className="hackathons-stat-label">Upcoming</div>
          </div>
          <div className="hackathons-stat-divider"></div>
          <div className="hackathons-stat">
            <div className="hackathons-stat-value">{stats.participants.toLocaleString()}+</div>
            <div className="hackathons-stat-label">Participants</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="filters-section">
        <div className="filters-wrapper">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All Events
            </button>
            <button 
              className={`filter-btn ${filter === "ongoing" ? "active" : ""}`}
              onClick={() => setFilter("ongoing")}
            >
              <Flame size={16} />
              Live Now
            </button>
            <button 
              className={`filter-btn ${filter === "upcoming" ? "active" : ""}`}
              onClick={() => setFilter("upcoming")}
            >
              <Clock size={16} />
              Upcoming
            </button>
            <button 
              className={`filter-btn ${filter === "closed" ? "active" : ""}`}
              onClick={() => setFilter("closed")}
            >
              <Trophy size={16} />
              Completed
            </button>
          </div>
          
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search hackathons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading hackathons...</p>
        </div>
      ) : filteredHackathons.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎯</div>
          <h3>No hackathons found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <>
          {/* Hackathons Grid */}
          <div className="hackathons-grid">
            {filteredHackathons.map((hackathon, index) => {
              const StatusIcon = getStatusConfig(hackathon.status).icon;
              return (
                <div 
                  key={hackathon.id} 
                  className="hackathon-card"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Card Gradient Border */}
                  <div className="card-glow"></div>
                  
                  {/* Card Header */}
                  <div className="card-header">
                    <div className={`status-badge ${getStatusConfig(hackathon.status).color}`}>
                      <StatusIcon size={14} />
                      <span>{getStatusConfig(hackathon.status).label}</span>
                    </div>
                    <div className="prize-badge">
                      <Trophy size={14} />
                      <span>{hackathon.prize || "Prize TBA"}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="card-content">
                    <h3 className="card-title">{hackathon.title}</h3>
                    <p className="card-description">{hackathon.description}</p>
                    
                    {/* Details */}
                    <div className="card-details">
                      <div className="detail-item">
                        <Calendar size={16} />
                        <div>
                          <span className="detail-label">Starts</span>
                          <span className="detail-value">
                            {format(new Date(hackathon.start_date), "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                      <div className="detail-item">
                        <Clock size={16} />
                        <div>
                          <span className="detail-label">Deadline</span>
                          <span className="detail-value">
                            {format(new Date(hackathon.deadline), "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                      <div className="detail-item">
                        <Users size={16} />
                        <div>
                          <span className="detail-label">Participants</span>
                          <span className="detail-value">
                            {hackathon.participants?.toLocaleString() || "0"}
                          </span>
                        </div>
                      </div>
                      <div className="detail-item">
                        <Target size={16} />
                        <div>
                          <span className="detail-label">Level</span>
                          <span className={`level-badge ${getLevelColor(hackathon.level)}`}>
                            {hackathon.level || "All Levels"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="card-footer">
                    <Link 
                      to={`/projects/${hackathon.id}`}
                      className="view-details-btn"
                      onMouseEnter={() => setSelectedHackathon(hackathon)}
                      onMouseLeave={() => setSelectedHackathon(null)}
                    >
                      <span>View Details</span>
                      <ChevronRight size={18} />
                    </Link>
                  </div>

                  {/* Hover Progress Bar */}
                  <div className="card-progress"></div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Featured Section */}
      {!loading && hackathons.length > 0 && (
        <div className="featured-section">
          <div className="featured-header">
            <h2>Why Join a Hackathon?</h2>
            <p>Unlock opportunities that can transform your career</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Award size={24} />
              </div>
              <h3>Win Prizes</h3>
              <p>Compete for exciting prizes, recognition, and funding opportunities</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Users size={24} />
              </div>
              <h3>Network</h3>
              <p>Connect with industry experts, mentors, and fellow innovators</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <TrendingUp size={24} />
              </div>
              <h3>Learn & Grow</h3>
              <p>Gain hands-on experience with cutting-edge technologies</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Star size={24} />
              </div>
              <h3>Build Portfolio</h3>
              <p>Create impressive projects that showcase your skills to employers</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}