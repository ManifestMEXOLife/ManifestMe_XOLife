// import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

// // Initialize client with explicit region
// const client = new SecretsManagerClient({
//     region: "us-east-1", // make sure your secret is in this region
// });

// async function getSecret(secretIdOrName: string) {
//     try {
//         // SecretsManager GetSecretValue works with secret name OR ARN
//         const command = new GetSecretValueCommand({ SecretId: secretIdOrName });
//         const response = await client.send(command);

//         if (!response.SecretString) throw new Error("Secret is empty");

//         const secret = JSON.parse(response.SecretString);
//         console.log("✅ Secret fetched successfully:", secret);
//     } catch (err) {
//         console.error("❌ Error fetching secret:", err);
//     }
// }

// // Use **secret name** instead of full ARN for simplicity
// // Find this in AWS Secrets Manager console
// const secretArn = "arn:aws:secretsmanager:us-east-1:226839593122:secret:manifestme/prod/database-qDpxwd";


// getSecret(secretArn);


import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({
    region: "us-east-1",
    // No credentials needed; the EC2 role is automatically used
});

async function getSecret(secretArn: string) {
    try {
        const command = new GetSecretValueCommand({ SecretId: secretArn });
        const response = await client.send(command);

        if (!response.SecretString) throw new Error("Secret is empty");

        const secret = JSON.parse(response.SecretString);

        // Set as environment variables for your app
        process.env.DB_HOST = secret.DB_HOST;
        process.env.DB_USER = secret.DB_USER;
        process.env.DB_PASSWORD = secret.DB_PASSWORD;
        process.env.DB_PORT = secret.DB_PORT;
        process.env.DB_NAME = secret.DB_NAME;

        console.log("✅ Secret fetched successfully:", secret);
    } catch (err) {
        console.error("❌ Error fetching secret:", err);
    }
}

// Use the correct secret ARN from Secrets Manager
const secretArn = "arn:aws:secretsmanager:us-east-1:226839593122:secret:manifestme/prod/database-qDpxwd";

getSecret(secretArn);
