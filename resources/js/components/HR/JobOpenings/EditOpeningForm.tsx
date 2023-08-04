import React, { useState, useEffect } from 'react';
import apiBaseUrl from '../../../config';

import LoadingComponent from '../../../components/Common/LoadingComponent';
import { useParams } from 'react-router-dom';

interface Skill {
  id: number;
  name: string;
}

interface Qualification {
  id: number;
  name: string;
}


const EditOpeningForm: React.FC = () => {

  const { opening_id} = useParams<{opening_id: string; }>();

  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownsDataLoading, setDropdownsDataLoading] = useState(true);

  const sortByNameAscending = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name);
  
  const [openingId, setOpeningID] = useState<string>(opening_id || '');

  const [skillsStore, setSkills] = useState<Skill[]>([]);
  const [qualificationsStore, setQualifications] = useState<Qualification[]>([]);

  const [formData, setFormData] = useState({
    id:'',
    title: '',
    description: '',
    qualifications: [] as string [],
    skills: [] as string [],
  });

  const [responseMessage, setResponseMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);

  useEffect(() => {
    fetchOpening();
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);

    try 
    {
        Promise.all([
            fetch(`${apiBaseUrl}/skills`),
            fetch(`${apiBaseUrl}/qualifications`),
          ])
            .then((responses) => Promise.all(responses.map((response) => response.json())))
            .then(([skillsData, qualificationsData]) => {
              // Do something with the fetched data
              setSkills(skillsData.items.sort(sortByNameAscending));
              setQualifications(qualificationsData.items.sort(sortByNameAscending));
            })
            .catch((error) => {
              // Handle any errors that occurred during fetching
              console.error('Error fetching data:', error);
            })
            .finally(() => {
              setDropdownsDataLoading(false);
              setIsLoading(false);
            });
          
    } 
    catch (error: any) 
    {
      setIsLoading(false);
      setResponseStatus(0); // Error
      setResponseMessage(`Error fetching data: ${error.message}`);
      console.error('Error fetching data:', error);
    }
  };

  const fetchOpening = async () => {
    setIsLoading(true);

    try 
    {
      const response = await fetch(`${apiBaseUrl}/openings/${openingId}`);
      const data = await response.json();
      
      setFormData({
        id: data.opening.id,
        title: data.opening.title,
        description: data.opening.description, 
        qualifications: data.opening.qualifications?.map((qualification:{ id:number}) => String(qualification.id)),       
        skills: data.opening.skills?.map((skill:{ id:number}) => String(skill.id)),
      });
    
      setOpeningID(data.opening.id);

      if(!isDropdownsDataLoading)
          setIsLoading(false);

    }
    catch (error: any) 
    {
      setResponseStatus(0); // Error
      setResponseMessage('Error submitting data: An error occurred.');
      console.error('Error fetching data:', error);
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
  
    // Handle multiple selections for skills and qualifications
    if (type === 'select-multiple') 
    {
      const selectedOptions = Array.from((e.target as HTMLSelectElement).options)
        .filter((option) => option.selected)
        .map((option) => option.value);
  
      setFormData((prevFormData) => ({ ...prevFormData, [name]: selectedOptions }));
    } 
    else 
    {
      setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    try 
    {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      if (!csrfToken) 
      {
        console.error('CSRF token not found.');
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${apiBaseUrl}/openings/change/${openingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) 
      {
        if (data.status) 
        {
          setResponseStatus(1); // Success
          setResponseMessage(`Success: ${data.success}`);
          // Redirect to the openings list page after successful creation
        } 
        else 
        {
          setResponseStatus(0); // Error
          setResponseMessage(`Error: ${data.error}`);
        }
      } 
      else 
      {
        setResponseStatus(0); // Error
        setResponseMessage(`Error: ${data.error}`);
      }

      setIsLoading(false);
    } 
    catch (error: any) 
    {
      setIsLoading(false);
      setResponseStatus(0); // Error
      setResponseMessage('Error submitting data: An error occurred');
      console.error('Error submitting data:', error);
    }
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

  return (
    <div className="col-sm-12 col-md-7 col-lg-5">
      <h2 className="text-center">Edit Opening</h2>
      {isLoading ? (
        /**Show loading */
        <LoadingComponent />
      ) : (
        <>
          <p className={`response-message ${getResponseClass()} text-center`}>{responseMessage}</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                className="form-control"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
                        
            <div className="form-group">
              <label htmlFor="skills">Skills</label>
              <select
                id="skills"
                className="form-control"
                name="skills"
                onChange={handleChange}
                value={formData.skills?.map(String)}
                multiple // Enable multiple selections
                required
              >
                {skillsStore?.map((skill) => (
                  <option key={skill.id} value={skill.id.toString()}> {/* Convert to string */}
                    {skill.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="qualifications">Qualifications</label>
              <select
                id="qualifications"
                className="form-control"
                name="qualifications"
                value={formData.qualifications?.map(String)}
                onChange={handleChange}
                multiple // Enable multiple selections
                required
              >
                {qualificationsStore?.map((qualification) => (
                  <option key={qualification.id} value={qualification.id.toString()} > {/* Convert to string */}
                    {qualification.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-center mt-3">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default EditOpeningForm;
