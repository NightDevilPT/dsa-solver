// Response Format Middleware
// Formats all API responses to standard ApiResponse format
// Preserves cookies from original response

import { ApiResponse } from '@/interface/api.interface';
import { NextRequest, NextResponse } from 'next/server';

type RouteHandler = (
  request: NextRequest,
  context: { params: Promise<{ [key: string]: string }> }
) => Promise<NextResponse>;

export function responseFormatMiddleware(handler: RouteHandler) {
  return async (
    request: NextRequest,
    context: { params: Promise<{ [key: string]: string }> }
  ): Promise<NextResponse> => {
    try {
      // Execute handler
      const response = await handler(request, context);
      
      // Clone response to read body
      const clonedResponse = response.clone();
      let responseData: any;
      try {
        responseData = await clonedResponse.json();
      } catch {
        responseData = {};
      }
      const statusCode = response.status;

      // Check if already formatted
      if (responseData.success !== undefined && responseData.statusCode !== undefined) {
        return response as NextResponse; // Already formatted
      }

      // Format response
      const formattedResponse: ApiResponse = {
        data: responseData.data !== undefined ? responseData.data : (responseData.error ? null : responseData),
        error: responseData.error || null,
        message: responseData.message || (statusCode >= 200 && statusCode < 300 ? 'Success' : 'Error'),
        success: statusCode >= 200 && statusCode < 300,
        statusCode: statusCode
      };

      // Create new response with formatted data
      const formatted = NextResponse.json(formattedResponse, { status: statusCode });
      
      // Copy cookies from original response (important for authMiddleware cookies)
      (response as NextResponse).cookies.getAll().forEach((cookie) => {
        formatted.cookies.set(cookie.name, cookie.value, {
          httpOnly: cookie.httpOnly,
          secure: cookie.secure,
          sameSite: cookie.sameSite as 'strict' | 'lax' | 'none',
          maxAge: cookie.maxAge,
          path: cookie.path
        });
      });

      return formatted;
    } catch (error: any) {
      console.error('Response format middleware error:', error);
      const formattedResponse: ApiResponse = {
        data: null,
        error: error.message || 'Internal server error',
        message: 'An unexpected error occurred',
        success: false,
        statusCode: 500
      };

      return NextResponse.json(formattedResponse, { status: 500 });
    }
  };
}

