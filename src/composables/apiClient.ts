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
        },
        search(search: string, page: number, size: number): Promise<SkillSearch> {
            const currentOptions: FetchOptions<'json'> = {
                method: 'GET',
                query: {
                    search: search,
                    page: page,
                    size: size
                }
            };
            return apiClient<SkillSearch>('/skills', currentOptions);
        },
        find(names: string[]): Promise<SkillSearch> {
            const currentOptions: FetchOptions<'json'> = {
                method: 'GET',
                query: {
                    name: names
                }
            };
            return apiClient<SkillSearch>('/find', currentOptions);
        }
    }
}