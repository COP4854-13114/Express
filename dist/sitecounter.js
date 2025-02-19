"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteCounter = void 0;
class SiteCounter {
    constructor() {
        this.Url = '';
        this.Count = 0;
        this.Method = 'GET';
    }
    IncrementCount() {
        this.Count++;
    }
}
exports.SiteCounter = SiteCounter;
