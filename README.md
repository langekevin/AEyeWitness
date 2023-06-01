# AEyeWitness

The main idea of the project is to develop an application for storing images and their metadata on a hyperchain. Since all such data is immutable, such an application can guarantee that a certain image is taken at a certain time as well as place. The project aim is to demonstrate a novel use case for the aeternity hyperchain with a broad and diverse community, e.g., law enforcement organizations, journalists and other stakeholders for whom immutability of images and their metadata plays a crucial role.

# Getting started

To get started with the project and to run the application, there are several preconditions neccessary. First you need to make sure that the following requirements are installed on your computer

- Node.js
- Golang

All implementations for the frontend as well as the communication with the Aeternity Blockchain can be found in the folder aeyewitnessapp. The connection to Storj and the upload of images will be done in the folder service using the Go Gin framework.

## Environmental variables

Both projects, the aeyewitnessapp as well as the service, use local .env files for configuration. These variables primary specify the login information for storj as well as the credentials for the aeternity blockchain. Examples for the .env files can be found in the respective folders:

- /aeyewitnessapp/.env.example (Must be renamed to .env.development, .env.production or .env.local)
- /service/.env.example (Must be renamed to .env)

## Local SSL Proxies

To make the app fully functional, you need to set up two local ssl proxies. One for the frontend, one for the backend. The frontend proxy should forward traffic from the https port 3001 to the http port 3000 and the backend ssl proxy should forward traffic from the https port 8081 to 8080. More information about how to set it up can be found here
- [Accessing your local Next.js dev server using HTTPS](https://www.makeswift.com/blog/accessing-your-local-nextjs-dev-server-using-https)
- [local-ssl-proxy npm package](https://www.npmjs.com/package/local-ssl-proxy)
