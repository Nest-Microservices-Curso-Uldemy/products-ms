import 'dotenv/config';
import * as joi from 'joi';

interface EnvVarsI {
    PORT: number;
    DATABASE_URL: string;
}

const envsSchema = joi
    .object({
        PORT: joi.number().required(),
        DATABASE_URL: joi.string().required(),
    })
    .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
    throw new Error(`config validation error: ${error.message}`);
}

const envVars: EnvVarsI = value;

export const envs = {
    port: envVars.PORT,
    databaseUrl: envVars.DATABASE_URL,
};