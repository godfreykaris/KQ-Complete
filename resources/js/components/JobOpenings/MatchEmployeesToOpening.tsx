
import React, { useState, useEffect } from 'react';
import apiBaseUrl from '../../config';
import LoadingComponent from '../LoadingComponent';

type Opening = {
    id: number;
    title: string;
    description: string;
  };

  
const MatchEmployeesToOpenings = () => {
  const [openings, setOpenings] = useState<Opening[]>([]);
  const [selectedOpeningId, setSelectedOpeningId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchOpenings();
  }, []);

  const fetchOpenings = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/openings`);
      const data = await response.json();
      setOpenings(data.openings);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching openings:', error);
      setIsLoading(false);
    }
  };

  const handleOpeningChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setSelectedOpeningId(value ? parseInt(value) : null);
  };

  const getMatchingEmployeesPDF = async () => {
    try {
      if (selectedOpeningId) {
        const response = await fetch(`${apiBaseUrl}/openings/match_employees/${selectedOpeningId}`, {
          method: 'GET',
        });

        if (response.ok) {
          const pdfBlob = await response.blob();
          const pdfUrl = URL.createObjectURL(pdfBlob);
          setPdfUrl(pdfUrl);
        } else {
          console.error('Error getting matching employees PDF:', response);
        }
      }
    } catch (error) {
      console.error('Error getting matching employees PDF:', error);
    }
  };

  useEffect(() => {
    if (selectedOpeningId) {
      getMatchingEmployeesPDF();
    }
  }, [selectedOpeningId]);

  return (
    <div className="text-center">
        <h2>Match Employees to Openings</h2>
        {isLoading ? (
          <LoadingComponent />
        ) : (
          <div className="row justify-content-center">
            <div className="col-md-6"> {/* Set the desired width */}
              <label htmlFor="openingSelect">Select an Opening:</label>
              <select
                id="openingSelect"
                value={selectedOpeningId ?? ''}
                className="form-control"
                onChange={handleOpeningChange}
              >
                <option value="">Select an Opening</option>
                {openings.map((opening) => (
                  <option key={opening.id} value={opening.id}>
                    {opening.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        {pdfUrl && (
          <div className="mt-4">
            <iframe title="Matching Employees PDF" src={pdfUrl} width="80%" height="500px" />
          </div>
        )}
    </div>

  );
};

export default MatchEmployeesToOpenings;
