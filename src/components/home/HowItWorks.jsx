import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, UserCheck, FileCheck, Clock, QrCode, ArrowRight } from 'lucide-react';

export const HowItWorks = () => {
  const { navigateToRegister } = useApp();

  const steps = [
    {
      num: 1,
      title: 'Select Ghat Location',
      desc: 'Choose from 45 sanctioned Godavari Pushkara ghat locations with real-time capacity management.',
      icon: <MapPin size={22} />
    },
    {
      num: 2,
      title: 'Enter Pilgrim Details',
      desc: 'Provide pilgrim particulars and date of birth for automated statutory age classification.',
      icon: <UserCheck size={22} />
    },
    {
      num: 3,
      title: 'Document Proof',
      desc: 'Attach simulated identity verification proof (Aadhaar, Birth Certificate, or Senior ID).',
      icon: <FileCheck size={22} />
    },
    {
      num: 4,
      title: 'Select Morning Slot',
      desc: 'Choose a dedicated 30-minute morning bathing slot (6:00 AM – 12:00 PM) for crowd regulation.',
      icon: <Clock size={22} />
    },
    {
      num: 5,
      title: 'Receive Official Pass',
      desc: 'Generate your official digital token pass with instant QR code and 1-companion authorization.',
      icon: <QrCode size={22} />
    }
  ];

  return (
    <section className="section section-how-it-works" id="how-it-works">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Standard Operating Procedure</span>
          <h2 className="section-title">How Digi Token Priority Works</h2>
          <p className="section-desc">
            Streamlined 5-step digital reservation designed for elderly pilgrims, families, and caregivers.
          </p>
        </div>

        <div className="how-it-works-grid">
          {steps.map((step) => (
            <div key={step.num} className="step-card">
              <div className="step-number">{step.num}</div>
              <div className="step-icon">{step.icon}</div>
              <h4 className="step-title">{step.title}</h4>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <button 
            className="btn btn-primary btn-lg"
            onClick={() => navigateToRegister()}
          >
            <span>Proceed to Token Registration</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};
