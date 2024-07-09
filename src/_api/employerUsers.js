async function getAllEmployerUsers(keycloak) {
  try {
    let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/employers/users',
      {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + keycloak.idToken
        }
      }
    );

    let json = await response.json();

    return json?.users;
  } catch (error) {
    return null;
  }
}

export { getAllEmployerUsers };