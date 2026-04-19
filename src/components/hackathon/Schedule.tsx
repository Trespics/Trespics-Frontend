import React from 'react';

interface ScheduleItem {
  day: string;
  date: string;
  time?: string;
  activity: string;
}

interface ScheduleProps {
  schedule: ScheduleItem[];
}

const Schedule: React.FC<ScheduleProps> = ({ schedule }) => {
  return (
    <div className="schedule-section" id="schedule">
      <h2>Event Schedule</h2>
      <div className="timeline">
        {schedule && schedule.length > 0 ? (
          schedule.map((item, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-badge">
                <div className="timeline-date">{item.date}</div>
              </div>
              <div className="timeline-content">
                <h3>{item.day}</h3>
                {item.time && <div className="timeline-time">{item.time}</div>}
                <p>{item.activity}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-data-msg">Schedule will be announced shortly.</p>
        )}
      </div>
    </div>
  );
};

export default Schedule;
