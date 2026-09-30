const fs = require('fs');
const path = require('path');

const androidDir = path.resolve(__dirname, '../android');
const gradlePath = path.join(androidDir, 'app/build.gradle');
const storePassword = process.env.ANDROID_KEYSTORE_PASSWORD;
const keyPassword = process.env.ANDROID_KEY_PASSWORD;
const keyAlias = process.env.ANDROID_KEY_ALIAS || 'xpertppc-leads';
const storeFileRel = 'app/release.keystore';
const storeFileAbs = path.join(androidDir, storeFileRel);

if (!storePassword || !keyPassword) {
  console.error('Missing ANDROID_KEYSTORE_PASSWORD or ANDROID_KEY_PASSWORD');
  process.exit(1);
}
if (!fs.existsSync(gradlePath)) {
  console.error('android/app/build.gradle not found. Run expo prebuild first.');
  process.exit(1);
}
if (!fs.existsSync(storeFileAbs)) {
  console.error(`Keystore not found at ${storeFileAbs}`);
  process.exit(1);
}

fs.writeFileSync(
  path.join(androidDir, 'keystore.properties'),
  [
    `storePassword=${storePassword}`,
    `keyPassword=${keyPassword}`,
    `keyAlias=${keyAlias}`,
    `storeFile=${storeFileRel}`,
    '',
  ].join('\n')
);

const marker = 'XPERTpPC_RELEASE_SIGNING';
let gradle = fs.readFileSync(gradlePath, 'utf8');
gradle = gradle.replace(/\n\/\/ BEGIN XPERTpPC_RELEASE_SIGNING[\s\S]*?\/\/ END XPERTpPC_RELEASE_SIGNING\n/g, '\n');

const snippet = `
// BEGIN ${marker}
def xpertppcKeystorePropertiesFile = rootProject.file("keystore.properties")
def xpertppcKeystoreProperties = new Properties()
xpertppcKeystoreProperties.load(new FileInputStream(xpertppcKeystorePropertiesFile))

android.signingConfigs {
    create("release") {
        keyAlias xpertppcKeystoreProperties['keyAlias']
        keyPassword xpertppcKeystoreProperties['keyPassword']
        storeFile rootProject.file(xpertppcKeystoreProperties['storeFile'])
        storePassword xpertppcKeystoreProperties['storePassword']
    }
}

android.buildTypes.release.signingConfig = android.signingConfigs.release

def xpertppcStore = rootProject.file(xpertppcKeystoreProperties['storeFile'])
println "XpertPPC release keystore exists=" + xpertppcStore.exists() + " path=" + xpertppcStore.absolutePath
if (!xpertppcStore.exists()) {
    throw new GradleException("Release keystore missing: " + xpertppcStore.absolutePath)
}
// END ${marker}
`;

fs.writeFileSync(gradlePath, gradle.trimEnd() + '\n' + snippet + '\n');
console.log('Configured Android release signing');
console.log('Patched', gradlePath);
console.log('Keystore', storeFileAbs, 'bytes', fs.statSync(storeFileAbs).size);
