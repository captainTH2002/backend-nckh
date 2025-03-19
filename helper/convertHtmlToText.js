const convertHtmlToText = (html) => {
    html = html.replace(/<style([\s\S]*?)<\/style>/gi, '');
    html = html.replace(/<script([\s\S]*?)<\/script>/gi, '');
    html = html.replace(/<\/div>/ig, '');
    html = html.replace(/<\/li>/ig, '');
    html = html.replace(/<li>/ig, '');
    html = html.replace(/<\/ul>/ig, '');
    html = html.replace(/\n/g, ''); // bo /n
    // html = html.replace(/\t/g, ''); // bo /t
    html = html.replace(/<img[^>]+>/ig, ''); // Loại bỏ thẻ <img>
    html = html.replace(/<video[^>]+>/ig, ''); // Loại bỏ thẻ <video>
    html = html.replace(/<\/p>/ig, '');
    html = html.replace(/<br\s*[\/]?>/gi, "");
    html = html.replace(/<a\b[^>]*>(.*?)<\/a>/ig, '');
    html = html.replace(/<[^>]+>/ig, '');
    html = html.replace(/Clone Video/ig, '');
    html = html.replace(/\s+/g, ' ')
    html = html.trim();
    return html;
}
module.exports = convertHtmlToText