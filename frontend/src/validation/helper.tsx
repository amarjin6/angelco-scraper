export function toNull(params: Array<string>, values: any) {
    const x = {...values};
    for (let i = 0; i < params.length; i++) {
        if (!x[params[i]]) {
            x[params[i]] = null;
        }
    }
    return x;
}

export function createCSVDownload(href: any) {
    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", "file.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
}
