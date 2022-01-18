import { CreateFunctionCommand, LambdaClient } from "@aws-sdk/client-lambda";

const client = new LambdaClient({region: "us-east-1"})

const zipFile = "deployment-package.zip"

const command = new CreateFunctionCommand({
	FunctionName: `abcd-scheduler-${contractID}`,
	Code: {
		ZipFile: zipFile
	} 
	Role:

})


