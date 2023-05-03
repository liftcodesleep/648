import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SinglePostClass from "../SinglePost/singlepost";
import Cookies from "js-cookie";

jest.mock("js-cookie");

describe("SinglePostClass", () => {
  beforeEach(() => {
    jest.spyOn(console, "error");
    console.error.mockImplementation(() => {});
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
    window.alert.mockRestore();
  });

  //   test("should display a post with correct information", async () => {
  //     console.info("should display a post with correct information");
  //     Cookies.get.mockReturnValue("testToken");
  //     const post = {
  //       post_id: 1,
  //       image: "testImageURL",
  //       desc: "Test description",
  //       made_by: "TestUser",
  //       no_views: 5,
  //       no_likes: 3,
  //       no_dislikes: 1,
  //       creation_date: "2023-01-01",
  //       category: "Nature",
  //     };
  //     global.fetch = jest.fn().mockResolvedValue({
  //       json: () =>
  //         Promise.resolve({
  //           status: "SUCCESS",
  //           post: post,
  //         }),
  //     });

  //     const { getByText } = render(
  //       <BrowserRouter>
  //         <SinglePostClass />
  //       </BrowserRouter>
  //     );

  //     await waitFor(() => {
  //       expect(getByText("TestUser")).toBeInTheDocument();
  //       expect(getByText(`${post.no_views} Views`)).toBeInTheDocument();
  //       expect(getByText(`${post.no_likes} Likes`)).toBeInTheDocument();
  //       expect(getByText(`${post.no_dislikes} Dislikes`)).toBeInTheDocument();
  //       expect(getByText(post.category)).toBeInTheDocument();
  //     });
  //   });

  test("should allow for liking a post", async () => {
    console.info("should allow for liking a post");
    Cookies.get.mockReturnValue("testToken");
    const post = {
      // ...post properties
    };
    global.fetch = jest.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          status: "SUCCESS",
          post: { ...post, no_likes: post.no_likes + 1 },
        }),
    });

    const { getByText, getByTestId } = render(
      <BrowserRouter>
        <SinglePostClass match={{ params: { id: post.post_id } }} />
      </BrowserRouter>
    );

    const likeIcon = getByTestId("like-icon"); // Update the test ID here
    fireEvent.click(likeIcon);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        "http://127.0.0.1:8000/like_post",
        expect.objectContaining({
          body: JSON.stringify({
            post_id: post.post_id,
            action: "LIKE",
          }),
        })
      );
      expect(getByText(`${post.no_likes + 1}`)).toBeInTheDocument();
    });
  });

  test("should allow for disliking a post", async () => {
    console.info("should allow for disliking a post");
    Cookies.get.mockReturnValue("testToken");
    const post = {
      post_id: 1,
      image: "testImageURL",
      desc: "Test description",
      made_by: "TestUser",
      no_views: 5,
      no_likes: 3,
      no_dislikes: 1,
      creation_date: "2023-01-01",
      category: "Nature",
    };
    global.fetch = jest.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          status: "SUCCESS",
          post: { ...post, no_dislikes: post.no_dislikes + 1 },
        }),
    });

    const { getByText } = render(
      <BrowserRouter>
        <SinglePostClass match={{ params: { id: post.post_id } }} />
      </BrowserRouter>
    );

    const dislikeButton = getByText("Dislike");
    fireEvent.click(dislikeButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        "http://127.0.0.1:8000/like_post",
        expect.objectContaining({
          body: JSON.stringify({
            post_id: post.post_id,
            action: "DISLIKE",
          }),
        })
      );
      expect(getByText(`${post.no_dislikes + 1} Dislikes`)).toBeInTheDocument();
    });
  });
  test("should allow for reposting a post", async () => {
    console.info("should allow for reposting a post");
    Cookies.get.mockReturnValue("testToken");
    const post = {
      post_id: 1,
      image: "testImageURL",
      desc: "Test description",
      made_by: "TestUser",
      no_views: 5,
      no_likes: 3,
      no_dislikes: 1,
      creation_date: "2023-01-01",
      category: "Nature",
    };
    global.fetch = jest.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          status: "SUCCESS",
          post: post,
        }),
    });

    const { getByText } = render(
      <BrowserRouter>
        <SinglePostClass match={{ params: { id: post.post_id } }} />
      </BrowserRouter>
    );

    const repostButton = getByText("Repost");
    fireEvent.click(repostButton);
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        "http://127.0.0.1:8000/repost_post",
        expect.objectContaining({
          body: JSON.stringify({
            post_id: post.post_id,
          }),
        })
      );
    });
  });

  test("should allow for sharing a post", async () => {
    console.info("should allow for sharing a post");
    Cookies.get.mockReturnValue("testToken");
    const post = {
      post_id: 1,
      image: "testImageURL",
      desc: "Test description",
      made_by: "TestUser",
      no_views: 5,
      no_likes: 3,
      no_dislikes: 1,
      creation_date: "2023-01-01",
      category: "Nature",
    };
    global.fetch = jest.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          status: "SUCCESS",
          post: post,
        }),
    });

    const { getByText } = render(
      <BrowserRouter>
        <SinglePostClass match={{ params: { id: post.post_id } }} />
      </BrowserRouter>
    );

    const shareButton = getByText("Share");
    fireEvent.click(shareButton);
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        "http://127.0.0.1:8000/share_post",
        expect.objectContaining({
          body: JSON.stringify({
            post_id: post.post_id,
          }),
        })
      );
    });
  });
});
