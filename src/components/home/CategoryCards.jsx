import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Baby, 
  HeartHandshake, 
  Accessibility, 
  CheckCircle, 
  Users, 
  ShieldCheck, 
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';

export const CategoryCards = () => {
  const { navigateToRegister } = useApp();

  return (
    <section className="section section-bg-white" id="priority-categories">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Official Priority Assistance</span>
          <h2 className="section-title">Select Your Priority Category</h2>
          <p className="section-desc">
            Government priority passes ensure fast-track, dignified, and comfortable entry with dedicated special queues at all 45 Pushkaralu Ghats.
          </p>
        </div>

        {/* 3 Large Category Cards */}
        <div className="category-cards-grid">
          {/* Card 1: Child Below 5 */}
          <div className="priority-card card-child">
            <div className="priority-card-header">
              <div className="card-icon-bubble">
                👶
              </div>
              <span className="priority-badge">Age &lt; 5 Years</span>
            </div>

            <h3 className="card-title">Child Below 5</h3>
            <p className="card-desc">
              For children under 5 years of age. Fast-track entry to protect toddlers from crowd congestion and sun exposure.
            </p>

            <ul className="card-features">
              <li className="card-feature-item">
                <CheckCircle size={17} />
                <span><strong>Age verification:</strong> Strictly below 5 years (0-4 yrs).</span>
              </li>
              <li className="card-feature-item">
                <CheckCircle size={17} />
                <span><strong>Dedicated lane:</strong> Direct entry through Family & Child gate.</span>
              </li>
              <li className="card-feature-item">
                <CheckCircle size={17} />
                <span><strong>Document:</strong> Birth Certificate / Aadhaar (Demo Mock).</span>
              </li>
            </ul>

            <div className="companion-highlight-box">
              <Users size={18} style={{ color: 'var(--gov-green-850)', flexShrink: 0 }} />
              <div>
                <strong>Companion Allowed: 1</strong> (Guardian enters on same token)
              </div>
            </div>

            <button 
              className="btn btn-primary"
              style={{ marginTop: 'auto', width: '100%' }}
              onClick={() => navigateToRegister('child')}
              id="select-child-category-btn"
            >
              <span>Get Child Token</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Card 2: Senior Citizen 70+ */}
          <div className="priority-card card-senior">
            <div className="priority-card-header">
              <div className="card-icon-bubble">
                👴
              </div>
              <span className="priority-badge">Age 70+ Years</span>
            </div>

            <h3 className="card-title">Senior Citizen 70+</h3>
            <p className="card-desc">
              For elderly pilgrims aged 70 years and above. Priority seating, shaded rest areas, and gentle slope ramp access.
            </p>

            <ul className="card-features">
              <li className="card-feature-item">
                <CheckCircle size={17} />
                <span><strong>Age verification:</strong> Strictly 70 years or above.</span>
              </li>
              <li className="card-feature-item">
                <CheckCircle size={17} />
                <span><strong>Dedicated lane:</strong> Shaded elderly priority walkway.</span>
              </li>
              <li className="card-feature-item">
                <CheckCircle size={17} />
                <span><strong>Document:</strong> Aadhaar / Senior ID / Voter Card (Demo Mock).</span>
              </li>
            </ul>

            <div className="companion-highlight-box">
              <Users size={18} style={{ color: 'var(--gov-green-850)', flexShrink: 0 }} />
              <div>
                <strong>Companion Allowed: 1</strong> (Escort enters on same token)
              </div>
            </div>

            <button 
              className="btn btn-primary"
              style={{ marginTop: 'auto', width: '100%' }}
              onClick={() => navigateToRegister('senior')}
              id="select-senior-category-btn"
            >
              <span>Get Senior Token</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Card 3: Special Assistance */}
          <div className="priority-card card-special">
            <div className="priority-card-header">
              <div className="card-icon-bubble">
                ♿
              </div>
              <span className="priority-badge">Special Needs</span>
            </div>

            <h3 className="card-title">Special Assistance</h3>
            <p className="card-desc">
              For differently-abled pilgrims, mobility-impaired, or those requiring medical wheelchairs and special physical assistance.
            </p>

            <ul className="card-features">
              <li className="card-feature-item">
                <CheckCircle size={17} />
                <span><strong>Assistance type:</strong> Wheelchair, visual support, mobility aid.</span>
              </li>
              <li className="card-feature-item">
                <CheckCircle size={17} />
                <span><strong>Dedicated lane:</strong> Barrier-free ramp & volunteer assistance.</span>
              </li>
              <li className="card-feature-item">
                <CheckCircle size={17} />
                <span><strong>Document:</strong> Disability / Medical ID (Demo Mock).</span>
              </li>
            </ul>

            <div className="companion-highlight-box">
              <Users size={18} style={{ color: 'var(--gov-green-850)', flexShrink: 0 }} />
              <div>
                <strong>Companion Allowed: 1</strong> (Caregiver assists throughout)
              </div>
            </div>

            <button 
              className="btn btn-primary"
              style={{ marginTop: 'auto', width: '100%' }}
              onClick={() => navigateToRegister('special')}
              id="select-special-category-btn"
            >
              <span>Get Special Token</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
