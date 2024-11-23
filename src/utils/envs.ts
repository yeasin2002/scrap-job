import "dotenv/config";

export const envs = {
  linkedinEmail: process.env.LINKEDIN_EMAIL || ``,
  linkedinPassword: process.env.LINKEDIN_PASSWORD || ``,
};
