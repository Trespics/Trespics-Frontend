import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Calendar, Users, Trophy, Clock, ChevronRight, Sparkles, Target, Award, Flame, TrendingUp, Star, Filter, Search } from "lucide-react";
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
      {/* Compact Hero Section */}
      <div className="hackathons-hero">
        <div className="hackathons-hero-content">
          <div className="hackathons-badge">
            <Sparkles size={18} />
            <span>Innovation Meets Opportunity</span>
          </div>
          <h1 className="hackathons-title">
            Hackathon Project Portal
          </h1>
          <p className="hackathons-description">
            Browse upcoming challenges, form your team, and build something amazing that could change the world
          </p>
          
          {/* Compact Stats */}
          <div className="hackathons-stats-row">
            <div className="stat-chip">
              <span className="stat-chip-value">{stats.total}</span>
              <span className="stat-chip-label">Challenges</span>
            </div>
            <div className="stat-chip">
              <Flame size={14} />
              <span className="stat-chip-value">{stats.ongoing}</span>
              <span className="stat-chip-label">Live</span>
            </div>
            <div className="stat-chip">
              <Clock size={14} />
              <span className="stat-chip-value">{stats.upcoming}</span>
              <span className="stat-chip-label">Upcoming</span>
            </div>
            <div className="stat-chip">
              <Users size={14} />
              <span className="stat-chip-value">{stats.participants.toLocaleString()}+</span>
              <span className="stat-chip-label">Participants</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="filters-section">
        <div className="filters-container">
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button 
              className={`filter-tab ${filter === "ongoing" ? "active" : ""}`}
              onClick={() => setFilter("ongoing")}
            >
              <Flame size={14} />
              Live
            </button>
            <button 
              className={`filter-tab ${filter === "upcoming" ? "active" : ""}`}
              onClick={() => setFilter("upcoming")}
            >
              <Clock size={14} />
              Upcoming
            </button>
            <button 
              className={`filter-tab ${filter === "closed" ? "active" : ""}`}
              onClick={() => setFilter("closed")}
            >
              <Trophy size={14} />
              Completed
            </button>
          </div>
          
          <div className="search-box">
            <Search size={18} />
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

      {/* Content Section */}
      <div className="hackathons-content">
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
            <button 
              className="reset-btn"
              onClick={() => {
                setSearchTerm("");
                setFilter("all");
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="results-count">
              <span>Found {filteredHackathons.length} hackathons</span>
            </div>

            {/* Hackathons Grid */}
            <div className="hackathons-grid">
              {filteredHackathons.map((hackathon, index) => {
                const StatusIcon = getStatusConfig(hackathon.status).icon;
                return (
                  <div 
                    key={hackathon.id} 
                    className="hackathon-card"
                  >
                    {/* Status Badge */}
                    <div className={`card-status-badge ${getStatusConfig(hackathon.status).color}`}>
                      <StatusIcon size={14} />
                      <span>{getStatusConfig(hackathon.status).label}</span>
                    </div>

                    {/* Prize Badge */}
                    <div className="card-prize-badge">
                      <Trophy size={14} />
                      <span>{hackathon.prize || "Prize TBA"}</span>
                    </div>

                    {/* Card Content */}
                    <div className="card-body">
                      <h3 className="card-title">{hackathon.title}</h3>
                      <p className="card-description">{hackathon.description}</p>
                      
                      {/* Details Grid */}
                      <div className="card-details-grid">
                        <div className="detail-row">
                          <Calendar size={14} />
                          <span className="detail-label">Starts:</span>
                          <span className="detail-value">
                            {format(new Date(hackathon.start_date), "MMM d, yyyy")}
                          </span>
                        </div>
                        <div className="detail-row">
                          <Clock size={14} />
                          <span className="detail-label">Deadline:</span>
                          <span className="detail-value">
                            {format(new Date(hackathon.deadline), "MMM d, yyyy")}
                          </span>
                        </div>
                        <div className="detail-row">
                          <Users size={14} />
                          <span className="detail-label">Participants:</span>
                          <span className="detail-value">
                            {hackathon.participants?.toLocaleString() || "0"}
                          </span>
                        </div>
                        <div className="detail-row">
                          <Target size={14} />
                          <span className="detail-label">Level:</span>
                          <span className={`level-tag ${getLevelColor(hackathon.level)}`}>
                            {hackathon.level || "All Levels"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="card-footer">
                      <Link 
                        to={`/projects/${hackathon.id}`}
                        className="details-link"
                      >
                        <span>View Details</span>
                        <ChevronRight size={16} />
                      </Link>
                    </div>
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
    </div>
  );
}