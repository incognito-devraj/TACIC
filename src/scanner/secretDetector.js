const secretPatterns = [
  "API_KEY",
  "SECRET_KEY",
  "JWT_SECRET",
  "CLIENT_SECRET",
  "ACCESS_TOKEN",
  "REFRESH_TOKEN",
  "DATABASE_URL",
  "PRIVATE_KEY",
  "OPENAI_API_KEY",
  "STRIPE_SECRET"
];

function containsSecrets(content) {
  const upper = content.toUpperCase();

  return secretPatterns.some(pattern =>
    upper.includes(pattern)
  );
}

module.exports = {
  containsSecrets
};