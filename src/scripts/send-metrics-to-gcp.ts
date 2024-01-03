import { MetricServiceClient, protos } from "@google-cloud/monitoring";

type Result = {
  totalDependenciesCount: number;

  outdatedDependenciesCount: number;
  latestDependenciesCount: number;

  outdatedDependenciesPercentage: number;
  latestDependenciesPercentage: number;

  outdatedMajorDependenciesCount: number;
  outdatedMinorDependenciesCount: number;
  outdatedPatchDependenciesCount: number;

  outdatedMajorDependenciesPercentage: number;
  outdatedMinorDependenciesPercentage: number;
  outdatedPatchDependenciesPercentage: number;
};

const getMetrics = (): Result => {
  const result: Result = {
    totalDependenciesCount: Number.parseInt(
      process.env["TOTAL_DEPENDENCIES_COUNT"]!,
    ),

    outdatedDependenciesCount: Number.parseInt(
      process.env["OUTDATED_DEPENDENCIES_COUNT"]!,
    ),
    latestDependenciesCount: Number.parseInt(
      process.env["LATEST_DEPENDENCIES_COUNT"]!,
    ),

    outdatedDependenciesPercentage: Number.parseFloat(
      process.env["OUTDATED_DEPENDENCIES_PERCENTAGE"]!,
    ),
    latestDependenciesPercentage: Number.parseFloat(
      process.env["LATEST_DEPENDENCIES_PERCENTAGE"]!,
    ),

    outdatedMajorDependenciesCount: Number.parseInt(
      process.env["OUTDATED_MAJOR_DEPENDENCIES_COUNT"]!,
    ),
    outdatedMinorDependenciesCount: Number.parseInt(
      process.env["OUTDATED_MINOR_DEPENDENCIES_COUNT"]!,
    ),
    outdatedPatchDependenciesCount: Number.parseInt(
      process.env["OUTDATED_PATCH_DEPENDENCIES_COUNT"]!,
    ),

    outdatedMajorDependenciesPercentage: Number.parseFloat(
      process.env["OUTDATED_MAJOR_DEPENDENCIES_PERCENTAGE"]!,
    ),
    outdatedMinorDependenciesPercentage: Number.parseFloat(
      process.env["OUTDATED_MINOR_DEPENDENCIES_PERCENTAGE"]!,
    ),
    outdatedPatchDependenciesPercentage: Number.parseFloat(
      process.env["OUTDATED_PATCH_DEPENDENCIES_PERCENTAGE"]!,
    ),
  };

  for (const [key, value] of Object.entries(result)) {
    if (value === undefined) {
      throw new Error(`"${key}" is undefined`);
    }
    if (Number.isNaN(value)) {
      throw new Error(`"${key}" is NaN`);
    }
  }

  return result;
};

const getMetricsType = (repository: string, name: string) => {
  return `custom.googleapis.com/outdate-check/${repository}/${name}`;
};

const result = getMetrics();

const client = new MetricServiceClient();

const projectId = process.env["GCP_PROJECT_ID"]!;
const repository = process.env["GITHUB_REPOSITORY"]!;

const now = new Date().getTime();

const interval = {
  endTime: {
    seconds: now / 1000,
  },
};

const resource = {
  type: "global",
  labels: {
    project_id: projectId,
  },
};

const keys = Object.keys(result) as (keyof Result)[];

console.log("keys", keys);
const timeSeries = keys.map((key): protos.google.monitoring.v3.ITimeSeries => {
  const valueKey = key.includes("Count") ? "int64Value" : "doubleValue";
  const point = {
    interval,
    value: {
      [valueKey]: result[key],
    },
  };
  return {
    metric: {
      type: getMetricsType(repository, key),
    },
    resource,
    points: [point],
  };
});

const request = {
  name: client.projectPath(projectId),
  timeSeries,
};

await client.createTimeSeries(request);
console.log("Done writing time series data.");
