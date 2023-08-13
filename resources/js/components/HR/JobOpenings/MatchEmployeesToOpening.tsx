
import React, { useState, useEffect } from 'react';
import apiBaseUrl from '../../../config';
import LoadingComponent from '../../../components/Common/LoadingComponent';

import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';


type Opening = {
    id: number;
    title: string;
    description: string;
  };

  
const MatchEmployeesToOpenings = () => {


  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const [openings, setOpenings] = useState<Opening[]>([]);
  const [selectedOpeningId, setSelectedOpeningId] = useState<number | null>(null);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const [responseMessage, setResponseMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);

  // Detect if the device is mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
      const isMobileDevice = window.innerWidth <= 768; // Adjust the breakpoint if needed
      setIsMobile(isMobileDevice);
  }, []);

  const openPdfInNewTab = () => {
      if (pdfUrl) {
          window.open(pdfUrl, '_blank');
      }
  };

  useEffect(() => {
    fetchOpenings();
  }, []);

  const fetchOpenings = async () => {

    setIsLoading(true);

     try
     {
        const response = await fetch(`${apiBaseUrl}/openings`);
        const data = await response.json();
        setOpenings(data.openings);
        setIsLoading(false);
      } 
      catch (error) 
      {
        console.error('Error fetching openings:', error);
        setIsLoading(false);
      }
  };

  const handleOpeningChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setSelectedOpeningId(value ? parseInt(value) : null);
  };

  const getResponseClass = () => {
     if (responseStatus === 1) 
     {
       return 'text-success'; // Green color for success
     } 
     else if (responseStatus === 0) 
     {
       return 'text-danger'; // Red color for error
     } 
     else 
     {
       return ''; // No specific styles (default)
     }
   };
   
  const getMatchingEmployeesPDF = async () => {

    setIsLoading(true);

    try 
    {
      const accessToken = sessionStorage.getItem('access_token');
      if (!accessToken) 
      {
        setIsLoading(false);
        // Redirect to the sign-in page if the accessToken is not set
        navigate('/signin');
        
        return;
      }

      if (selectedOpeningId) 
      {
        const response = await fetch(`${apiBaseUrl}/openings/match_employees/${selectedOpeningId}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (response.ok) 
        {
          
            const contentType = response.headers.get("content-type");
          
            if(contentType)
            {
              if (contentType.includes("application/json")) 
              {
                  const jsonResponse = await response.json();

                  setResponseStatus(0); // Error
                  setResponseMessage(`Error: ${jsonResponse.error}`);
                  setPdfUrl("");
              
              } 
              else if (contentType.includes("application/pdf")) 
              {
                  const pdfBlob = await response.blob();
                  const pdfUrl = URL.createObjectURL(pdfBlob);
                  setPdfUrl(pdfUrl);
                  setResponseMessage('');
              
              } 
              else 
              {
                  setResponseStatus(0); // Error
                  setResponseMessage("Unknown response format. Please contact support");
                  setPdfUrl("");
              
              }
            }
            else 
              {
                  setResponseStatus(0); // Error
                  setResponseMessage("An error occurred. Please contact support");
                  setPdfUrl("");
              
              }
            
        } 
        else 
        {
            setResponseStatus(0); // Error
            setResponseMessage(`Error getting matched employees, please contact support.`);
            setPdfUrl("");
        }

        setIsLoading(false);

      }
    } 
    catch (error) 
    {
      setResponseStatus(0); // Error
      setResponseMessage(`Error getting matched employees, please contact support.`);
      setPdfUrl("");
      console.error('Error getting matched employees PDF:', error);
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
          <>
          <p className={`response-message ${getResponseClass()} text-center`}>{responseMessage}</p>

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
          </>
        )}
        
        {pdfUrl && (
          <div className="mt-4">
             {isMobile ? (
                  <div className='d-flex justify-content-center'>
                    <Button onClick={openPdfInNewTab} variant="primary">
                        View PDF report on a new tab.
                    </Button>
                  </div>
                ) : (
                    <iframe title="Matching Employees PDF" src={pdfUrl} width="80%" height="500px" />
              )}
          </div>
        )}
    </div>

  );
};

export default MatchEmployeesToOpenings;
