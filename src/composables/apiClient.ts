import {ofetch} from "ofetch";
import type { FetchOptions } from 'ofetch';

const apiClient = ofetch.create({
    baseURL: '/',
    responseType: 'json',
});

export function useApiClient() {
    return {
        generate(skills: Skill[], brandUrl: string|undefined, color: string, logoSize: string, bannerSize: string): Promise<BannerGenerationResponse> {
            const currentOptions: FetchOptions<'json'> = {
                method: 'GET',
                query: {
                    bs: bannerSize,
                    ls: logoSize,
                    c: color,
                    b: brandUrl,
                    s: skills.map(skill => skill.shortname).join(',')
                }
            };
            return apiClient<BannerGenerationResponse>("/json", currentOptions);
        }
    }
}