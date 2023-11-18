/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

//型定義だけローカルから貰ってくる
import type * as pdfjsLibType from "pdfjs-dist";
// @ts-expect-error pdfjsLib
import * as pdfjsLib from "https://cdn.jsdelivr.net/npm/pdfjs-dist@4/build/pdf.min.mjs";
//型にする
type pdfjsLibType = typeof pdfjsLibType;
// anyでimportしたpdfjsLibに型をつける
declare const pdfjsLib: pdfjsLibType;
// workerのパスを指定
//@ts-expect-error workerを手動でimport
await import("https://cdn.jsdelivr.net/npm/pdfjs-dist@4/build/pdf.worker.min.mjs");

class PDFViewer extends HTMLElement {
    private canvas: HTMLCanvasElement;
    private page = 1;
    private src = "";
    private scale = 1;
    constructor() {
        super();
        this.canvas = document.createElement("canvas");
    }

    connectedCallback() {
        this.appendChild(this.canvas);
        this.render();
    }

    static get observedAttributes() {
        return ["src", "page", "scale"];
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        const safeNumber = (value: any, fallbackNum: number) => {
            const num = Number(value);
            if (Number.isNaN(num)) return fallbackNum;
            return num;
        };
        switch (name) {
            case "src":
                this.src = newValue;
                break;
            case "page":
                this.page = safeNumber(newValue, 1);
                break;
            case "scale":
                this.scale = safeNumber(newValue, 1);
                break;
        }
    }

    async render() {
        if (this.src == null) return;
        const pdf = await pdfjsLib.getDocument(this.src).promise;
        const page = await pdf.getPage(this.page);
        const viewport = page.getViewport({ scale: this.scale });
        this.canvas.height = viewport.height;
        this.canvas.width = viewport.width;
        page.render({
            canvasContext: this.canvas.getContext("2d")!,
            viewport,
        });
    }
}
customElements.define("pdf-viewer", PDFViewer);
