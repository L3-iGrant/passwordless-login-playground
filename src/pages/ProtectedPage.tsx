import React from 'react';
import { doLogout } from '../services/keycloakService';

interface ProfileProps {
  profile?: Keycloak.KeycloakProfile;
}

const ProfileDetails = ({ profile }: ProfileProps) => {
  return (
    <div className="container">
      <div className="content">
        {profile ? (
          <>
            <div className="card">
              <h1>
                Welcome, <strong>{profile.firstName}</strong>
              </h1>
              <h3>Information from Keycloak</h3>
              <dl>
                {Object.entries(profile).map(([key, value]) => (
                  (key !== "firstName" && key !== "lastName") && <React.Fragment key={key}>
                    <dt><strong>{key}</strong></dt>
                    <dd>{String(value)}</dd>
                  </React.Fragment>
                ))}
              </dl>
              <button className="logout-button" onClick={doLogout}>
                Log out
              </button>
            </div>
          </>
        ) : (
          <p>Loading user profile…</p>
        )}
      </div>
    </div>
  );
};

export default ProfileDetails;
