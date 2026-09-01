import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, UserCheck, ShieldCheck, Clock, QrCode, ArrowRight } from 'lucide-react';

export const HowItWorks = () => {
  const { navigateToRegister } = useApp();

  const steps = [
    {
      num: 1,
      title: 'Select Ghat Location',
      desc: 'Choose from 45 official Godavari Pushkara ghat locations with real-time capacity monitoring.',
      icon: <MapPin size={24} />
    },
    {
      num: 2,
      title: 'Enter Pilgrim Details',
      desc: 'Enter pilgrim info with date of birth. Age is automatically calculated for verification.',
      icon: <UserCheck size={24} />
    },
    {
      num: 3,
      title: 'Demo ID Verification',
      desc: 'Simulate document verification with mock Aadhaar or Birth Certificate without sharing real data.',
      icon: <ShieldCheck size={24} />
    },
    {
      num: 4,
      title: 'Choose Time Slot',
      desc: 'Pick a convenient 30-minute morning slot (6:00 AM – 12:00 PM) to avoid crowd congestion.',
      icon: <Clock size={24} />
    },
    {
      num: 5,
      title: 'Get Digi Token Pass',
      desc: 'Receive your secure QR Code token pass on your phone with 1-companion priority entry permission.',
      icon: <QrCode size={24} />
    }
  ];

  return (
    <section className="section" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Simple 5-Step Process</span>
          <h2 className="section-title">How Digi Token Priority Works</h2>
          <p className="section-desc">
            Designed for elderly pilgrims and families to easily secure priority access in under 2 minutes.
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

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button 
            className="btn btn-primary btn-lg"
            onClick={() => navigateToRegister()}
          >
            <span>Start Digi Token Registration</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};
