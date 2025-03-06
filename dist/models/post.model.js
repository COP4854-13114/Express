"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogPost = void 0;
class BlogPost {
    constructor(title, content) {
        this.title = '';
        this.postedBy = '';
        this.content = '';
        this.postedDate = new Date();
        this.category = undefined;
        this.title = title;
        this.content = content;
    }
}
exports.BlogPost = BlogPost;
