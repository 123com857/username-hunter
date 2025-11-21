import { Site, SiteCategory } from '../types';

// A curated list representing the 450+ capability. 
// In a real production app, this list would be much longer or loaded from an external JSON.
export const SITE_LIST: Site[] = [
    // --- Developer ---
    { name: 'GitHub', url: 'https://github.com/{}', checkUrl: 'https://api.github.com/users/{}', category: SiteCategory.DEV },
    { name: 'GitLab', url: 'https://gitlab.com/{}', category: SiteCategory.DEV },
    { name: 'NPM', url: 'https://www.npmjs.com/~{}', category: SiteCategory.DEV },
    { name: 'PyPi', url: 'https://pypi.org/user/{}', category: SiteCategory.DEV },
    
    // --- Social ---
    { name: 'Twitter (X)', url: 'https://x.com/{}', category: SiteCategory.SOCIAL },
    { name: 'Facebook', url: 'https://www.facebook.com/{}', category: SiteCategory.SOCIAL },
    { name: 'Instagram', url: 'https://www.instagram.com/{}', category: SiteCategory.SOCIAL },
    { name: 'Reddit', url: 'https://www.reddit.com/user/{}', checkUrl: 'https://www.reddit.com/user/{}/about.json', category: SiteCategory.SOCIAL },
    { name: 'Pinterest', url: 'https://www.pinterest.com/{}/', category: SiteCategory.SOCIAL },
    { name: 'Telegram', url: 'https://t.me/{}', category: SiteCategory.SOCIAL },
    { name: 'Tumblr', url: 'https://{}.tumblr.com', category: SiteCategory.SOCIAL },
    { name: 'Mastodon (Social)', url: 'https://mastodon.social/@{}', category: SiteCategory.SOCIAL },
    
    // --- Video ---
    { name: 'YouTube', url: 'https://www.youtube.com/@{}', category: SiteCategory.VIDEO },
    { name: 'Twitch', url: 'https://www.twitch.tv/{}', category: SiteCategory.VIDEO },
    { name: 'Vimeo', url: 'https://vimeo.com/{}', category: SiteCategory.VIDEO },
    { name: 'TikTok', url: 'https://www.tiktok.com/@{}', category: SiteCategory.VIDEO },
    
    // --- Gaming ---
    { name: 'Steam', url: 'https://steamcommunity.com/id/{}', category: SiteCategory.GAMING },
    { name: 'Roblox', url: 'https://www.roblox.com/user.aspx?username={}', category: SiteCategory.GAMING },
    { name: 'Minecraft (NameMC)', url: 'https://namemc.com/profile/{}', category: SiteCategory.GAMING },
    { name: 'Osu!', url: 'https://osu.ppy.sh/users/{}', category: SiteCategory.GAMING },
    
    // --- Design/Art ---
    { name: 'Behance', url: 'https://www.behance.net/{}', category: SiteCategory.OTHER },
    { name: 'Dribbble', url: 'https://dribbble.com/{}', category: SiteCategory.OTHER },
    { name: 'DeviantArt', url: 'https://www.deviantart.com/{}', category: SiteCategory.OTHER },
    { name: 'Flickr', url: 'https://www.flickr.com/people/{}', category: SiteCategory.OTHER },
    
    // --- Adult ---
    { name: 'PornHub', url: 'https://www.pornhub.com/users/{}', category: SiteCategory.ADULT },
    { name: 'XHamster', url: 'https://xhamster.com/users/{}', category: SiteCategory.ADULT },
    { name: 'OnlyFans', url: 'https://onlyfans.com/{}', category: SiteCategory.ADULT },
    { name: 'Patreon', url: 'https://www.patreon.com/{}', category: SiteCategory.OTHER },

    // --- Chinese / Regional ---
    { name: 'Bilibili', url: 'https://space.bilibili.com/{}', category: SiteCategory.REGIONAL_CN, errorMsg: '404' }, // Note: Bilibili usually uses ID, but some handle mapping exists
    { name: 'Zhihu', url: 'https://www.zhihu.com/people/{}', category: SiteCategory.REGIONAL_CN },
    { name: 'Weibo', url: 'https://weibo.com/n/{}', category: SiteCategory.REGIONAL_CN },
    { name: 'Douyin', url: 'https://www.douyin.com/user/{}', category: SiteCategory.REGIONAL_CN },
    { name: 'XiaoHongShu', url: 'https://www.xiaohongshu.com/user/profile/{}', category: SiteCategory.REGIONAL_CN },
    { name: 'V2EX', url: 'https://www.v2ex.com/member/{}', category: SiteCategory.REGIONAL_CN },
    { name: 'Gitee', url: 'https://gitee.com/{}', category: SiteCategory.DEV },
    { name: 'CSDN', url: 'https://blog.csdn.net/{}', category: SiteCategory.DEV },
    { name: 'Juejin', url: 'https://juejin.cn/user/{}', category: SiteCategory.DEV },

    // --- Tech/News ---
    { name: 'HackerNews', url: 'https://news.ycombinator.com/user?id={}', category: SiteCategory.SOCIAL, errorMsg: "No such user" },
    { name: 'ProductHunt', url: 'https://www.producthunt.com/@{}', category: SiteCategory.OTHER },
    { name: 'Medium', url: 'https://medium.com/@{}', category: SiteCategory.BLOG },
    { name: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/User:{}', category: SiteCategory.OTHER },
    { name: 'Slack', url: 'https://{}.slack.com', category: SiteCategory.SOCIAL },
    { name: 'WordPress', url: 'https://{}.wordpress.com', category: SiteCategory.BLOG },
    { name: 'Blogger', url: 'https://{}.blogspot.com', category: SiteCategory.BLOG },
    { name: 'Pastebin', url: 'https://pastebin.com/u/{}', category: SiteCategory.DEV },
];
