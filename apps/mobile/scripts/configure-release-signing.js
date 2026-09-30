const fs = require('fs');
const path = require('path');

const androidDir = path.resolve(__dirname, '../android');
const appGradlePath = path.join(androidDir, 'app/build.gradle');
const propsPath = path.join(androidDir, 'keystore.properties');

const storePassword = process.env.ANDROID_KEYSTORE_PASSWORD;
const keyPassword = process.env.ANDROID_KEY_PASSWORD;
const keyAlias = process.env.ANDROID_KEY_ALIAS || 'xpertppc-leads';
const storeFile = process.env.ANDROID_KEYSTORE_FILE || 'release.keystore';

if (!storePassword || !keyPassword) {
  console.error('Missing ANDROID_KEYSTORE_PASSWORD or ANDROID_KEY_PASSWORD');
  process.exit(1);
}

if (!fs.existsSync(appGradlePath)) {
  console.error('android/app/build.gradle not found. Run expo prebuild first.');
  process.exit(1);
}

fs.writeFileSync(
  propsPath,
  [
    `storePassword=${storePassword}`,
    `keyPassword=${keyPassword}`,
    `keyAlias=${keyAlias}`,
    `storeFile=${storeFile}`,
    '',
  ].join('\n')
);

let gradle = fs.readFileSync(appGradlePath, 'utf8');

if (!gradle.includes('keystoreProperties')) {
  gradle = gradle.replace(
    /android\s*\{/,
    `def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {`
  );
}

if (!gradle.includes('signingConfigs.release')) {
  if (/signingConfigs\s*\{/.test(gradle)) {
    gradle = gradle.replace(
      /signingConfigs\s*\{/,
      `signingConfigs {
        release {
            if (keystorePropertiesFile.exists()) {
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
                storeFile file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
            }
        }`
    );
  } else {
    gradle = gradle.replace(
      /buildTypes\s*\{/,
      `signingConfigs {
        release {
            if (keystorePropertiesFile.exists()) {
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
                storeFile file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
            }
        }
    }
    buildTypes {`
    );
  }
}

gradle = gradle.replace(
  /release\s*\{([\s\S]*?)signingConfig\s+signingConfigs\.debug/,
  'release {$1signingConfig signingConfigs.release'
);

if (!/release\s*\{[\s\S]*?signingConfig\s+signingConfigs\.release/.test(gradle)) {
  gradle = gradle.replace(
    /release\s*\{/,
    `release {
            signingConfig signingConfigs.release`
  );
}

fs.writeFileSync(appGradlePath, gradle);
console.log('Configured Android release signing');
