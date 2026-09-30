const fs = require('fs');
const path = require('path');

const androidDir = path.resolve(__dirname, '../android');
const appDir = path.join(androidDir, 'app');
const gradlePath = path.join(appDir, 'build.gradle');
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

const lines = gradle.split('\n');
let inRelease = false;
let depth = 0;
const out = [];
for (const line of lines) {
  if (!inRelease && /^\s*release\s*\{/.test(line)) {
    inRelease = true;
    depth = 0;
  }
  if (inRelease) {
    depth += (line.match(/\{/g) || []).length;
    depth -= (line.match(/\}/g) || []).length;
    if (/signingConfig\s+signingConfigs\.debug/.test(line)) {
      out.push(line.replace('signingConfigs.debug', 'signingConfigs.release'));
    } else {
      out.push(line);
    }
    if (depth <= 0) inRelease = false;
    continue;
  }
  out.push(line);
}
gradle = out.join('\n');

const snippet = `
// BEGIN ${marker}
def xpertppcKeystorePropertiesFile = rootProject.file("keystore.properties")
def xpertppcKeystoreProperties = new Properties()
xpertppcKeystoreProperties.load(new FileInputStream(xpertppcKeystorePropertiesFile))

android.signingConfigs {
    release {
        keyAlias xpertppcKeystoreProperties['keyAlias']
        keyPassword xpertppcKeystoreProperties['keyPassword']
        storeFile rootProject.file(xpertppcKeystoreProperties['storeFile'])
        storePassword xpertppcKeystoreProperties['storePassword']
    }
}

android.buildTypes {
    release {
        signingConfig android.signingConfigs.release
    }
}

gradle.taskGraph.whenReady {
    def store = rootProject.file(xpertppcKeystoreProperties['storeFile'])
    println "XpertPPC release keystore exists=" + store.exists() + " path=" + store.absolutePath
    if (!store.exists()) {
        throw new GradleException("Release keystore missing: " + store.absolutePath)
    }
}
// END ${marker}
`;

fs.writeFileSync(gradlePath, gradle.trimEnd() + '\n' + snippet + '\n');
console.log('Configured Android release signing');
console.log('Patched', gradlePath);
console.log('Keystore', storeFileAbs, 'bytes', fs.statSync(storeFileAbs).size);
