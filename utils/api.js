const API_URL = "http://localhost:8000";

export async function registerUser(data) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function loginUser(email, password) {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData,
  });
  return res.json();
}

export async function getMe(token) {
  const res = await fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function getMyOrg(token) {
  const res = await fetch(`${API_URL}/organizations/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function getSubscription(token) {
  const res = await fetch(`${API_URL}/subscriptions/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function queryAI(query, token) {
  const res = await fetch(`${API_URL}/ai/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query }),
  });
  return res.json();
}