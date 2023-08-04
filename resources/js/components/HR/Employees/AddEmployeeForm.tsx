import React, { useState, useEffect } from 'react';
import apiBaseUrl from '../../../config';

import LoadingComponent from '../../../components/Common/LoadingComponent';

interface Skill {
  id: number;
  name: string;
}

interface Qualification {
  id: number;
  name: string;
}

interface JobTitle {
  id: number;
  name: string;
}

const AddEmployeeForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  const sortByNameAscending = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name);
  
  const [skillsStore, setSkills] = useState<Skill[]>([]);
  const [qualificationsStore, setQualifications] = useState<Qualification[]>([]);
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    address: '',
    job_title_id: '',
    qualifications: [] as string [],
    skills: [] as string [],
  });

  const [responseMessage, setResponseMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const [
        skillsResponse,
        qualificationsResponse,
        jobTitlesResponse,
      ] = await Promise.all([
        fetch(`${apiBaseUrl}/skills`),
        fetch(`${apiBaseUrl}/qualifications`),
        fetch(`${apiBaseUrl}/jobTitles`),
      ]);

      const [
        skillsData,
        qualificationsData,
        jobTitlesData,
      ] = await Promise.all([
        skillsResponse.json(),
        qualificationsResponse.json(),
        jobTitlesResponse.json(),
      ]);

      setSkills(skillsData.items.sort(sortByNameAscending));
      setQualifications(qualificationsData.items.sort(sortByNameAscending));
      setJobTitles(jobTitlesData.items.sort(sortByNameAscending));

      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      setResponseStatus(0); // Error
      setResponseMessage(`Error fetching data: ${error.message}`);
      console.error('Error fetching data:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
  
    // Handle multiple selections for skills and qualifications
    if (type === 'select-multiple') {
      const selectedOptions = Array.from((e.target as HTMLSelectElement).options)
        .filter((option) => option.selected)
        .map((option) => option.value);
  
      setFormData((prevFormData) => ({ ...prevFormData, [name]: selectedOptions }));
    } else {
      setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      if (!csrfToken) {
        console.error('CSRF token not found.');
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${apiBaseUrl}/employees/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.status) {
          setResponseStatus(1); // Success
          setResponseMessage(`Success: ${data.success}`);
          // Redirect to the employees list page after successful creation
        } else {
          setResponseStatus(0); // Error
          setResponseMessage(`Error: ${data.error}`);
        }
      } else {
        setResponseStatus(0); // Error
        setResponseMessage(`Error: ${data.error}`);
      }

      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      setResponseStatus(0); // Error
      setResponseMessage('Error submitting data: An error occurred');
      console.error('Error submitting data:', error);
    }
  };

  const getResponseClass = () => {
    if (responseStatus === 1) {
      return 'text-success'; // Green color for success
    } else if (responseStatus === 0) {
      return 'text-danger'; // Red color for error
    } else {
      return ''; // No specific styles (default)
    }
  };

  return (
    <div className="col-sm-12 col-md-7 col-lg-5">
      <h2 className="text-center">Add Employee</h2>
      {isLoading ? (
        /**Show loading */
        <LoadingComponent />
      ) : (
        <>
          <p className={`response-message ${getResponseClass()} text-center`}>{responseMessage}</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                className="form-control"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                className="form-control"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                className="form-control"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                className="form-control"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="jobTitleId">Job Title</label>
              <select
                id="jobTitleId"
                className="form-control"
                name="job_title_id"
                value={formData.job_title_id}
                onChange={handleChange}
                required
              >
                <option value="">Select a job title</option>
                {jobTitles?.map((jobTitle) => (
                  <option key={jobTitle.id} value={jobTitle.id}>
                    {jobTitle.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="skills">Skills</label>
              <select
                id="skills"
                className="form-control"
                name="skills"
                onChange={handleChange}
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
                onChange={handleChange}
                multiple // Enable multiple selections
                required
              >
                {qualificationsStore?.map((qualification) => (
                  <option key={qualification.id} value={qualification.id.toString()}> {/* Convert to string */}
                    {qualification.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-center mt-3">
              <button type="submit" className="btn btn-primary">
                Add Employee
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default AddEmployeeForm;
