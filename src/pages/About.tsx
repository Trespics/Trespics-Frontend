import SectionHeading from "@/components/SectionHeading";
import TeamMember from "@/components/TeamMember";
import { motion } from "framer-motion";
import { Target, Eye, Zap, Users } from "lucide-react";
import team1 from "@/assets/team-1.jpg";
import team2 from "@/assets/team-2.jpg";
import team3 from "@/assets/team-3.jpg";
import team4 from "@/assets/team-4.jpg";

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
  <div className="pt-16">
    {/* Hero */}
    <section className="section-padding bg-section-alt">
      <div className="container mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-accent font-medium text-sm uppercase tracking-wider mb-2">About Us</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
            We're a Team of Digital Creators
            {/* <span className="gradient-text">Digital Creators</span> */}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Founded with a passion for technology, Florante has been helping businesses of all sizes build and scale their digital presence since 2024.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Mission & Vision */}
    <section className="section-padding">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card border rounded-lg p-8"
            >
              <v.icon size={40} className="text-primary mb-4" />
              <h3 className="font-heading text-2xl font-semibold mb-3">{v.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{v.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="section-padding gradient-primary">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground">{s.value}</p>
              <p className="text-primary-foreground/70 mt-2">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Team */}
    {/* <section className="section-padding">
      <div className="container mx-auto">
        <SectionHeading label="Our Team" title="Meet the Experts" description="A dedicated team of professionals committed to delivering excellence." />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {team.map((m, i) => (
            <TeamMember key={m.name} {...m} index={i} />
          ))}
        </div>
      </div>
    </section> */}

    {/* Timeline */}
    {/* <section className="section-padding bg-section-alt">
      <div className="container mx-auto max-w-2xl">
        <SectionHeading label="Our Journey" title="Company Timeline" />
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
            className="flex gap-6 mb-8"
          >
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-heading font-bold text-xs">
                {item.year.slice(2)}
              </div>
              {i < 4 && <div className="w-0.5 h-full bg-border mt-2" />}
            </div>
            <div className="pb-4">
              <p className="font-heading font-semibold">{item.year}</p>
              <p className="text-muted-foreground text-sm">{item.event}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section> */}
  </div>
);

export default About;
