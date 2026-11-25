// Adresse du backend. En production, définir VITE_API_URL dans frontend/.env.production
export const API_URL: string = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
