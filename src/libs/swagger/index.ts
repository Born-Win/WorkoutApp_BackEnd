import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const HTTP_EXCEPTION_DEFAULT_RESPONSE = {
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            default: 'false'
          },
          message: {
            type: 'string'
          }
        }
      }
    }
  }
};

export const setHttpExceptionResponseMessageProps = (
  schemaProperties: SchemaObject['properties'][string]
) => {
  const responseObject = structuredClone(HTTP_EXCEPTION_DEFAULT_RESPONSE);
  for (const prop in schemaProperties) {
    responseObject.content['application/json'].schema.properties.message[prop] =
      schemaProperties[prop];
  }
  return responseObject;
};

export const generateSuccessfulContentObject = (
  schemaProperties?: SchemaObject['properties']
) => {
  return {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              default: 'true'
            },
            ...schemaProperties
          }
        }
      }
    }
  };
};
