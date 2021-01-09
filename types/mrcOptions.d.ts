interface MrcOptions {
    frameWork: 'react'|'vue'|'other';
    isDev?: boolean;
    useInlineStyle: boolean;
    devServer: Record<string, unknown>;
    loaders: {
        'url-loader': {
            fonts: object;
            images: object;
        }
    } & Record<string, unknown>;
    plugins: {
        copy: Array<{
            from: string;
            to: string;
        }>;
        define: Record<string, unknown>;
    } & Record<string, unknown>;
    webpackOptions: WebpackOptions;
}
