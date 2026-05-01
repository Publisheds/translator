const path = require('path')
const root = __dirname
const srcFolder = path.join(root, "src")
const destFolder = path.join(root, "dist")
const certPath = path.join(destFolder, "cert.p12")

module.exports = {
    extensionBundleId: 'com.liwit.translator',
    extensionBundleName: 'Liwit Translator',
    extensionBundleVersion: '2.0.0',
    cepVersion: '7.0',
    panelName: 'Liwit Translator',
    width: '400',
    height: '560',
    root: root,
    sourceFolder: srcFolder,
    destinationFolder: destFolder,
    certificate: {
        customCert: { path: "", password: "" },
        selfSign: {
            country: 'US',
            province: 'CA',
            org: 'Liwit',
            name: 'Liwit Translator',
            password: 'liwit2024',
            locality: 'Buenos Aires',
            orgUnit: 'Development',
            email: 'dev@liwit.co',
            output: certPath
        }
    }
}
