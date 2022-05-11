
import { readFileSync } from 'fs';
import { marked } from 'marked';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest } from './types';

const rglr = readFileSync(`${__dirname}/../_fonts/Fira-Sans-Regular.woff2`).toString('base64');
const medm = readFileSync(`${__dirname}/../_fonts/Fira-Sans-Medium.woff2`).toString('base64');
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString('base64');

function getCss(theme: string, fontSize: string) {
    let background = '#fff';
    let foreground = 'black';

    if (theme === 'dark') {
        background = '#161b28';
        foreground = 'white';
    }
    return `
    @font-face {
        font-family: 'Fira Sans';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Fira Sans';
        font-style:  normal;
        font-weight: 500;
        src: url(data:font/woff2;charset=utf-8;base64,${medm}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
      }

    body {
        background: ${background};
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        -webkit-overflow-scrolling: touch;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        -webkit-text-size-adjust: 100%;
        text-rendering: optimizeLegibility;
        font-feature-settings: 'pnum';
        font-variant-numeric: proportional-nums;
    }

    .wrapper {
        display: flex;
        width: 1024px;
        height: 768px;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .logo {
        margin: 0 75px;
        border-radius: 10px;
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }

    .mu1_2 {
        margin-bottom: 13.6px
    }
    .mu1 {
        margin-bottom: 27.2px
    }
    
    .heading {
        font-family: 'Fira Sans', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: 500;
        color: ${foreground};
        line-height: 1.15;
    }

    .description {
        margin: 0;
        font-family: 'Fira Sans', sans-serif;
        font-size: 40px;
        font-style: normal;
        color: ${foreground};
        line-height: 1.36;
    }`;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { text, theme, md, fontSize, images, widths, heights, description } = parsedReq;
    return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize)}
    </style>
    <body>
        <div class="wrapper">
            <div class="logo-wrapper">
                ${images.map((img, i) =>
        getPlusSign(i) + getImage(img, widths[i], heights[i])
    ).join('')}
            </div>
            <div class="mu1"></div>
            <div class="heading">${md ? marked(text) : sanitizeHtml(text)}</div>
            <div class="mu1_2"></div>
            <p class="description">${sanitizeHtml(description)}</p>
        </div>
    </body>
</html>`;
}

function getImage(src: string, width = 'auto', height = '225') {
    return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`
}

function getPlusSign(i: number) {
    return i === 0 ? '' : '<div class="plus">+</div>';
}
