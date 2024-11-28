interface SkillSearch {
    total: number;
    page: number;
    size: number;
    data: Skill[];
}

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

interface Example {
    title: string,
    description: string,
    website: string
    query: string
}

declare module "*.json" {
    const value: any;
    export default value;
}

declare module 'vue-google-adsense/dist/Adsense.min.js'
declare module 'vue-google-adsense/dist/InArticleAdsense.min.js'
declare module 'vue-google-adsense/dist/InFeedAdsense.min.js'
