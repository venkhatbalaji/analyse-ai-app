const fs = require('fs');
const path = require('path');
const aws = require('aws-sdk');

function generateEnvFileIfNotExists(accessKey, accessValue, env) {
  const envFilePath = path.join(__dirname, '.env');
  console.log('Checking Env files', accessKey, accessValue);
  if (!fs.existsSync(envFilePath) && accessKey && accessValue) {
    aws.config.update({
      accessKeyId: accessKey,
      secretAccessKey: accessValue,
      region:
        env === 'QA'
          ? 'ap-south-1'
          : env === 'STAGE'
          ? 'me-south-1'
          : 'ap-southeast-1',
    });
    const secretsManager = new aws.SecretsManager();
    const secretName =
      env === 'QA'
        ? 'service-fund-signup-qa-credentials'
        : 'service-fund-signup-stage-credentials';
    secretsManager.getSecretValue({ SecretId: secretName }, (err, data) => {
      if (err) {
        console.error('Error retrieving secret:', err);
        return;
      } else {
        const secretValue = JSON.parse(data.SecretString || '');
        console.log('secret value:', secretValue);
        const envContent = `
        CONNECTION_URL=${secretValue.CONNECTION_URL}
        KINESIS_ACCESS_KEY=${secretValue.KINESIS_ACCESS_KEY}
        KINESIS_KEY_VALUE=${secretValue.KINESIS_KEY_VALUE}
        STREAM_NAME=${secretValue.STREAM_NAME}
        ENABLE_LOGGER=${secretValue.ENABLE_LOGGER}
        NOTIFY_ENDPOINT=${secretValue.NOTIFY_ENDPOINT}
        IS_KAFKA_ENABLED=${secretValue.IS_KAFKA_ENABLED}
        KAFKA_SERVER=${secretValue.KAFKA_SERVER}
        ENVIRONMENT=${secretValue.ENVIRONMENT}
        AWS_REGION=${secretValue.AWS_REGION}
      `;
        fs.writeFileSync(envFilePath, envContent);
      }
      console.log('.env file created.');
    });
  } else {
    console.log('.env file already exists.');
  }
}

const accessKey = process.argv[2];
const accessValue = process.argv[3];
const environment = process.argv[4];
generateEnvFileIfNotExists(accessKey, accessValue, environment);
