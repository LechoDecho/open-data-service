import { PostgresRepository } from '@jvalue/node-dry-pg'
import { PoolConfig } from 'pg'

import { POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PW, POSTGRES_DB, POSTGRES_SCHEMA } from '../env'

import { StorageStructureRepository } from './storageStructureRepository'

const CREATE_BUCKET_STATEMENT =
(schema: string, table: string): string => `CREATE TABLE IF NOT EXISTS "${schema}"."${table}" (
  "id" bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
  "data" jsonb NOT NULL,
  "timestamp" timestamp,
  "pipelineId" bigint,
  CONSTRAINT "Data_pk_${schema}_${table}" PRIMARY KEY (id)
  )`
const DELETE_BUCKET_STATEMENT = (schema: string, table: string): string => `DROP TABLE "${schema}"."${table}" CASCADE`

const POOL_CONFIG: PoolConfig = {
  host: POSTGRES_HOST,
  port: POSTGRES_PORT,
  user: POSTGRES_USER,
  password: POSTGRES_PW,
  database: POSTGRES_DB,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
}

export class PostgresStorageStructureRepository implements StorageStructureRepository {
  private readonly postgresRepo = new PostgresRepository(POOL_CONFIG)

  /**
     * This function will create a table (if not already exists) for storing pipeline data.
     * Uses the database function 'createStructureForDataSource'.
     * @param tableIdentifier tableIdentifier for wich a table will be created with this name
     */
  async create (tableIdentifier: string): Promise<void> {
    await this.postgresRepo.executeQuery(CREATE_BUCKET_STATEMENT(POSTGRES_SCHEMA, tableIdentifier), [])
  }

  /**
     * Drops a table with name, provided by parameter tableIdentifier
     * @param tableIdentifier name of the table to be dropped
     */
  async delete (tableIdentifier: string): Promise<void> {
    await this.postgresRepo.executeQuery(DELETE_BUCKET_STATEMENT(POSTGRES_SCHEMA, tableIdentifier), [])
  }
}
