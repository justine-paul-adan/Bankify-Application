#Steps to Start the Bankify APP
	Create a blank solution in Visual Studio and add a new ASP.NET Core Web API project named "Bankify".
	Add react typescript template to the project. run the following command in the terminal:
		npx create-react-app clientapp --template typescript
		touch gitignore
	Paste these on the gitIgnore file
		# .NET
		bin/
		obj/
		*.user
		*.suo
		*.vs/
		.vscode/
		# React / Node
		node_modules/
		build/
		.env
		.DS_Store
		# Logs
		npm-debug.log*
		yarn-debug.log*
		yarn-error.log*
    Create Models folder and add class properties
    Create Data folder and add DbContext
    Update the appsettings.json add the connection string
    Update the program.cs add the connection string and dbcontext to the services
    Run these command in the terminal
        dotnet ef migrations add InitialCreate
        dotnet ef database update
    If it says no project selected try these:
        dotnet ef migrations add InitialCreate --project Bankify.API --startup-project Bankify.API
        dotnet ef database update --project Bankify.API --startup-project Bankify.API
    Verify the DB if table was created

	Create DTO, services and controller
	Register services and interface on the program.cs
		builder.Services.AddScoped<IAccountService, AccountService>();
	

ADD UI
Check guided here: https://v2.chakra-ui.com/getting-started
npm i @chakra-ui/react@2 @emotion/react @emotion/styled framer-motion
npm install react-router-dom
npm install axios //for API CALLS
npm install @chakra-ui/icons for icons
npm install sass
npm install recharts