import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/ai/:path*',
        destination: 'https://generativelanguage.googleapis.com/v1beta/:path*',
      },
    ];
  },
  // 添加代理配置
  serverRuntimeConfig: {
    httpProxy: process.env.NEXT_PUBLIC_API_PROXY,
  },
  // 添加webpack配置以处理代理相关的模块
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      net: false,
      tls: false,
      dns: false,
    };
    return config;
  },
};

export default nextConfig;