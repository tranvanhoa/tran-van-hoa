import {
  ApiResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { BaseResponse } from '../interfaces/base.response';
import { PagingRo } from '../interfaces/response-objects/paging.ro';

export const CustomSwaggerApiResponse = (
  ref?: string,
  apiResponseOptions: ApiResponseOptions = {},
) => {
  apiResponseOptions.status = apiResponseOptions.status || 200;
  return ApiResponse({
    status: 200,
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponse) },
        {
          properties: {
            data: {
              type: 'object',
              $ref: ref,
            },
          },
        },
      ],
    },
    ...apiResponseOptions,
  });
};

export const CustomSwaggerPagingApiResponse = (
  ref?: string,
  apiResponseOptions: ApiResponseOptions = {},
) => {
  apiResponseOptions.status = apiResponseOptions.status || 200;
  return ApiResponse({
    status: 200,
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponse) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(PagingRo),
              type: 'object',
              properties: {
                items: {
                  type: 'array',
                  items: {
                    $ref: ref,
                    type: 'object',
                  },
                },
              },
            },
          },
        },
      ],
    },
    ...apiResponseOptions,
  });
};
