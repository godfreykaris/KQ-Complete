import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AccessToken() {
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const clientId = 'YXYyexaDF28AUhmYlIejghjwl0U6zvzi';
    const clientSecret = 'mHexyAAlFQe5FMVk';

    //send the request in a url-encoded format
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);

    axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then((response) => {
      const accessToken = response.data;
      setAccessToken(JSON.stringify(accessToken, null, 2));
    })
    .catch((error) => {
      console.error("Error generating access token", error);
    });
  }, []);

  return (
    <div>
      <h2>Access Token: </h2>
      <p>{accessToken}</p>
    </div>
  );
}
