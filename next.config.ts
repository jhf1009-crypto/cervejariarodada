import type { NextConfig } from 'next';

const config:NextConfig={
 poweredByHeader:false,
 compress:true,
 images:{
  formats:['image/avif','image/webp'],
  deviceSizes:[360,390,430,640,750,828,1080,1200],
  imageSizes:[48,64,96,128,256],
  qualities:[45,50,55,60,65,70,75],
  minimumCacheTTL:2678400,
  remotePatterns:[
   {
    protocol:'https',
    hostname:'static.wixstatic.com',
    pathname:'/media/**'
   }
  ]
 },
 async headers(){
  const immutable='public, max-age=31536000, immutable';
  return [
   {source:'/events/:path*',headers:[{key:'Cache-Control',value:immutable}]},
   {source:'/products/:path*',headers:[{key:'Cache-Control',value:immutable}]},
   {source:'/team/:path*',headers:[{key:'Cache-Control',value:immutable}]}
  ];
 }
};

export default config;
