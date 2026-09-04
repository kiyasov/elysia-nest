
import type { RouteMetadata } from "../decorators";
import { ROUTE_METADATA, ROUTE_PREFIX_METADATA } from "../decorators";
import type { ParamInfo } from "../decorators/param.decorators";
import { PARAMS_METADATA, ParamType } from "../decorators/param.decorators";
import type {
  ApiDocsOptions,
  ApiResponseExample,
} from "../decorators/swagger.decorator";
import { getApiDocs } from "../decorators/swagger.decorator";
import { getOrCreateSchema } from "./dto-to-schema";

/**
 * Interface representing an OpenAPI path item
 */
export interface OpenAPIPathItem {
  summary?: string;
  description?: string;
  operationId?: string;
  tags?: string[];
  parameters?: any[];
  requestBody?: any;
  responses?: Record<string, any>;
  deprecated?: boolean;
}

/**
 * Interface representing OpenAPI paths
 */
export interface OpenAPIPaths {
  [path: string]: {
    [method: string]: OpenAPIPathItem;
  };
}

/**
 * Extracts OpenAPI paths documentation from controller classes
 * @param controllers Array of controller classes
 * @returns OpenAPI paths object
 */
export function extractRouteDocs(controllers: any[]): OpenAPIPaths {
  const paths: OpenAPIPaths = {};

  for (const controllerClass of controllers) {
    // Get controller prefix
    const prefix =
      Reflect.getMetadata(ROUTE_PREFIX_METADATA, controllerClass) || "";

    // Get controller routes
    const routes: RouteMetadata[] =
      Reflect.getMetadata(ROUTE_METADATA, controllerClass) || [];

    // Skip if no routes
    if (!routes || routes.length === 0) {
      continue;
    }

    // Generate controller tag from class name
    const controllerName = controllerClass.name.replace(/Controller$/, "");
    const tag =
      controllerName.charAt(0).toLowerCase() + controllerName.slice(1);

    // Process each route
    for (const route of routes) {
      // Construct full path
      const fullPath = (prefix + route.path).replace(/:([^/]+)/g, "{$1}"); // Convert :id to {id} for OpenAPI

      // Initialize path if it doesn't exist
      if (!paths[fullPath]) {
        paths[fullPath] = {};
      }

      // Get method parameters
      const paramsMeta: ParamInfo[] =
        Reflect.getMetadata(
          PARAMS_METADATA,
          controllerClass,
          route.propertyKey,
        ) || [];

      // Get API docs if available
      const apiDocs = getApiDocs(controllerClass, route.propertyKey);

      // Generate route documentation
      const pathItem = generatePathItem(
        controllerClass,
        route,
        paramsMeta,
        tag,
        apiDocs,
      );

      // Add to paths
      paths[fullPath][route.method] = pathItem;
    }
  }

  return paths;
}

/**
 * Generates an OpenAPI path item from route metadata
 * @param controllerClass Controller class
 * @param route Route metadata
 * @param params Parameter metadata
 * @param tag Tag to associate with the operation
 * @param apiDocs Custom API documentation
 * @returns OpenAPI path item
 */
function generatePathItem(
  controllerClass: any,
  route: RouteMetadata,
  params: ParamInfo[],
  tag: string,
  apiDocs?: ApiDocsOptions,
): OpenAPIPathItem {
  const methodName = route.propertyKey.toString();

  // Base path item with default values
  const pathItem: OpenAPIPathItem = {
    summary: apiDocs?.summary || `${methodName}`,
    description: apiDocs?.description || `${methodName} endpoint`,
    operationId: `${tag}_${methodName}`,
    tags: apiDocs?.tags || [tag],
    parameters: [],
    deprecated: apiDocs?.deprecated,
    responses: {
      "200": {
        description: "Successful response",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: {
                  type: "boolean",
                  example: true,
                },
              },
            },
          },
        },
      },
      "400": {
        description: "Bad Request",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: {
                  type: "boolean",
                  example: false,
                },
                message: {
                  type: "string",
                  example: "Validation failed",
                },
                errors: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      property: {
                        type: "string",
                      },
                      constraints: {
                        type: "object",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  // Add custom responses if provided
  if (apiDocs?.responses && pathItem.responses) {
    for (const [statusCode, responseData] of Object.entries(
      apiDocs.responses,
    )) {
      const response = responseData as ApiResponseExample;

      const responseContent = response.schema
        ? {
            content: {
              "application/json": {
                schema: response.schema,
                ...(response.examples
                  ? { examples: response.examples }
                  : response.example
                    ? {
                        examples: {
                          default: {
                            summary: "Example response",
                            value: response.example,
                          },
                        },
                      }
                    : {}),
              },
            },
          }
        : {};

      pathItem.responses[statusCode] = {
        description: response.description || "Response description",
        ...responseContent,
      };
    }
  }

  // Use request DTO from API docs if provided
  const requestDto = apiDocs?.request;

  // Process parameters
  let requestBody: any = null;
  let hasBodyParam = false;
  let hasFormParam = false;
  let hasFileParam = false;

  for (const param of params) {
    switch (param.type) {
      case ParamType.PARAMS:
        // Add path parameter
        if (param.paramName && pathItem.parameters) {
          pathItem.parameters.push({
            name: param.paramName,
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            example:
              apiDocs?.requestExample && apiDocs.requestExample[param.paramName]
                ? apiDocs.requestExample[param.paramName]
                : undefined,
          });
        }
        break;

      case ParamType.QUERY:
        // Add query parameter
        if (param.paramName && pathItem.parameters) {
          const schema = param.dto
            ? getOrCreateSchema(param.dto)
            : { type: "string" };
          pathItem.parameters.push({
            name: param.paramName,
            in: "query",
            schema: schema || { type: "string" },
            example:
              apiDocs?.requestExample && apiDocs.requestExample[param.paramName]
                ? apiDocs.requestExample[param.paramName]
                : undefined,
          });
        } else if (param.dto && pathItem.parameters) {
          // If querying all parameters with a DTO, generate them individually
          const schema = getOrCreateSchema(param.dto);
          if (schema) {
            for (const propName in schema.properties) {
              pathItem.parameters.push({
                name: propName,
                in: "query",
                schema: schema.properties[propName],
              });
            }
          }
        }
        break;

      case ParamType.BODY:
        // Track that we have a body parameter
        hasBodyParam = true;

        // Use the provided request DTO or the param DTO
        const bodyDto = requestDto || param.dto;

        // Add request body schema
        if (bodyDto) {
          const schema = getOrCreateSchema(bodyDto);
          if (schema) {
            const examples = apiDocs?.requestExamples
              ? { examples: apiDocs.requestExamples }
              : apiDocs?.requestExample
                ? {
                    examples: {
                      default: {
                        summary: "Example request",
                        value: apiDocs.requestExample,
                      },
                    },
                  }
                : {};

            requestBody = {
              required: true,
              content: {
                "application/json": {
                  schema: schema,
                  ...examples,
                },
              },
            };
          }
        } else {
          requestBody = {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                },
              },
            },
          };
        }
        break;

      case ParamType.FORM:
        // Track that we have a form parameter
        hasFormParam = true;

        // Use the provided request DTO or the param DTO
        const formDto = requestDto || param.dto;

        // Add form request body
        if (formDto) {
          const schema = getOrCreateSchema(formDto);
          if (schema) {
            // For form data, we need to determine the appropriate content type
            const contentType = hasFileParam
              ? "multipart/form-data"
              : "application/x-www-form-urlencoded";

            // Get the example data - always prefer explicit contentType if specified
            const finalContentType = apiDocs?.contentType || contentType;

            // Extract example data - make it more prominent
            const examples = apiDocs?.requestExamples
              ? { examples: apiDocs.requestExamples }
              : apiDocs?.requestExample
                ? {
                    examples: {
                      default: {
                        summary: "Example request",
                        value: apiDocs.requestExample,
                      },
                    },
                  }
                : {};

            requestBody = {
              required: true,
              description:
                apiDocs?.requestBodyDescription ||
                apiDocs?.requestBody?.description ||
                "Form data",
              content: {
                [finalContentType]: {
                  schema: schema,
                  ...examples,
                },
              },
            };

            // Special handling for Swagger UI to ensure the form example shows up
            if (schema.properties) {
              // Apply field examples to properties directly
              for (const key in schema.properties) {
                // Check if the property exists
                if (schema.properties[key]) {
                  // First check if we have individual field examples
                  if (apiDocs?.fieldExamples && apiDocs.fieldExamples[key]) {
                    const fieldExample = apiDocs.fieldExamples[key];
                    if (fieldExample) {
                      schema.properties[key].example = fieldExample.value;
                      if (fieldExample.summary) {
                        schema.properties[key].description =
                          fieldExample.summary;
                      }
                    }
                  }
                  // Otherwise use the requestExample if available
                  else if (
                    apiDocs?.requestExample &&
                    apiDocs.requestExample[key] !== undefined
                  ) {
                    schema.properties[key].example =
                      apiDocs.requestExample[key];
                  }
                }
              }
            }
          }
        }
        break;

      case ParamType.FILE:
        // Track that we have a file parameter
        hasFileParam = true;

        // Add file upload
        requestBody = requestBody || {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {},
              },
            },
          },
        };

        // Ensure schema structure exists
        if (!requestBody.content["multipart/form-data"]) {
          requestBody.content["multipart/form-data"] = {
            schema: { type: "object", properties: {} },
          };
        }

        if (!requestBody.content["multipart/form-data"].schema) {
          requestBody.content["multipart/form-data"].schema = {
            type: "object",
            properties: {},
          };
        }

        if (!requestBody.content["multipart/form-data"].schema.properties) {
          requestBody.content["multipart/form-data"].schema.properties = {};
        }

        // Add specific file field or generic file field
        const fileFieldName = param.paramName || "file";
        requestBody.content["multipart/form-data"].schema.properties[
          fileFieldName
        ] = {
          type: "string",
          format: "binary",
          description: `File upload field${param.paramName ? " " + param.paramName : ""}`,
        };

        // Set the description if provided
        if (
          apiDocs?.requestBodyDescription ||
          apiDocs?.requestBody?.description
        ) {
          requestBody.description =
            apiDocs?.requestBodyDescription ||
            apiDocs?.requestBody?.description;
        }

        // Add examples if available
        if (apiDocs?.requestExample && requestDto) {
          const schema = getOrCreateSchema(requestDto);
          if (schema && schema.properties) {
            // Add individual form field examples (for the non-file fields)
            for (const key in schema.properties) {
              if (schema.properties[key] && apiDocs.requestExample[key]) {
                // Add example to the property if it exists in the requestBody
                if (
                  requestBody.content["multipart/form-data"].schema.properties[
                    key
                  ]
                ) {
                  requestBody.content["multipart/form-data"].schema.properties[
                    key
                  ].example = apiDocs.requestExample[key];
                } else {
                  // Add the property with example if it doesn't exist yet
                  requestBody.content["multipart/form-data"].schema.properties[
                    key
                  ] = {
                    ...schema.properties[key],
                    example: apiDocs.requestExample[key],
                  };
                }
              }
            }
          }
        }

        break;

      case ParamType.FILES:
        // Track that we have a file parameter
        hasFileParam = true;

        // Add multiple file upload
        requestBody = requestBody || {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {},
              },
            },
          },
        };

        // Ensure schema structure exists
        if (!requestBody.content["multipart/form-data"]) {
          requestBody.content["multipart/form-data"] = {
            schema: { type: "object", properties: {} },
          };
        }

        if (!requestBody.content["multipart/form-data"].schema) {
          requestBody.content["multipart/form-data"].schema = {
            type: "object",
            properties: {},
          };
        }

        if (!requestBody.content["multipart/form-data"].schema.properties) {
          requestBody.content["multipart/form-data"].schema.properties = {};
        }

        // Add files array field
        const filesFieldName = param.paramName || "files";
        requestBody.content["multipart/form-data"].schema.properties[
          filesFieldName
        ] = {
          type: "array",
          items: {
            type: "string",
            format: "binary",
          },
          description: `Multiple file upload field${param.paramName ? " " + param.paramName : ""}`,
        };

        // Set the description if provided
        if (
          apiDocs?.requestBodyDescription ||
          apiDocs?.requestBody?.description
        ) {
          requestBody.description =
            apiDocs?.requestBodyDescription ||
            apiDocs?.requestBody?.description;
        }

        // Add examples if available
        if (apiDocs?.requestExample && requestDto) {
          const schema = getOrCreateSchema(requestDto);
          if (schema && schema.properties) {
            // Add individual form field examples (for the non-file fields)
            for (const key in schema.properties) {
              if (schema.properties[key] && apiDocs.requestExample[key]) {
                // Add example to the property if it exists in the requestBody
                if (
                  requestBody.content["multipart/form-data"].schema.properties[
                    key
                  ]
                ) {
                  requestBody.content["multipart/form-data"].schema.properties[
                    key
                  ].example = apiDocs.requestExample[key];
                } else {
                  // Add the property with example if it doesn't exist yet
                  requestBody.content["multipart/form-data"].schema.properties[
                    key
                  ] = {
                    ...schema.properties[key],
                    example: apiDocs.requestExample[key],
                  };
                }
              }
            }
          }
        }

        break;
    }
  }

  // If we have a request DTO but no parameters, add it as a request body
  if (requestDto && !hasBodyParam && !hasFormParam && !hasFileParam) {
    const schema = getOrCreateSchema(requestDto);
    if (schema) {
      // Check if this is a form submission or file upload based on ApiDocs metadata
      const isFormData = apiDocs?.formData === true;
      const isFileUpload = apiDocs?.fileUpload === true;

      const examples = apiDocs?.requestExamples
        ? { examples: apiDocs.requestExamples }
        : apiDocs?.requestExample
          ? {
              examples: {
                default: {
                  summary: "Example request",
                  value: apiDocs.requestExample,
                },
              },
            }
          : {};

      // Determine the appropriate content type
      let contentType = "application/json";
      if (apiDocs?.contentType) {
        contentType = apiDocs.contentType;
      } else if (isFileUpload || (isFormData && hasFileParam)) {
        contentType = "multipart/form-data";
      } else if (isFormData) {
        contentType = "application/x-www-form-urlencoded";
      }

      requestBody = {
        required: true,
        description:
          apiDocs?.requestBodyDescription || apiDocs?.requestBody?.description,
        content: {
          [contentType]: {
            schema: schema,
            ...examples,
          },
        },
      };

      // Apply field examples to schema properties to make them show up in Swagger UI
      // This ensures examples show up for all endpoints, including regular JSON endpoints
      if (schema.properties) {
        // Apply field examples to properties directly
        for (const key in schema.properties) {
          // Check if the property exists
          if (schema.properties[key]) {
            // First check if we have individual field examples
            if (apiDocs?.fieldExamples && apiDocs.fieldExamples[key]) {
              const fieldExample = apiDocs.fieldExamples[key];
              if (fieldExample) {
                schema.properties[key].example = fieldExample.value;
                if (fieldExample.summary) {
                  schema.properties[key].description = fieldExample.summary;
                }
              }
            }
            // Otherwise use the requestExample if available
            else if (
              apiDocs?.requestExample &&
              apiDocs.requestExample[key] !== undefined
            ) {
              schema.properties[key].example = apiDocs.requestExample[key];
            }
          }
        }
      }
    }
  }

  // Add request body if present
  if (requestBody) {
    // Add request body metadata if provided
    if (apiDocs?.requestBody) {
      if (apiDocs.requestBody.description) {
        requestBody.description = apiDocs.requestBody.description;
      }
      if (apiDocs.requestBody.required !== undefined) {
        requestBody.required = apiDocs.requestBody.required;
      }
    }

    pathItem.requestBody = requestBody;
  }

  return pathItem;
}
