import 'vite/types/pngDataUrlLoader.d.ts';

declare module 'vite/types/pngDataUrlLoader.d.ts' {
  declare module '*?dataUrl' {
    const src: string;
    export default src;
  }
}
