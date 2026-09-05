import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Baby, 
  HeartHandshake, 
  Accessibility, 
  CheckCircle2, 
  Users, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const CategoryCards = () => {
  const { navigateToRegister } = useApp();

  return (
    <section className="section section-priority-cards" id="priority-categories">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Sanctioned Categories</span>
          <h2 className="section-title">Priority Admission Tracks</h2>
          <p className="section-desc">
            Government of Andhra Pradesh priority passes ensure dignified, shaded, and barrier-free access across all 45 Pushkaralu Ghats.
          </p>
        </div>

        {/* 3 Institutional Category Cards */}
        <div className="category-cards-grid">
          {/* Card 1: Child Below 5 */}
          <div className="priority-card card-child">
            <div className="priority-card-header">
              <div className="card-icon-bubble">
                <Baby size={24} />
              </div>
              <span className="priority-badge">Age &lt; 5 Years</span>
            </div>

            <h3 className="card-title">Child Below 5 Years</h3>
            <p className="card-desc">
              Fast-track lane priority to safeguard infants and young children from crowd surges and direct afternoon sun exposure.
            </p>

            <ul className="card-features">
              <li className="card-feature-item">
                <CheckCircle2 size={16} />
                <span><strong>Age Rule:</strong> Strictly below 5 years on Pushkara date.</span>
              </li>
              <li className="card-feature-item">
                <CheckCircle2 size={16} />
                <span><strong>Lane Access:</strong> Dedicated Family & Toddler Priority Corridor.</span>
              </li>
              <li className="card-feature-item">
                <CheckCircle2 size={16} />
                <span><strong>Document:</strong> Birth Certificate / Aadhaar Child Card.</span>
              </li>
            </ul>

            <div className="companion-highlight-box">
              <Users size={16} style={{ color: 'var(--gov-green-900)', flexShrink: 0 }} />
              <div>
                <strong>Companion Policy:</strong> 1 Parent / Guardian admitted on same pass.
              </div>
            </div>

            <button 
              className="btn btn-primary"
              style={{ marginTop: 'auto', width: '100%' }}
              onClick={() => navigateToRegister('child')}
              id="select-child-category-btn"
            >
              <span>Register Child Pass</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 2: Senior Citizen 70+ */}
          <div className="priority-card card-senior">
            <div className="priority-card-header">
              <div className="card-icon-bubble">
                <HeartHandshake size={24} />
              </div>
              <span className="priority-badge">Age 70+ Years</span>
            </div>

            <h3 className="card-title">Senior Citizen 70+</h3>
            <p className="card-desc">
              Expedited, shaded corridor with priority seating, hydration points, and gentle-slope ramp access to the holy bathing ghats.
            </p>

            <ul className="card-features">
              <li className="card-feature-item">
                <CheckCircle2 size={16} />
                <span><strong>Age Rule:</strong> Strictly 70 years of age or above.</span>
              </li>
              <li className="card-feature-item">
                <CheckCircle2 size={16} />
                <span><strong>Lane Access:</strong> Shaded elderly priority lane with volunteer escorts.</span>
              </li>
              <li className="card-feature-item">
                <CheckCircle2 size={16} />
                <span><strong>Document:</strong> Aadhaar / Senior Citizen ID / Voter ID.</span>
              </li>
            </ul>

            <div className="companion-highlight-box">
              <Users size={16} style={{ color: 'var(--gov-green-900)', flexShrink: 0 }} />
              <div>
                <strong>Companion Policy:</strong> 1 Family Escort admitted on same pass.
              </div>
            </div>

            <button 
              className="btn btn-primary"
              style={{ marginTop: 'auto', width: '100%' }}
              onClick={() => navigateToRegister('senior')}
              id="select-senior-category-btn"
            >
              <span>Register Senior Pass</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 3: Special Assistance */}
          <div className="priority-card card-special">
            <div className="priority-card-header">
              <div className="card-icon-bubble">
                <Accessibility size={24} />
              </div>
              <span className="priority-badge">Special Needs</span>
            </div>

            <h3 className="card-title">Special Assistance</h3>
            <p className="card-desc">
              Dedicated accessibility corridor for pilgrims with physical disabilities, mobility challenges, or medical conditions.
            </p>

            <ul className="card-features">
              <li className="card-feature-item">
                <CheckCircle2 size={16} />
                <span><strong>Support:</strong> Wheelchair transit, visual aid & ramp clearance.</span>
              </li>
              <li className="card-feature-item">
                <CheckCircle2 size={16} />
                <span><strong>Lane Access:</strong> Barrier-free universal accessibility gate.</span>
              </li>
              <li className="card-feature-item">
                <CheckCircle2 size={16} />
                <span><strong>Document:</strong> Disability Certificate / Medical Assessment.</span>
              </li>
            </ul>

            <div className="companion-highlight-box">
              <Users size={16} style={{ color: 'var(--gov-green-900)', flexShrink: 0 }} />
              <div>
                <strong>Companion Policy:</strong> 1 Caregiver admitted on same pass.
              </div>
            </div>

            <button 
              className="btn btn-primary"
              style={{ marginTop: 'auto', width: '100%' }}
              onClick={() => navigateToRegister('special')}
              id="select-special-category-btn"
            >
              <span>Register Special Pass</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
