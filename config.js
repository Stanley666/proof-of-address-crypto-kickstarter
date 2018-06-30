/**
 * Setup evironment
 */

var environments = {};

environments.staging = {
    'port': 3000,
    'envName': 'staging'
}

environments.production = {
    'port': 5000,
    'envName': 'production'
}

var currentEnv = typeof(environments[process.env.NODE_ENV]) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';
var envToExp = typeof(environments[currentEnv]) == 'object' ? environments[currentEnv] : environments.staging;

module.exports = envToExp;
