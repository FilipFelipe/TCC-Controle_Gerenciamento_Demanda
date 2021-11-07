export const API_URL = 'http://ff-rasp.duckdns.org:5905';

export function USER_LOGIN(userCredentials) {
  return {
    url: API_URL + '/login',
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userCredentials),
    },
  };
}
export function CONTROLE_SAVE(token, dados) {
  return {
    url: API_URL + '/controle',
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(dados),
    },
  };
}
export function CONTROLE_ALL(token) {
  return {
    url: API_URL + '/controle',
    options: {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
    },
  };
}
export function DASHBOARD_ALL() {
  return {
    url: API_URL + '/teste',
    options: {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    },
  };
}

export function CREATE_LOCAL(token, local) {
  return {
    url: API_URL + '/local',
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(local),
    },
  };
}

export function GET_LOCALS(token, page, limit = 6) {
  return {
    url: API_URL + `/local?page=${page}&limit=${limit}`,
    options: {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
    },
  };
}

export function GET_USERS(token, page, limit = 6) {
  return {
    url: API_URL + `/usuarios?page=${page}&limit=${limit}`,
    options: {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
    },
  };
}

export function CREATE_USER(token, user) {
  return {
    url: API_URL + '/usuarios',
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(user),
    },
  };
}

export function UPDATE_USER(token, id, user) {
  return {
    url: API_URL + `/usuarios/${id}`,
    options: {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(user),
    },
  };
}

export function CREATE_EQUIPAMENTOS(token, user) {
  return {
    url: API_URL + '/equipamento',
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(user),
    },
  };
}

export function UPDATE_EQUIPAMENTOS(token, id, user) {
  return {
    url: API_URL + `/equipamento/${id}`,
    options: {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(user),
    },
  };
}
export function GET_EQUIPAMENTOS(token, page, limit = 6) {
  return {
    url: API_URL + `/equipamento?page=${page}&limit=${limit}`,
    options: {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
    },
  };
}