import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Disruption, Resident } from '../types';
import { getDisruptions, getResidents } from '../services/api';
import { CityMap } from '../components/CityMap';

export const CityMapView: React.FC = () => {
  const [disruptions, setDisruptions] = useState<Disruption[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);

  useEffect(() => {
    Promise.all([getDisruptions(), getResidents()]).then(([dList, rList]) => {
      setDisruptions(dList);
      setResidents(rList);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div>
        <div className="flex items-center space-x-2">
          <MapPin className="w-6 h-6 text-civic-600" />
          <h1 className="text-2xl font-bold text-slate-900">City Zone & Disruption Geographic Map</h1>
        </div>
        <p className="text-xs text-slate-600 mt-1">
          Interactive map visualizing disruption radii, affected transit routes, and resident match pins across Chennai city zones.
        </p>
      </div>

      <CityMap disruptions={disruptions} residents={residents} />
    </div>
  );
};
