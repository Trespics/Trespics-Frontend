import SectionHeading from "@/components/SectionHeading";
import TeamMember from "@/components/TeamMember";
import { motion } from "framer-motion";
import { Target, Eye, Zap, Users } from "lucide-react";
import team1 from "@/assets/team-1.jpg";
import team2 from "@/assets/team-2.jpg";
import team3 from "@/assets/team-3.jpg";
import team4 from "@/assets/team-4.jpg";
import "./styles/About.css";

const team = [
  { name: "Alex Morgan", role: "CEO & Founder", image: team1 },
  { name: "Lisa Wang", role: "Lead Developer", image: team2 },
  { name: "David Clark", role: "Project Manager", image: team3 },
  { name: "Maya Santos", role: "UX Designer", image: team4 },
];
    
const values = [
  { icon: Target, title: "Our Mission", text: "To empower businesses with innovative digital solutions that drive real-world impact and sustainable growth." },
  { icon: Eye, title: "Our Vision", text: "To be the most trusted technology partner for businesses worldwide, delivering excellence in every project." },
];

const stats = [
  { value: "150+", label: "Projects Delivered" },
  { value: "50+", label: "Happy Clients" },
  { value: "5+", label: "Years Experience" },
  { value: "99%", label: "Client Satisfaction" },
];

const About = () => (
  <div className="about-page">
    {/* About */}
    <section className="about-section">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="section-label">About Us</p>
          <h1 className="about-title">
            We're a Team of Digital Creators
          </h1>
          <p className="about-description">
            Founded with a passion for technology, Florante has been helping businesses of all sizes build and scale their digital presence since 2024.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Mission & Vision */}
    <section className="mission-vision-section">
      <div className="container">
        <div className="values-grid">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="value-card"
            >
              <v.icon className="value-icon" />
              <h3 className="value-title">{v.title}</h3>
              <p className="value-text">{v.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="stat-item"
            >
              <p className="stat-value">{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Team */}
    {/* <section className="team-section">
      <div className="container">
        <SectionHeading label="Our Team" title="Meet the Experts" description="A dedicated team of professionals committed to delivering excellence." />
        <div className="team-grid">
          {team.map((m, i) => (
            <TeamMember key={m.name} {...m} index={i} />
          ))}
        </div>
      </div>
    </section> */}

    {/* Timeline */}
    {/* <section className="timeline-section">
      <div className="container">
        <SectionHeading label="Our Journey" title="Company Timeline" />
        <div className="timeline-container">
          {[
            { year: "2020", event: "Florante founded with a small team of 3 developers." },
            { year: "2021", event: "Delivered first 25 projects and expanded the team." },
            { year: "2022", event: "Launched our first SaaS product line." },
            { year: "2023", event: "Reached 100+ projects with clients across 10 countries." },
            { year: "2024", event: "Expanded into AI-powered systems and enterprise solutions." },
          ].map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="timeline-item"
            >
              <div className="timeline-marker-container">
                <div className="timeline-marker">
                  {item.year.slice(2)}
                </div>
                {i < 4 && <div className="timeline-line" />}
              </div>
              <div className="timeline-content">
                <p className="timeline-year">{item.year}</p>
                <p className="timeline-event">{item.event}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section> */}
  </div>
);

export default About;