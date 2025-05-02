function castAndValidateEnvValue(key, rawValue, expectedType) {
  let parsed;
  let actualType;

  try {
    parsed = JSON.parse(rawValue);
    actualType = typeof parsed;
  } catch {
    parsed = rawValue;
    actualType = 'string';
  }

  if (expectedType === 'json') {
    try {
      const json = JSON.parse(rawValue);
      if (typeof json !== 'object' && !Array.isArray(json)) {
        throw new Error();
      }
      return;
    } catch {
      throw new Error(`"${key}" must be a valid JSON object or array.`);
    }
  }

  if (expectedType && actualType !== expectedType) {
    throw new Error(
      `"${key}" type mismatch. Expected: ${expectedType}, got: ${actualType}.`
    );
  }
}

function validateEnv(config, path = '') {
  if (config && typeof config === 'object' && !Array.isArray(config)) {
    if ('$env' in config) {
      const key = config.$env;
      const envValue = process.env[key];
      const hasDefault = 'default' in config;
      const hasType = 'type' in config;

      const expectedType = hasType
        ? config.type
        : hasDefault
          ? typeof config.default
          : null;

      if (envValue !== undefined) {
        if (expectedType) {
          castAndValidateEnvValue(key, envValue, expectedType);
        }
      } else if (!hasDefault) {
        throw new Error(`Missing required environment variable "${key}" at "${path}"`);
      }

    } else {
      for (const [k, v] of Object.entries(config)) {
        validateEnv(v, path ? `${path}.${k}` : k);
      }
    }
  }
}

module.exports = validateEnv;
