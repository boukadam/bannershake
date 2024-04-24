interface Skill {
    name: string,
    shortname: string,
    url: string,
    icon: string,
    selected?: boolean,
    visible?: boolean
}

interface Size {
    w: number,
    h: number
}

interface BannerGenerationResponse {
    query?: string,
    data: any,
    size: Size,
    offscreen: any[],
}

declare module "*.json" {
    const value: any;
    export default value;
}
