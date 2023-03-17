import { urlSegmentToInstagramId } from "instagram-id-to-url-segment";
import { IgApiClient } from "instagram-private-api";
import { InputMedia } from "grammy/out/types";
/* import NodeCache from "node-cache"; */

/* const cache = new NodeCache(); */

const loginInTostagram = async (): Promise<any> => {
/*   const cachedData = cache.get("ig");

  if (cachedData) return cachedData; */

  const ig = new IgApiClient();

  //login to instagram
  ig.state.generateDevice(process.env.insta_username!);
  await ig.account.login(
    process.env.insta_username!,
    process.env.insta_password!
  );

/*   cache.set("ig", ig, 60 ** 2); */

  return ig;
};

const isInstagramUrl = (url: string) => {
  return url.startsWith("https://www.instagram.com/");
};

async function getSlidesInputMedia(postUrl: string): Promise<InputMedia[]> {
  const ig: IgApiClient = await loginInTostagram();

  //get the post id in the url and generate an instagram id
  const postId = urlSegmentToInstagramId(postUrl.split("/")[4]);

  //get the infos of post
  const postInfos: any = await ig.media.info(postId);

  //the actual post datas
  const postItem = postInfos.items[0];

  //if the post has only one slide of video or photo, it should be handeled like this
  if (postItem.media_type === 1)
    return [
      { media: postItem.image_versions2.candidates[0].url, type: "video" },
    ];
  else if (postItem.media_type === 2)
    return [{ media: postItem.video_versions[0].url, type: "video" }];

  const slides = postItem.carousel_media || postItem.video_versions;

  //get the urls of all slides
  const urls: InputMedia[] = slides.map((post: any) => {
    //type 2 is video and type 1 is photo
    if (post.media_type === 2) {
      return {
        media: post.video_versions[0].url,
        type: "video",
      };
    } else {
      return {
        media: post.image_versions2.candidates[0].url,
        type: "photo",
      };
    }
  });

  return urls;
}

export { isInstagramUrl, getSlidesInputMedia };
