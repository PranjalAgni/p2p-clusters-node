import promClient from "prom-client";

// Custom metric
export const customMetric = new promClient.Counter({
  name: "custom_metric_total",
  help: "A custom metric to count something"
});

// Create a Gauge metric for the JSON object
export const jsonObjectMetric = new promClient.Counter({
  name: "json_object_metric",
  help: "A metric with a JSON object as value",
  labelNames: ["key1", "key2"] // Add labels if your JSON structure has specific keys
});
