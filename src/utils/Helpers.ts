import { urlSegmentToInstagramId } from "instagram-id-to-url-segment";
import { IgApiClient } from "instagram-private-api";
import { InputMedia } from "grammy/out/types";
import { cookiesDB } from "../database/deta";
import { CookieJar } from "tough-cookie";
import { IndexSigniture } from "../types/Types";

const getPostId = (postUrl: string) =>
  urlSegmentToInstagramId(postUrl.split("/")[4]);

const instaLogin = async (): Promise<IgApiClient> => {
  const username = process.env.insta_username!;
  const password = process.env.insta_password!;

  const ig = new IgApiClient();

  ig.state.generateDevice(username);

  try {
    //get the stored session cookies
    const previousSession: any = await cookiesDB.get("session_cookie");

    if (!previousSession) throw new Error();

    ig.state.deserializeCookieJar(previousSession);
  } catch (error) {
    await ig.account.login(username, password);

    //get the serialized session cookie
    const serializedSession: IndexSigniture<CookieJar.Serialized> =
      await ig.state.serializeCookieJar();

    //store the session cookie
    await cookiesDB.put(serializedSession, "session_cookie");
  }

  return ig;
};

const isInstagramUrl = (url: string) => {
  return (
    url.startsWith("https://www.instagram.com/") ||
    url.startsWith("https://instagram.com/")
  );
};

//a function to extract url/urls of a media
const getMediaUrlByMediaType = (postItem: any) => {
  let url: InputMedia[] = [];
  //type 2 is video and type 1 is photo
  //if the media has only one slide of video or photo, it should be handeled like this
  if (postItem.media_type === 1) {
    url = [
      { media: postItem.image_versions2.candidates[0].url, type: "photo" },
    ];
    return url;
  } else if (postItem.media_type === 2) {
    url = [{ media: postItem.video_versions[0].url, type: "video" }];
    return url;
  }

  const slides = postItem.carousel_media || postItem.video_versions;

  url = slides.map((post: any) => {
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

  return url;
};

const getPostInputMedia = async (postUrl: string): Promise<InputMedia[]> => {
  const ig = await instaLogin();

  //get the post id in the url and generate an instagram id
  const postId = getPostId(postUrl);

  //get the infos of post
  const postInfos: any = await ig.media.info(postId);

  //the actual post datas
  const postItem = postInfos.items[0];

  return getMediaUrlByMediaType(postItem);
};

async function getStoryInputMedia(storyUrl: string) {
  const ig = await instaLogin();

  const splitedStoryUrl = storyUrl.split("/");

  //the username of person who added the story
  const username = splitedStoryUrl[4];

  //the id of story
  let storyId = splitedStoryUrl[5];

  if (storyId.includes("?")) {
    const index = storyId.indexOf("?");
    storyId = storyId.slice(0, index);
  }

  //the id of person who added the story
  const userId = await ig.user.getIdByUsername(username);

  const reelsMedia = ig.feed.reelsMedia({ userIds: [userId] });

  //all sstories
  const stories = await reelsMedia.items();

  //the story that user want to download
  const realStory = stories.find((story) => story.pk === storyId);

  return getMediaUrlByMediaType(realStory);
}

const getProfileInputMedia = async (
  instaUsername: string
): Promise<InputMedia[]> => {
  const ig = await instaLogin();
  const userId = await ig.user.getIdByUsername(instaUsername);
  const userInfos = await ig.user.info(userId);

  return [{ media: userInfos.hd_profile_pic_url_info.url, type: "photo" }];
};

const chooseNWinnersRandomly = (users: string[], n: number) => {
  const randomUsers = [];

  if (n > users.length) n = users.length;

  for (let index = 0; index < n; index++) {
    const randomNum = Math.floor(Math.random() * users.length);
    randomUsers.push(users[randomNum]);
    users.splice(randomNum, 1);
  }

  return randomUsers;
};

const chooseWinnersFromPostComments = async (
  postUrl: string,
  nWinners: number
) => {
  const ig = await instaLogin();

  //get the post id in the url and generate an instagram id
  const postId = getPostId(postUrl);

  const commentsFeed = ig.feed.mediaComments(postId);
  const commentItems = [];

  let hasMoreComments = true;
  let counter = 1;

  //get 15 comments for 5 times in each request
  while (hasMoreComments && counter < 5) {
    const comments = await commentsFeed.items();
    commentItems.push(...comments);
    hasMoreComments = commentsFeed.isMoreAvailable();
    counter++;
  }

  //all users that commented on a post
  const allUsers = commentItems.map((comment) => comment.user.username);

  //get an array of winners
  const winners = chooseNWinnersRandomly(allUsers, nWinners);
  return winners;
};

const getPostCaption = async (postUrl: string) => {
  const ig = await instaLogin();

  const postId = getPostId(postUrl);

  const mediaInfo = await ig.media.info(postId);

  //return caption text of the post
  return mediaInfo.items[0].caption.text;
};

export {
  isInstagramUrl,
  getPostInputMedia,
  getStoryInputMedia,
  getProfileInputMedia,
  chooseWinnersFromPostComments,
  getPostCaption,
};
