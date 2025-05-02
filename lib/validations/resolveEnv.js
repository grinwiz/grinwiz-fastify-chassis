function castEnvValue(key, value, type) {
  switch (type) {
    case 'string':
      return value;
    case 'number':
      return Number(value);
    case 'boolean':
      return value === 'true';
    case 'json':
      return JSON.parse(value);
    default:
      return value;
  }
}

function collectEnvKeysAndResolve(obj, path = '') {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    if ('$env' in obj) {
      const key = obj.$env;
      const envValue = process.env[key];
      const hasDefault = 'default' in obj;
      const type =
        obj.type ??
        (hasDefault ? typeof obj.default : 'string');

      if (envValue !== undefined) {
        return castEnvValue(key, envValue, type);
      } else if (hasDefault) {
        return obj.default;
      } else {
        throw new Error(`Missing required environment variable: ${key} at path "${path}"`);
      }
    } else {
      const resolved = {};
      for (const [k, v] of Object.entries(obj)) {
        resolved[k] = collectEnvKeysAndResolve(v, path ? `${path}.${k}` : k);
      }
      return resolved;
    }
  }

  return obj;
}

function resolveEnv(configObj) {
  return collectEnvKeysAndResolve(configObj);
}

module.exports = resolveEnv;
