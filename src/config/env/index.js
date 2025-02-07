const env = process.env.NODE_ENV || "development";

const development = {
  app: {
    port: process.env.PORT || 5000,
    corsOrigin: process.env.CORS_ORIGIN || "*",
  },
  microsoft: {
    tenantId: process.env.TENANT_ID,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    graphEndpoint: process.env.MICROSOFT_GRAPH_ENDPOINT || "https://graph.microsoft.com/v1.0",
    organizationEmail: process.env.ORGANIZATION_EMAIL,
  },
};

const staging = {
  app: {
    port: process.env.PORT || 5000,
    corsOrigin: process.env.CORS_ORIGIN || "https://staging.yourapp.com",
  },
  microsoft: {
    tenantId: process.env.TENANT_ID,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    graphEndpoint: process.env.MICROSOFT_GRAPH_ENDPOINT || "https://graph.microsoft.com/v1.0",
    organizationEmail: process.env.ORGANIZATION_EMAIL,
  },
};

const production = {
  app: {
    port: process.env.PORT || 5000,
    corsOrigin: process.env.CORS_ORIGIN || "https://yourapp.com",
  },
  microsoft: {
    tenantId: process.env.TENANT_ID,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    graphEndpoint: process.env.MICROSOFT_GRAPH_ENDPOINT || "https://graph.microsoft.com/v1.0",
    organizationEmail: process.env.ORGANIZATION_EMAIL,
  },
};

const config = {
  development,
  staging,
  production,
};

export default config[env];
