# ChatHub

Your opportunity to optimize your social media use.

## Development will require:

- [node (v20.11.1)](https://nodejs.org/en/download)
- [.NET 8](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
- Some text editor for server side (Visual Studio for example) and for client side (VSCode strongly recommended)

## Deployment

Server is listening on port `5041` and redirecting to the server on port `44144`, you need to deploy both client and server, smth like:

```bash
#from client folder
npm start & dotnet run ../server
```


## Remarks

For client side you will need to load all dependencies and prebuild project (recommended):
```bash
npm i #install dependencies
npm run build #prebuild
npm start #deploy
```  
