import { useEffect, useState } from 'react';
import { loadAffirmations, getDailyAffirmation } from './utils/affirmations';
import './DailyAffirmationWidget.css'; // optional CSS for styling & animation

function DailyAffirmationWidget() {
  const [affirmations, setAffirmations] = useState([]);
  const [category, setCategory] = useState('All');
  const [dailyAffirmation, setDailyAffirmation] = useState(null);

  const categories = [
    'All',
    'Career & Business',
    'Wealth & Finance',
    'Health & Wellness',
    'Relationships & Love',
    'Personal Growth',
    'Lifestyle & Social',
    'Family & Home',
    'Spiritual & Purpose',
    'Creativity',
    'Adventure',
    'Contribution',
    'Resilience'
  ];

  useEffect(() => {
    async function fetchData() {
      const data = await loadAffirmations();
      setAffirmations(data);

      const selected = getDailyAffirmation(data, new Date(), category === 'All' ? null : category);
      setDailyAffirmation(selected);
    }

    fetchData();
  }, [category]);

  if (!dailyAffirmation) return <div>Loading daily affirmation...</div>;

  return (
    <div className="affirmation-widget">
      <h2>Daily Affirmation</h2>

      {/* Category Selector */}
      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
        className="affirmation-category-select"
      >
        {categories.map(cat => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* Affirmation Display */}
      <div className="affirmation-card fade-in">
        <h3>{dailyAffirmation.category}</h3>
        <p>{dailyAffirmation.affirmation}</p>
        <small>{dailyAffirmation.micro_prompt}</small>
      </div>
    </div>
  );
}

export default DailyAffirmationWidget;
