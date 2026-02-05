import React from 'react';
import { GeoProject } from '../types';
import './InfoPanel.css';

interface InfoPanelProps {
  selectedProject: GeoProject | null;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ selectedProject }) => {
  if (!selectedProject) {
    return (
      <div className="info-panel">
        <div className="info-empty">
          <p>Select a project to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="info-panel">
      <div className="info-main">
        <div className="project-name-section">
          <label className="label">Project Name</label>
          <h3 className="project-title">{selectedProject.projectName}</h3>
        </div>

        <div className="coordinates-section">
          <div className="coordinate-box">
            <label className="label">Latitude</label>
            <p className="coordinate-value latitude">{selectedProject.latitude.toFixed(6)}°</p>
            <p className="coordinate-decimal">{selectedProject.latitude.toFixed(4)}</p>
          </div>
          <div className="coordinate-box">
            <label className="label">Longitude</label>
            <p className="coordinate-value longitude">{selectedProject.longitude.toFixed(6)}°</p>
            <p className="coordinate-decimal">{selectedProject.longitude.toFixed(4)}</p>
          </div>
        </div>

        <div className="info-details">
          <div className="info-item">
            <label className="label">Project ID</label>
            <p className="info-value">{selectedProject.id}</p>
          </div>

          <div className="info-item">
            <label className="label">Status</label>
            <p className={`info-value status status-${selectedProject.status.toLowerCase()}`}>
              {selectedProject.status}
            </p>
          </div>

          <div className="info-item">
            <label className="label">Last Updated</label>
            <p className="info-value">{selectedProject.lastUpdated}</p>
          </div>

          <div className="info-item full-width">
            <label className="label">Full Coordinates</label>
            <p className="info-value coordinates-text">
              {selectedProject.latitude.toFixed(6)}, {selectedProject.longitude.toFixed(6)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
