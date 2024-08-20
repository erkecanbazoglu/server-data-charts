import * as yup from "yup";

const serverSchema = yup.object({
  active_connections: yup
    .number()
    .integer()
    .min(0)
    .required("Active connections is required"),
  wait_time: yup.number().integer().min(0).required("Wait time is required"),
  workers: yup
    .array()
    .of(yup.array().of(yup.mixed()))
    .required("Workers are required"),
  cpu_load: yup.number().required("CPU load is required"),
  timers: yup.number().integer().min(0).required("Timers is required"),
});

const resultsSchema = yup.object({
  services: yup
    .object({
      redis: yup.boolean().required("Redis is required"),
      database: yup.boolean().required("Database is required"),
    })
    .required("Services are required"),
  stats: yup
    .object({
      servers_count: yup
        .number()
        .integer()
        .min(0)
        .required("Servers count is required"),
      online: yup.number().integer().min(0).required("Online is required"),
      session: yup.number().integer().min(0).required("Session is required"),
      server: serverSchema.required("Server is required"),
    })
    .required("Stats are required"),
});

const dataSchema = yup.object({
  status: yup.string().required("Status is required"),
  region: yup.string().required("Region is required"),
  roles: yup.array().of(yup.string()).required("Roles are required"),
  results: resultsSchema.required("Results are required"),
  strict: yup.boolean().required("Strict is required"),
  server_issue: yup.mixed().nullable(),
});

export default yup
  .array()
  .of(
    yup
      .object()
      .shape({
        region: yup.string().required("Region is required"),
        data: dataSchema.required("Data is required"),
        timestamp: yup.string().required("Timestamp is required"),
      })
      .noUnknown(true)
      .strict()
      .required()
  )
  .required("Data is required");
