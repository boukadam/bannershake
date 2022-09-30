export async function onRequest(context) {
    // Contents of context object
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;

    const svg = '<svg height="100" width="100">' +
        '  <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />' +
        '  Sorry, your browser does not support inline SVG.  ' +
        '</svg> '

    return new Response(svg, {
        status: 200,
        statusText: 'OK',
        headers: {
            'Content-Type': 'image/svg+xml'
        }
    });
}