// Generic per-HTTP-status fallback text - used only when the backend's response body didn't
// carry a more specific message (see extractAxiosError). Covers cases that never reach our
// own error handler, e.g. an infra-level proxy 502/504 in front of the app.
export const STATUS_MESSAGES: Record<number, string> = {
  401: 'Unauthorized.',
  403: 'Forbidden; you do not have permission to perform this action.',
  408: 'Request Timeout; the server took too long to respond.',
  413: 'Request Entity Too Large.',
  429: 'Too Many Requests; please wait before trying again.',
  500: 'Internal Server Error.',
  502: 'Bad Gateway; the server is unreachable.',
  503: 'Service Unavailable; the server is temporarily down.',
  504: 'Gateway Timeout; the server did not respond in time.',
}
