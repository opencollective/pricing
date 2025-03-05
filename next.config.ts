import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    // Add env variables that should be available at build time
    POSTGRES_USER: process.env.POSTGRES_USER as string,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD as string,
    POSTGRES_HOST: process.env.POSTGRES_HOST as string,
    POSTGRES_PORT: process.env.POSTGRES_PORT as string,
    POSTGRES_DATABASE: process.env.POSTGRES_DATABASE as string,
  },
};

export default nextConfig;
