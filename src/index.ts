// 导入课程元数据
import metadata from '../data/metadata.json';

// 导入课程内容文件
import lesson1001 from '../data/lessons/1001.ron';
import lesson1002 from '../data/lessons/1002.ron';
import lesson1003 from '../data/lessons/1003.ron';

// 课程内容映射表
const lessonsContent: Record<number, string> = {
  1001: lesson1001,
  1002: lesson1002,
  1003: lesson1003,
};

// CORS 响应头
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// JSON 响应头
const jsonHeaders = {
  ...corsHeaders,
  'Content-Type': 'application/json; charset=utf-8',
};

// 文本响应头
const textHeaders = {
  ...corsHeaders,
  'Content-Type': 'text/plain; charset=utf-8',
};

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // 处理 OPTIONS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // 只接受 GET 请求
    if (request.method !== 'GET') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: jsonHeaders,
        }
      );
    }

    // 路由处理
    try {
      // GET /api/lessons - 返回课程列表
      if (path === '/api/lessons') {
        return new Response(JSON.stringify(metadata), {
          status: 200,
          headers: jsonHeaders,
        });
      }

      // GET /api/lessons/:id - 返回具体课程内容
      const lessonMatch = path.match(/^\/api\/lessons\/(\d+)$/);
      if (lessonMatch) {
        const lessonId = parseInt(lessonMatch[1], 10);
        const content = lessonsContent[lessonId];

        if (content) {
          return new Response(content, {
            status: 200,
            headers: textHeaders,
          });
        }

        return new Response(
          JSON.stringify({
            error: 'Lesson not found',
            message: `课程 ID ${lessonId} 不存在`,
          }),
          {
            status: 404,
            headers: jsonHeaders,
          }
        );
      }

      // 404 - 路由不存在
      return new Response(
        JSON.stringify({
          error: 'Not found',
          message: '请求的路径不存在',
          available_routes: [
            'GET /api/lessons - 获取课程列表',
            'GET /api/lessons/:id - 获取课程内容',
          ],
        }),
        {
          status: 404,
          headers: jsonHeaders,
        }
      );
    } catch (error) {
      // 500 - 服务器错误
      console.error('Server error:', error);
      return new Response(
        JSON.stringify({
          error: 'Internal server error',
          message: '服务器内部错误',
        }),
        {
          status: 500,
          headers: jsonHeaders,
        }
      );
    }
  },
};
