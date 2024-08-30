# DevSecOps Tutorial: Vulnerable Web Application

Welcome to the DevSecOps Tutorial project! This repository contains a deliberately vulnerable web application designed to demonstrate various DevSecOps practices.

## Warning

This application is intentionally vulnerable and should **NEVER** be used in a production environment. It is designed for educational purposes only.

## Prerequisites

Before you begin, ensure you have the following:

1. A GitHub account
2. An Azure account (A new account gives you access to most services and $200 in credits)
3. An IDE or text editor (VS Code is recommended)

## Getting Started

### Local Setup

1. Fork this repository
2. Clone your fork:
   ```
   git clone <your_fork>.git
   ```
3. Navigate to the project directory:
   ```
   cd DevSecOps_Tutorial
   ```
4. Delete all workflows
5. Install dependencies:
   ```
   npm install
   ```
6. Run the application:
   ```
   node app.js
   ```

### Azure Deployment

1. Create a Web App App Service with a Node.js runtime stack in Azure
2. Enable continuous deployment and connect your GitHub account and repository
3. Enable basic authentication
4. Keep the rest of the settings as default

Your application should now be available at `<webapp_name>.azurewebsites.net`

**Important**: Consider implementing a spending limit as this application is vulnerable and may be exploited.

## Vulnerability Exploration

Can you spot any vulnerabilities in the source code? How would you automate the process of finding these vulnerabilities?

You can experiment with the demo instance at https://simple-devsecops-app.azurewebsites.net/

## Implementing Security Measures

### SAST with SonarCloud

1. Log into SonarCloud via GitHub
2. Configure visibility for your project
3. Follow the "Analyze a project with a GitHub Action" instructions
4. Create a new workflow, secret, and properties file as instructed

### DAST with ZAP

1. Utilise the provided `zap_scan.yml` file from this repository
2. Change the URL to your own application's URL
3. Results will appear as an artifact on GitHub

### Secret discovery with Trufflehog

1. Utilise the provided `Trufflehog.yml` file from this repository

### Linting

TODO

### Tests

Not really a part of the security validaiton process but see files `app.test.js` as well as `test.yml`

### CodeQL

TODO

## Example Payloads

1. XSS: `<img src=x onerror="alert('XSS')">`
2. SQLi: `OR admin' –`
3. Broken auth: Click on the admin panel
4. Insecure Deserialization (will not be displayed): 
   ```json
   {"rce":"_$$ND_FUNC$$_function(){require('child_process').exec('ls /', function(error, stdout, stderr) { console.log(stdout) });}()"}
   ```
5. Security misconfiguration: Access the Debug info for sensitive information
6. Unrestricted file upload: Try uploading various file types
7. Command injection: `ping google.com`
8. Weak Cryptography: just encrypt anything -> DES in considered insecure
9. Path Traversal: `../../../etc/passwd`
10. XXE (will not be displayed):
   ```
   <?xml version="1.0" encoding="UTF-8"?>
   <!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/passwd"> ]>
   <root>
      <data>&xxe;</data>
   </root>
   ```
11. Prototype Pollution (will not be displayed):
   ```
   {
   "target": {},
   "source": {
      "__proto__": {
         "polluted": "Prototype has been polluted!"
      }
   }
   }
   ```

## Further Learning

For a more complex project, consider implementing DevSecOps practices into OWASP Juice Shop. Be aware that it may require significant debugging when deploying to the cloud.


## License

This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.

## Acknowledgements

- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [Azure Web Apps](https://azure.microsoft.com/en-us/services/app-service/web/)
- [SonarCloud](https://sonarcloud.io/)
- [OWASP ZAP](https://www.zaproxy.org/)
